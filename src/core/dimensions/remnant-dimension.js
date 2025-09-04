import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function remnantDimensionCommonMultiplier() {
  let mult = new Decimal(1);

  return mult;
}

class RemnantDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.remnant, tier);
    const COST_MULTS = [null, 3, 10, 60, 120, 600, 1.3e5, 3e9, 1e20];
    this._costMultiplier = COST_MULTS[tier];
    const POWER_MULTS = [null, 1.25, 1.75, 2.5, 5, 6, 7, 8, 10];
    this._powerMultiplier = POWER_MULTS[tier];
    const BASE_COSTS = [null, 1, 40, 800, 2300, 12400, 1.33e7, 4.58e13, 1e50];
    this._baseCost = new Decimal(BASE_COSTS[tier]);
  }

  /** @returns {Decimal} */
  get cost() { return this.data.cost; }
  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  get baseAmount() {
    return this.data.baseAmount;
  }

  set baseAmount(value) {
    this.data.baseAmount = value;
  }

  get isAvailableForPurchase() {
    return InfinityDimensions.canBuy() && this.isAffordable && !this.isCapped;
  }

  get isAffordable() {
    return Currency.shattershards.gte(this.cost);
  }

  get rateOfChange() {
    const tier = this.tier;
    let toGain = DC.D0;
    toGain = InfinityDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get productionPerSecond() {
    let production = this.amount;
    return production.times(this.multiplier);
  }

  get multiplier() {
    const tier = this.tier;
    let mult = GameCache.remnantDimensionCommonMultiplier.value;
    mult = mult.times(Decimal.pow(this.powerMultiplier, Decimal.floor(this.baseAmount.div(DC.E1))));

    return mult;
  }

  get isProducing() {
    return this.amount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    let costMult = new Decimal(this._costMultiplier);
    return costMult;
  }

  get powerMultiplier() {
    return new Decimal(this._powerMultiplier);
  }

  get purchases() {
    return this.data.baseAmount;
  }

  get purchaseCap() {
    return RemnantDimensions.capIncrease.add(this.tier === 9
      ? DC.BEMAX
      : RemnantDimensions.HARDCAP_PURCHASES);
  }

  get isCapped() {
    return this.purchases.gte(this.purchaseCap);
  }

  get hardcapSSAmount() {
    return this._baseCost.times(Decimal.pow(this.costMultiplier, this.purchaseCap));
  }

  resetAmount() {
    this.amount = new Decimal(this.baseAmount);
  }

  fullReset() {
    this.cost = new Decimal(this.baseCost);
    this.amount = DC.D0;
    this.bought = DC.D0;
    this.baseAmount = DC.D0;
    this.isUnlocked = false;
  }

  // Only ever called from manual actions
  buySingle() {
    if (!this.isUnlocked) return this.unlock();
    if (!this.isAvailableForPurchase) return false;

    Currency.shattershards.purchase(this.cost);
    this.cost = Decimal.round(this.cost.times(this.costMultiplier));
    this.amount = this.amount.plus(1);
    this.baseAmount = this.baseAmount.add(1);

    return true;
  }

  buyMax(auto) {
    if (!this.isAvailableForPurchase) return false;

    const costScaling = new LinearCostScaling(
      Currency.shattershards.value,
      this.cost,
      this.costMultiplier,
      purchasesUntilHardcap
    );

    if (costScaling.purchases.lte(0)) return false;

    Currency.shattershards.purchase(costScaling.totalCost);
    this.cost = this.cost.times(costScaling.totalCostMultiplier);
    this.bought = this.bought.plus(costScaling.purchases);
    this.amount = this.amount.plus(costScaling.purchases);
    this.baseAmount = DC.D1.times(costScaling.purchases).add(this.baseAmount);

    return true;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {RemnantDimensionState}
 */
export const RemnantDimension = RemnantDimensionState.createAccessor();

export const RemnantDimensions = {
  /**
   * @type {RemnantDimensionState[]}
   */
  all: RemnantDimension.index.compact(),
  HARDCAP_PURCHASES: DC.E500000,

  resetAmount() {
    Currency.shatterPower.reset();
    for (const dimension of RemnantDimensions.all) {
      dimension.resetAmount();
    }
  },

  fullReset() {
    for (const dimension of RemnantDimensions.all) {
      dimension.fullReset();
    }
  },

  get totalDimCap() {
    return this.HARDCAP_PURCHASES;
  },

  canBuy() {
    return true;
  },

  canAutobuy() {
    return this.canBuy();
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      RemnantDimension(tier).produceDimensions(RemnantDimension(tier - 1), diff.div(10));
    }

    RemnantDimension(1).produceCurrency(Currency.shatterPower, diff);
  },

  // Called from "Max All" UI buttons and nowhere else
  buyMax() {
    // Try to unlock dimensions
    const unlockedDimensions = this.all.filter(dimension => dimension.unlock());

    // Try to buy single from the highest affordable new dimensions
    unlockedDimensions.slice().reverse().forEach(dimension => {
      if (dimension.purchases === 0) dimension.buySingle();
    });

    // Try to buy max from the lowest dimension (since lower dimensions have bigger multiplier per purchase)
    unlockedDimensions.forEach(dimension => dimension.buyMax(false));
  },

  get shatterPowerConversionRate() {
    return Pelle.isDoomed ? new Decimal(0.45) : new Decimal(0.24);
  }
};

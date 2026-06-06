<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ClassicRemnantDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      canUnlock: false,
      multiplier: new Decimal(0),
      baseAmount: new Decimal(0),
      amount: new Decimal(0),
      purchases: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capSS: new Decimal(0),
      hardcap: new Decimal(0),
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${RemnantDimension(this.tier).shortDisplayName} Remnant Dimension`;
    },
    costDisplay() {
      if (this.isCapped) return "Capped";
      return this.showCostTitle ? `Cost: ${format(this.cost)} SS` : `${format(this.cost)} SS`;
    },
    hasLongText() {
      return this.costDisplay.length > 20;
    },
    hardcapPurchases() {
      return format(this.hardcap, 1, 1);
    },
    capTooltip() {
      if (this.isCapped) return `Cap reached at ${format(this.capSS)} SS`;
      return `Purchased ${quantifyInt("time", this.purchases)}`;
    },
    showCostTitle() {
      return this.cost.max(1).log10().lte(1e6);
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = RemnantDimension(tier)
      this.isUnlocked = dimension.isUnlocked;
      this.canUnlock = dimension.canUnlock;
      this.multiplier.copyFrom(dimension.multiplier);
      this.baseAmount.copyFrom(dimension.baseAmount);
      this.purchases.copyFrom(dimension.purchases);
      this.amount.copyFrom(dimension.amount);
      this.rateOfChange.copyFrom(dimension.rateOfChange);
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.isCapped = dimension.isCapped;
      if (this.isCapped) {
        this.capSS.copyFrom(dimension.hardcapSSAmount);
        this.hardcap.copyFrom(dimension.purchaseCap);
      }
    },
    buySingleRemnantDimension() {
      RemnantDimension(this.tier).buySingle();
    },
    buyMaxRemnantDimension() {
      RemnantDimension(this.tier).buyMax(false);
    },
  }
};
</script>

<template>
  <div
    class="c-dimension-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !canUnlock }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        :enabled="isAvailableForPurchase || (!isUnlocked && canUnlock)"
        class="o-primary-btn--buy-rd o-primary-btn--buy-dim c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buySingleRemnantDimension"
      >
        {{ costDisplay }}
        <div class="c-dim-purchase-count-tooltip">
          {{ capTooltip }}
        </div>
      </PrimaryButton>
      <PrimaryButton
        :enabled="isAvailableForPurchase && isUnlocked"
        class="o-primary-btn--rd-auto"
        @click="buyMaxRemnantDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>
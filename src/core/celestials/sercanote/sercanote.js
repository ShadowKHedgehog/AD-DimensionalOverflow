import { Currency } from "../../currency";
import { DC } from "../../constants";
import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";
import { SetPurchasableMechanicState } from "../../utils";  

import { Quotes } from "../quotes";

import wordShift from "../../word-shift";

import zalgo from "./zalgo";


const disabledMechanicUnlocks = {
  InfinitiedMults: () => ({}),
  infinitiedGen: () => ({}),
  eternityGain: () => ({}),
  eternityMults: () => ({}),
  studies: () => ({}),
  EPgen: () => ({}),
  autoec: () => ({}),
  replicantiIntervalMult: () => ({}),
  tpMults: () => ({}),
  V: () => ({}),
  singularity: () => ({}),
  alchemy: () => ({}),
  achievementMult: () => ({}),
  blackhole: () => ({}),
  effarig: () => ({}),
  imaginaryUpgrades: () => ({}),
  glyphsac: () => ({}),
  timeTheoremAutobuyer: () => ({}),
  rupg10: () => ({}),
  dtMults: () => ({}),
  chargedInfinityUpgrades: () => ({}),
  alteration: () => ({}),
  timeTheorems: () => ({})
};

export const Sercanote = {
  symbol: "♅",
  // Suppress the randomness for this form
  possessiveName: "Sercanote's",

  // This is called upon initial Dooming and after every Armageddon when using the modal
  initializeRun() {
    if (this.isTrapped) {
    
      return;
    }

    Glyphs.harshAutoClean();
    if (!Glyphs.unequipAll()) {
      Modal.hideAll();
      Modal.message.show(`Enterring this Reality will unequip your Glyphs. Some of your
        Glyphs could not be unequipped due to lack of inventory space.`, 1);
      return;
    }
    Glyphs.harshAutoClean();
    if (Glyphs.freeInventorySpace < 5) {
      Modal.hideAll();
      Modal.message.show(`You must have enough empty unprotected Glyph slots for
        ${formatInt(5)} additional Glyphs in order to Enter This Reality.`, 1);
      return;
    }
    for (const type of GlyphInfo.basicGlyphTypes) Glyphs.addToInventory(GlyphGenerator.doomedGlyph(type));
    Glyphs.refreshActive();
    player.options.confirmations.glyphReplace = true;
    player.reality.automator.state.repeat = false;
    player.reality.automator.state.forceRestart = false;
    if (BlackHoles.arePaused) BlackHoles.togglePause();
    player.celestials.sercanote.trapped = true;
    respecTimeStudies(true);
    Currency.infinityPoints.reset();
    player.IPMultPurchases = DC.D0;
    Autobuyer.bigCrunch.mode = AUTO_CRUNCH_MODE.AMOUNT;
    disChargeAll();


    // Force-enable the group toggle for AD autobuyers to be active; whether or not they can actually tick
    // is still handled through if the autobuyers are unlocked at all. This fixes an odd edge case where the player
    // enters cel7 with AD autobuyers disabled - AD autobuyers need to be reupgraded, but the UI component
    // for the group toggle is hidden until they're all re-upgraded to the max again.
    player.auto.antimatterDims.isActive = true;

    player.buyUntil10 = true;
    
    for (const res of AlchemyResources.all) res.amount = 0;
    AutomatorBackend.stop();

    // Force-unhide all tabs except for the shop tab, for which we retain the hide state instead
    const shopTab = ~1 & (1 << GameDatabase.tabs.find(t => t.key === "shop").id);
    player.options.hiddenTabBits &= shopTab;

    // Force unhide MOST subtabs, although some of the tabs get ignored since they don't contain any
    // meaningful interactable gameplay elements in Doomed
    const tabsToIgnore = ["statistics", "achievements", "reality", "celestials"];
    const ignoredIDs = GameDatabase.tabs.filter(t => tabsToIgnore.includes(t.key)).map(t => t.id);
    for (let tabIndex = 0; tabIndex < GameDatabase.tabs.length; tabIndex++) {
      player.options.hiddenSubtabBits[tabIndex] &= ignoredIDs.includes(tabIndex) ? -1 : 0;
    }
    sercanote.quotes.initial.show();
    GameStorage.save(true);
  },

  get displayName() {
    return Date.now() % 4000 > 500 ? "Sercanote" : wordShift.randomCrossWords("Sercanote");
  },

  get isUnlocked() {
    // nah
  },
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff back
  isDisabled(mechanic) {
    if (!this.isTrapped) return false;

    if (!mechanic) return true;
    if (!disabledMechanicUnlocks[mechanic]) {
      // eslint-disable-next-line
      console.error(`Mechanic ${mechanic} isn't present in the disabledMechanicUnlocks!`);
      return true;
    }

    const upgrade = disabledMechanicUnlocks[mechanic]();

    if (typeof upgrade === "boolean") {
      return upgrade;
    }

    return Boolean(!upgrade.canBeApplied);
  },

  get canArmageddon() {
    return this.remnantsGain.gte(1);
  },

  armageddon(gainStuff) {
    if (!this.canArmageddon && gainStuff) return;
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_BEFORE, gainStuff);
    if (gainStuff) {
      this.cel.remnants = this.cel.remnants.add(this.remnantsGain);
    }
    finishProcessReality({ reset: true, armageddon: true });
    disChargeAll();
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.autoStoreReal = false;
    if (PelleStrikes.dilation.hasStrike) player.dilation.active = true;
    EventHub.dispatch(GAME_EVENT.ARMAGEDDON_AFTER, gainStuff);
  },

  gameLoop(diff) {
    if (this.isTrapped) {
      // nah
    }
  },

  get cel() {
    return player.celestials.sercanote;
  },

  get isTrapped() {
    return this.cel.trapped;
  },

 

  get uselessInfinityUpgrades() {
    return ["passiveGen", "infinitiedGeneration"];
  },

  get uselessTimeStudies() {
    return [32, 33, 41, 51, 61, 62, 121, 122, 123, 141, 142, 143, 171, 181, 192, 201, 211, 213, 221, 222, 223, 224, 225, 226, 227, 228, 231, 233];
  },

  get disabledRUPGs() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 22, 23, 24];
  },

  get uselessPerks() {
    return [10, 12, 13, 14, 15, 16, 17, 30, 40, 41, 42, 43, 44, 45, 46, 51, 52,
      53, 60, 61, 62, 80, 81, 82, 83, 100, 103, 104, 105, 106, 201, 202, 203, 204];
  },

  get specialGlyphEffect() {
    const isUnlocked = this.isDoomed && PelleRifts.chaos.milestones[1].canBeApplied;
    const description = this.getSpecialGlyphEffectDescription(this.activeGlyphType);
    const isActive = type => isUnlocked && this.activeGlyphType === type;
    return {
      isUnlocked,
      description,
      infinity: (isActive("infinity") && player.challenge.eternity.current <= 8)
        ? Currency.infinityPoints.value.plus(1).pow(0.2)
        : DC.D1,
      time: isActive("time")
        ? Currency.eternityPoints.value.plus(1).pow(0.3)
        : DC.D1,
      replication: isActive("replication")
        ? 10 ** 53 ** (PelleRifts.vacuum.percentage)
        : 1,
      dilation: isActive("dilation")
        ? Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1)
        : DC.D1,
      power: isActive("power")
        ? 1.02
        : 1,
      companion: isActive("companion")
        ? 1.34
        : 1,
      isScaling: () => ["infinity", "time", "replication", "dilation"].includes(this.activeGlyphType),
    };
  },
  getSpecialGlyphEffectDescription(type) {
    switch (type) {
      case "infinity":
        return `Infinity Point gain ${player.challenge.eternity.current <= 8
          ? formatX(Currency.infinityPoints.value.plus(1).pow(0.2), 2)
          : formatX(DC.D1, 2)} (based on current IP)`;
      case "time":
        return `Eternity Point gain ${formatX(Currency.eternityPoints.value.plus(1).pow(0.3), 2)}
          (based on current EP)`;
      case "replication":
        return `Replication speed ${formatX(10 ** 53 ** (PelleRifts.vacuum.percentage), 2)} \
        (based on ${wordShift.wordCycle(PelleRifts.vacuum.name)})`;
      case "dilation":
        return `Dilated Time gain ${formatX(Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1), 2)}
          (based on Tachyon Galaxies)`;
      case "power":
        return `Galaxies are ${formatPercents(0.02)} stronger`;
      case "companion":
        return `You feel ${formatPercents(0.34)} better`;
      // Undefined means that there is no glyph equipped, needs to be here since this function is used in
      // both Current Glyph Effects and Glyph Tooltip
      case undefined:
        return "No Glyph equipped!";
      default:
        return "You cannot equip this Glyph while Doomed!";
    }
  },

  get remnantRequirementForDilation() {
    return 3.8e7;
  },

  get canDilateInPelle() {
    return this.cel.remnants.gte(this.remnantRequirementForDilation);
  },

  resetResourcesForDilation() {
    this.cel.records.totalAntimatter = new Decimal("1e180000");
    this.cel.records.totalInfinityPoints = new Decimal("1e60000");
    Currency.eternityPoints.reset();
    // Oddly specific number? Yes, it's roughly the amount of EP you have
    // when starting dilation for the first time
    // Since 5th strike previously did not reset your current EP the previous reset value was kind of useless which
    // lead to some balancing problems, this hopefully prevents people starting dilation too early and getting
    // softlocked, or starting it too late and getting not-softlocked.
    this.cel.records.totalEternityPoints = new Decimal("1e1050");
  },

  


  // Calculations assume this is in units of proportion per second (eg. 0.03 is 3% drain per second)
 

  antimatterDimensionMult(x) {
    return Decimal.pow(10, Decimal.log10(x.add(1)).add(x.pow(5.1).div(1e3)).add(DC.D4.pow(x).div(1e19)));
  },

  get activeGlyphType() {
    return Glyphs.active.filter(Boolean)[0]?.type;
  },


  // Transition text from "from" to "to", stage is 0-1, 0 is fully "from" and 1 is fully "to"
  // Also adds more zalgo the bigger the stage
  transitionText(from, to, stage = 0) {
    const len = Math.round((from.length * (1 - stage) + to.length * stage) * 1e8) / 1e8;
    const toInterval = len * (1 - stage);
    let req = toInterval;
    let str = "";
    for (let i = 0; i < len; i++) {
      if (i >= req) {
        const idx = Math.floor(i * (to.length / len));
        str += to[idx];
        req += toInterval;
      } else {
        const idx = Math.floor(i * (from.length / len));
        str += from[idx];
      }
    }
    return zalgo(str, Math.floor(stage ** 2 * 7));
  },

  endTabNames: "THANK YOU COME BACK SOON TO PLAY WITH US AGAIN DESTROYER".split(" "),

  quotes: Quotes.sercanote,

  reset() {
    player.celestials.sercanote = {
      trapped: false,
      isGameEnd2: false,
            
    }
  },
};
import { DC } from "../../constants";

import { RebuyableMechanicState } from "../../game-mechanics/rebuyable";

import { PelleRifts } from "./rifts";

export const GalaxyGenerator = {
  // This is used for a slightly annoying workaround in order to visually update the glyph tab when the rifts
  // are refilling and the single glyph slot (which was lost during the drain) becomes available again
  hasReturnedGlyphSlot: false,

  get generationCaps() {
    return PelleRifts.all
      .map(x => ({ rift: x.config.key, cap: x.config.galaxyGeneratorThreshold }))
      .sort((a, b) => Decimal.compare(a.cap, b.cap));
  },

  get spentGalaxies() {
    return player.celestials.pelle.galaxyGenerator.spentGalaxies;
  },

  get generatedGalaxies() {
    return player.celestials.pelle.galaxyGenerator.generatedGalaxies;
  },

  get galaxies() {
    return this.generatedGalaxies.sub(this.spentGalaxies);
  },
  get softcapStarts() {
    return [new Decimal(1e15), new Decimal(1e24), new Decimal (5e27), new Decimal(1e30)]
  },
  get softcapMags() {
    return [new Decimal(0.95), new Decimal(0.75), new Decimal(0.55), new Decimal(0.35),new Decimal(0.55), new Decimal(0.85), new Decimal(0.98)]
  },
  get gainPerSecond() {
    if (!Pelle.hasGalaxyGenerator) return DC.D0;
    let production = new Decimal(GalaxyGeneratorUpgrades.additive.effectValue).timesEffectsOf(
      GalaxyGeneratorUpgrades.multiplicative,
      GalaxyGeneratorUpgrades.antimatterMult,
      GalaxyGeneratorUpgrades.IPMult,
      GalaxyGeneratorUpgrades.EPMult,
    );
    if (production.gt(this.softcapStarts[0])){
      production = production.div(this.softcapStarts[0]).pow(this.softcapMags[0]).times(this.softcapStarts[0])
  }
  if (production.gt(this.softcapStarts[1])){
    if (player.exposes.lt(100)) {
      production = production.div(this.softcapStarts[1]).pow(this.softcapMags[1]).times(this.softcapStarts[1])
    } else {
      production = production.div(this.softcapStarts[1]).log10().pow(this.softcapMags[6]).pow10().times(this.softcapStarts[1])
    }
  }
  if (production.gt(this.softcapStarts[2])){
     if (player.exposes.lt(100)) {
      production = production.div(this.softcapStarts[2]).log10().pow(this.softcapMags[2]).pow10().times(this.softcapStarts[2])
    } else {
      production = production.div(this.softcapStarts[2]).log10().pow(this.softcapMags[5]).pow10().times(this.softcapStarts[2])
    }
  }
  if (production.gt(this.softcapStarts[3])){
     if (player.exposes.lt(100)) {
      production = production.div(this.softcapStarts[3]).log10().pow(this.softcapMags[3]).pow10().times(this.softcapStarts[3])
    } else {
      production = production.div(this.softcapStarts[3]).log10().pow(this.softcapMags[4]).pow10().times(this.softcapStarts[3])
    }
  }
    return production;
  },
  get capObj() {
    return this.generationCaps[player.celestials.pelle.galaxyGenerator.phase];
  },

  get generationCap() {
    return this.capObj ? this.capObj.cap : DC.BEMAX;
  },

  get capRift() {
    return PelleRifts[this.capObj?.rift];
  },

  get isCapped() {
    return this.generationCap === this.generatedGalaxies;
  },

  get sacrificeActive() {
    return player.celestials.pelle.galaxyGenerator.sacrificeActive;
  },

  startSacrifice() {
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = true;
  },

  loop(diff) {
  if (this.isCapped) {
    Pelle.quotes.galaxyGeneratorRifts.show();
  }
  if (this.sacrificeActive) {
    this.capRift.reducedTo = Decimal.max(
      Decimal.sub(this.capRift.reducedTo, diff.div(1e5).mul(3)).toNumber(),
      0
    );
    if (this.capRift.reducedTo === 0) {
      player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
      player.celestials.pelle.galaxyGenerator.phase++;

      const phase = player.celestials.pelle.galaxyGenerator.phase;
      if (phase === 1) {
        Pelle.quotes.galaxyGeneratorPhase1.show();
      } else if (phase === 4) {
        Pelle.quotes.galaxyGeneratorPhase4.show();
      }

      if (!this.capObj) {
        Pelle.quotes.end.show();
      }
    }
    PelleRifts.all.forEach(x => x.checkMilestoneStates());

    if (!PelleRifts.vacuum.milestones[0].canBeApplied && Glyphs.active.filter(g => g).length > 0) {
      Glyphs.unequipAll(player.options.respecIntoProtected && Glyphs.findFreeIndex(true) === -1);
      Glyphs.refreshActive();
    }
  }

  player.celestials.pelle.galaxyGenerator.generatedGalaxies =
    player.celestials.pelle.galaxyGenerator.generatedGalaxies.add(this.gainPerSecond.times(diff.div(1000)));
  player.celestials.pelle.galaxyGenerator.generatedGalaxies = Decimal.min(
    player.celestials.pelle.galaxyGenerator.generatedGalaxies,
    this.generationCap
  );

  if (!this.capRift) {
    if (player.exposes.lt(300)) {
      PelleRifts.all.forEach(r =>
        r.reducedTo = diff.div(1e5).mul(3).add(r.reducedTo)
          .clampMax(Decimal.clampMax(player.exposes, 17).add(2)).toNumber()
      );
    } else if (player.exposes.lt(200)) {
      PelleRifts.all.forEach(r =>
        r.reducedTo = diff.div(1e5).mul(3).add(r.reducedTo)
          .clampMax(Decimal.clampMax(player.exposes, 16).add(2)).toNumber()
      );
    } else if (player.exposes.lt(100)) {
      PelleRifts.all.forEach(r =>
        r.reducedTo = diff.div(1e5).mul(3).add(r.reducedTo)
          .clampMax(Decimal.clampMax(player.exposes, 15).add(2)).toNumber()
      );
    } else {
      PelleRifts.all.forEach(r =>
        r.reducedTo = diff.div(1e5).mul(3).add(r.reducedTo)
          .clampMax(Decimal.clampMax(player.exposes, 18).add(2)).toNumber()
      );
    }

    if (PelleRifts.vacuum.milestones[0].canBeApplied && !this.hasReturnedGlyphSlot) {
      Glyphs.refreshActive();
      EventHub.dispatch(GAME_EVENT.GLYPHS_EQUIPPED_CHANGED);
      this.hasReturnedGlyphSlot = true;
    }
  }
}
};

export class GalaxyGeneratorUpgrade extends RebuyableMechanicState {
  get currency() {
    return this.config.currency();
  }

  get boughtAmount() {
    return player.celestials.pelle.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.celestials.pelle.rebuyables[this.id] = value;
  }

  get isCustomEffect() { return true; }

  get effectValue() {
    return this.config.effect(this.boughtAmount);
  }
}

export const GalaxyGeneratorUpgrades = mapGameDataToObject(
  GameDatabase.celestials.pelle.galaxyGeneratorUpgrades,
  config => new GalaxyGeneratorUpgrade(config)
);

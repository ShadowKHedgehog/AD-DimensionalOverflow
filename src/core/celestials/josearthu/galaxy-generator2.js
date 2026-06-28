import { DC } from "../../constants";


export const GalaxyGenerator2 = {
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
    return [new Decimal(0.95), new Decimal(0.75), new Decimal(0.55), new Decimal(0.35)]
  },
  get gainPerSecond() {
    if (!Unnamed.hasGalaxyGenerator) return DC.D0;
    let production = new Decimal(player.antimatter.log10().div(1e7));
    if (production.gt(this.softcapStarts[0])){
      production = production.div(this.softcapStarts[0]).pow(this.softcapMags[0]).times(this.softcapStarts[0])
  }
  if (production.gt(this.softcapStarts[1])){
      production = production.div(this.softcapStarts[1]).pow(this.softcapMags[1]).times(this.softcapStarts[1])
  }
  if (production.gt(this.softcapStarts[2])){
      production = production.div(this.softcapStarts[2]).log10().pow(this.softcapMags[2]).pow10().times(this.softcapStarts[2])
  }
  if (production.gt(this.softcapStarts[3])){
      production = production.div(this.softcapStarts[3]).log10().pow(this.softcapMags[3]).pow10().times(this.softcapStarts[3])
  }
    return production;
  },

  get generationCap() {
    return new Decimal("1e90");
  },


  loop(diff) {
    

      // Force-unequip glyphs when the player loses the respective milestone. We call the respec option as normally
      // except for one particular case - when we want to respec into protected slots but have no room to do so. In
      // that case, we force-respec into the inventory instead

    player.celestials.josearthu.galaxyGenerator.generatedGalaxies =
      player.celestials.josearthu.galaxyGenerator.generatedGalaxies.add(this.gainPerSecond.times(diff.div(1000)));
    player.celestials.josearthu.galaxyGenerator.generatedGalaxies = Decimal.min(
      player.celestials.josearthu.galaxyGenerator.generatedGalaxies,
      this.generationCap
    );
  }
};




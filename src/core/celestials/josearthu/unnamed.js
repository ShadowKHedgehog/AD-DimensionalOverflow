import { Currency } from "../../currency";
import { DC } from "../../constants";

import { Quotes } from "../quotes";




export const Unnamed = {
  symbol: "⌭",
  // Suppress the randomness for this form
  possessiveName: "Unnamed's",

  // This is called upon initial Dooming and after every Armageddon when using the modal
  initializeRun() {
    respecTimeStudies(true);
    Currency.infinityPoints.reset();
    player.IPMultPurchases = DC.D0;
    disChargeAll();
    clearCelestialRuns();

    // Force-enable the group toggle for AD autobuyers to be active; whether or not they can actually tick
    // is still handled through if the autobuyers are unlocked at all. This fixes an odd edge case where the player
    // enters cel7 with AD autobuyers disabled - AD autobuyers need to be reupgraded, but the UI component
    // for the group toggle is hidden until they're all re-upgraded to the max again.
    

    // Force-unhide all tabs except for the shop tab, for which we retain the hide state instead
    

    // Force unhide MOST subtabs, although some of the tabs get ignored since they don't contain any
    // meaningful interactable gameplay elements in Doomed

    Unnamed.quotes.startRun.show();
    player.celestials.josearthu.run = true;
    GameStorage.save(true);
  },

  get displayName() {
    return "The Unnamed";
  },

  get isUnlocked() {
    return false
  },
  // This will check if a specific mechanic is disabled, like old PelleFlag(x).isActive,
  // Initially it will only have isDoomed check but we will have upgrades that let you get stuff bac

  get cel() {
    return player.celestials.pelle;
  },


  get glyphMaxLevel() {
    return new Decimal(100000);
  },

  get glyphStrength() {
    return new Decimal(100);
  },

  get activeGlyphType() {
    return Glyphs.active.filter(Boolean)[0]?.type;
  },

  get hasGalaxyGenerator() {
    return player.celestials.josearthu.galaxyGenerator.unlocked;
  },

  // Transition text from "from" to "to", stage is 0-1, 0 is fully "from" and 1 is fully "to"
  // Also adds more zalgo the bigger the stage
  
  quotes: Quotes.unnamed,

  reset() {
    player.celestials.josearthu = {
      run: false,
      progressBits: 0,
      galaxyGenerator: {
        unlocked: hasGalaxyGenerator(),
        spentGalaxies: player.celestials.josearthu.galaxyGenerator.spentGalaxies,
        generatedGalaxies: player.celestials.josearthu.galaxyGenerator.generatedGalaxies,
        phase: 5,
        sacrificeActive: false
      },
      quoteBits: 0,
      showBought: false,
    };
  },
};
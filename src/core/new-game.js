import * as ADNotations from "adnot-beport-small";
import { DC } from "./constants";
import { Perk } from "./perks";
import { Achievement } from "./globals";
export const NG = {
  startNewGame() {
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    // We set this ASAP so that the AD tab is immediately recreated without END formatting, and any lag which could
    // happen is instead hidden by the overlay from the credits rollback
    player.celestials.pelle.doomed = false;

    // This is where we "confirm" a speedrun as completed and store all its information into the previous run prop
    // before resetting everything.
    const speedrun = player.speedrun;
    if (speedrun.isActive) {
      player.speedrun.previousRuns[player.records.fullGameCompletions + 1] = {
        isSegmented: speedrun.isSegmented,
        usedSTD: speedrun.usedSTD,
        startDate: speedrun.startDate,
        name: speedrun.name,
        offlineTimeUsed: speedrun.offlineTimeUsed,
        records: [...speedrun.records],
        achievementTimes: JSON.parse(JSON.stringify(speedrun.achievementTimes)),
        seedSelection: speedrun.seedSelection,
        initialSeed: speedrun.initialSeed,
      };

      // For the sake of keeping a bounded savefile size, we only keep a queue of the last 100 full runs. The earliest
      // this will feasibly become an issue from nonstop speedruns is around 2030; I guess we can revisit it at that
      // point if we really need to, but I suspect this limit should be high enough
      const prevRunIndices = Object.keys(speedrun.previousRuns).map(k => Number(k));
      if (prevRunIndices.length > 100) player.speedrun.previousRuns[prevRunIndices.min()] = undefined;
    }

    // Modify beaten-game quantities before doing a carryover reset
    player.records.fullGameCompletions++;
    GlyphAppearanceHandler.unlockSet();
    if (player.exposes == 0) {
      this.restartWithCarryover();
    }
    if (player.exposes >= 1) {
      this.restartWithCarryoverPostShatter();
    }
    

    // The ending animation ends at 12.5, although the value continues to increase after that. We set it to a bit above
    // 12.5 when we start the rollback animation to hide some of the unavoidable lag from all the reset functions
    GameEnd.removeAdditionalEnd = true;
    GameEnd.additionalEnd = 15;
    // Without the delay, this causes the saving (and its notification) to occur during the credits rollback
    setTimeout(() => GameStorage.save(), 10000);
  },

  // Reset the game, but carry over some post-completion stats. We also call this when starting a speedrun, so make sure
  // any stats which are updated due to completion happen in startNewGame() instead of in here
 restartWithCarryover() {
    let rowProtect = 0;
    rowProtect = player.reality.glyphs.protectedRows;
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    player.isGameEnd2 = false;
    Pelle.isGameEnd = false;
    player.celestials.pelle.doomed = false;
    Tab.dimensions.antimatter.show();
    AchievementTimers.marathon2.reset();
    player.tabNotifications = new Set();
    player.triggeredTabNotificationBits = 0;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    if (player.exposes.lt(25)){
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    };
    Glyphs.unequipAll();
    if (player.exposes.lt(25)){
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    }
    if (player.exposes.gte(25)){
      player.reality.upgReqs = 67108800;
      player.reality.imaginaryUpgReqs = 67108800;
      player.reality.upgradeBits = 67108800;
      player.reality.imaginaryUpgradeBits = 67108800;
      player.realities = new Decimal(10000);
    }
    if (player.exposes.lt(25)){
      Achievement(141).lock();
      Achievement(142).lock();
      Achievement(143).lock();
      Achievement(144).lock();
      Achievement(145).lock();
      Achievement(146).lock();
      Achievement(147).lock();
      Achievement(148).lock();
      Achievement(151).lock();
      Achievement(152).lock();
      Achievement(153).lock();
      Achievement(154).lock();
      Achievement(155).lock();
      Achievement(156).lock();
      Achievement(157).lock();
      Achievement(158).lock();
      Achievement(161).lock();
      Achievement(162).lock();
      Achievement(163).lock();
      Achievement(164).lock();
      Achievement(165).lock();
      Achievement(166).lock();
      Achievement(167).lock();
      Achievement(168).lock();
      Achievement(171).lock();
      Achievement(172).lock();
      Achievement(173).lock();
      Achievement(174).lock();
      Achievement(175).lock();
      Achievement(176).lock();
      Achievement(177).lock();
      Achievement(178).lock();
      Achievement(181).lock();
      Achievement(182).lock();
      Achievement(183).lock();
      Achievement(184).lock();
      Achievement(185).lock();
      Achievement(186).lock();
      Achievement(187).lock();
      player.realities = DC.D0;
      player.partSimulatedReality = DC.D0;
      player.reality.glyphs.sac.power = DC.D0;
      player.reality.glyphs.sac.infinity = DC.D0;
      player.reality.glyphs.sac.time = DC.D0;
      player.reality.glyphs.sac.replication = DC.D0;
      player.reality.glyphs.sac.dilation = DC.D0;
      player.reality.glyphs.sac.effarig = DC.D0;
      player.reality.glyphs.sac.reality = DC.D0;
      player.reality.glyphs.undo = [];
      player.reality.glyphs.sets = new Array(7).fill({
        name: "",
        glyphs: []
      });
      player.reality.respec = false;
      player.reality.showGlyphSacrifice = false;
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
      player.reality.autoSort = 0;
      player.reality.autoCollapse = false;
      player.reality.autoAutoClean = false;
      player.reality.applyFilterToPurge = false;
      player.reality.moveGlyphsOnProtection = false;
      player.reality.autoEC = true;
      player.reality.glyphs.createdRealityGlyph = false;
      player.reality.initialSeed = Math.floor(Date.now() * Math.random() + 1);
      player.reality.seed = 1;
      player.reality.secondGaussian = 1e6;
      player.reality.musicSeed = Math.floor(Date.now() * Math.random() + 0xBCDDECCB);
      player.reality.musicSecondGaussian = 1e6;
      
      player.reality.upgradeBits = 0;
      player.reality.upgReqs = 0;
      player.reality.imaginaryUpgradeBits = 0;
      player.reality.imaginaryUpgReqs = 0;
      
      player.reality.reqLock = {
        reality: 0,
        imaginary: 0,
      };
    };
    player.reality.realityMachines = DC.D0;
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
    player.reality.rebuyables = {
        1: new Decimal(),
        2: new Decimal(),
        3: new Decimal(),
        4: new Decimal(),
        5: new Decimal(),
      };
    player.reality.imaginaryRebuyables = {
        1: new Decimal(),
        2: new Decimal(),
        3: new Decimal(),
        4: new Decimal(),
        5: new Decimal(),
        6: new Decimal(),
        7: new Decimal(),
        8: new Decimal(),
        9: new Decimal(),
        10: new Decimal(),
      };
    player.reality.respec = false;
    player.reality.showGlyphSacrifice = false;
    player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
    player.reality.autoSort = 0;
    player.reality.autoCollapse = false;
    player.reality.autoAutoClean = false;
    player.reality.applyFilterToPurge = false;
    player.reality.moveGlyphsOnProtection = false;
    player.reality.unlockedEC = 0;
    player.reality.autoEC = true;
    player.reality.lastAutoEC = DC.D0;
    player.reality.partEternitied = DC.D0;
    player.reality.autoAchieve = true;
    player.reality.gainedAutoAchievements = true;
    player.reality.achTimer = new Decimal();
    player.reality.hasCheckedFilter = false;
    if (player.exposes.lt(25)) {
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.perks.reset();
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    player.blackHole = Array.range(0, 2).map(id => ({
      id,
      intervalUpgrades: DC.D0,
      powerUpgrades: DC.D0,
      durationUpgrades: DC.D0,
      phase: DC.D0,
      active: false,
      unlocked: false,
      activations: DC.D0,
    }));
    player.blackHolePause = false;
    };
    player.blackHoleAutoPauseMode = 0;
    player.blackHolePauseTime = DC.D0;
    player.blackHoleNegative = DC.D1;
    

    Autobuyers.reset();
    player.reality.partEternitied = DC.D0;
    if (player.exposes.lt(25)){
    player.celestials.teresa.pouredAmount = 0;
    player.celestials.teresa.quoteBits = 0;
    player.celestials.teresa.unlockBits = 0;
    player.celestials.teresa.run = false;
    player.celestials.teresa.bestRunAM = DC.D1;
    player.celestials.teresa.bestAMSet = [];
    player.celestials.teresa.perkShop = Array.repeat(DC.D0, 6);
    player.celestials.teresa.lastRepeatedMachines = DC.D0;
    player.celestials.teresa.lastRepeatediM = DC.D0;
    player.celestials.effarig.relicShards = DC.D0;
    player.celestials.effarig.unlockBits = 0;
    player.celestials.effarig.run = false;
    player.celestials.effarig.quoteBits = 0;
    player.celestials.effarig.glyphWeights.ep = 25;
    player.celestials.effarig.glyphWeights.repl = 25;
    player.celestials.effarig.glyphWeights.dt = 25;
    player.celestials.effarig.glyphWeights.eternities = 25;
    player.celestials.effarig.autoAdjustGlyphWeights = false;
    player.celestials.enslaved.isStoring = false;
    player.celestials.enslaved.stored = DC.D0;
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.storedReal = DC.D0;
    player.celestials.enslaved.autoStoreReal = false;
    player.celestials.enslaved.isAutoReleasing = false;
    player.celestials.enslaved.quoteBits = 0;
    player.celestials.enslaved.unlocks = [];
    player.celestials.enslaved.run = false;
    player.celestials.enslaved.completed = false;
    player.celestials.enslaved.tesseracts = DC.D0;
    player.celestials.enslaved.hasSecretStudy = false;
    player.celestials.enslaved.feltEternity = false;
    player.celestials.enslaved.progressBits = 0;
    player.celestials.enslaved.hintBits = 0;
    player.celestials.enslaved.hintUnlockProgress = 0;
    player.celestials.enslaved.glyphHintsGiven = 0;
    player.celestials.enslaved.zeroHintTime = 0;
    Enslaved.autoReleaseTick = 0;
    player.celestials.v.unlockBits = 0;
    player.celestials.v.run = false;
    player.celestials.v.quoteBits = 0;
    player.celestials.v.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.STSpent = 0;
    player.celestials.v.runGlyphs = [[], [], [], [], [], [], [], [], []];
    player.celestials.v.runRecords = [-10, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, 0, DC.D0, DC.D0];
    player.celestials.v.wantsFlipped = true;
    V.spaceTheorems = 0;
    player.celestials.ra.pets.teresa.level = 1;
    player.celestials.ra.pets.teresa.memories = DC.D0;
    player.celestials.ra.pets.teresa.memoryChunks = DC.D0;
    player.celestials.ra.pets.teresa.memoryUpgrades = 0;
    player.celestials.ra.pets.teresa.chunkUpgrades = 0;
    player.celestials.ra.pets.effarig.level = 1;
    player.celestials.ra.pets.effarig.memories = DC.D0;
    player.celestials.ra.pets.effarig.memoryChunks = DC.D0;
    player.celestials.ra.pets.effarig.memoryUpgrades = 0;
    player.celestials.ra.pets.effarig.chunkUpgrades = 0;
    player.celestials.ra.pets.enslaved.level = 1;
    player.celestials.ra.pets.enslaved.memories = DC.D0;
    player.celestials.ra.pets.enslaved.memoryChunks = DC.D0;
    player.celestials.ra.pets.enslaved.memoryUpgrades = 0;
    player.celestials.ra.pets.enslaved.chunkUpgrades = 0;
    player.celestials.ra.pets.v.level = 1;
    player.celestials.ra.pets.v.memories = DC.D0;
    player.celestials.ra.pets.v.memoryChunks = DC.D0;
    player.celestials.ra.pets.v.memoryUpgrades = 0;
    player.celestials.ra.pets.v.chunkUpgrades = 0;
    player.celestials.ra.alchemy = Array.repeat(0, 21)
      .map(() => ({
        amount: DC.D0,
        reaction: false
      }));
    player.celestials.ra.highestRefinementValue.power = DC.D0;
    player.celestials.ra.highestRefinementValue.infinity = DC.D0;
    player.celestials.ra.highestRefinementValue.time = DC.D0;
    player.celestials.ra.highestRefinementValue.replication = DC.D0;
    player.celestials.ra.highestRefinementValue.dilation = DC.D0;
    player.celestials.ra.highestRefinementValue.effarig = DC.D0;
    player.celestials.ra.quoteBits = 0;
    player.celestials.ra.momentumTime = DC.D0;
    player.celestials.ra.unlockBits = 0;
    player.celestials.ra.run = false;
    player.celestials.ra.charged = new Set();
    player.celestials.ra.disCharge = false;
    player.celestials.ra.peakGamespeed = DC.D1;
    player.celestials.ra.petWithRemembrance = "";
    player.celestials.laitela.darkMatter = DC.D0;
    player.celestials.laitela.maxDarkMatter = DC.D0;
    player.celestials.laitela.run = false;
    player.celestials.laitela.quoteBits = 0;
    player.celestials.laitela.dimensions = Array.range(0, 4).map(() =>
      ({
        amount: DC.D0,
        intervalUpgrades: DC.D0,
        powerDMUpgrades: DC.D0,
        powerDEUpgrades: DC.D0,
        timeSinceLastUpdate: DC.D0,
        ascensionCount: DC.D0
      }));
    player.celestials.laitela.entropy = DC.D0;
    player.celestials.laitela.thisCompletion = new Decimal(3600);
    player.celestials.laitela.fastestCompletion = new Decimal(3600);
    player.celestials.laitela.difficultyTier = 0;
    player.celestials.laitela.upgrades = {};
    player.celestials.laitela.darkMatterMult = DC.D1;
    player.celestials.laitela.darkEnergy = DC.D0;
    player.celestials.laitela.singularitySorting.displayResource = 0;
    player.celestials.laitela.singularitySorting.sortResource = 0;
    player.celestials.laitela.singularitySorting.showCompleted = 0;
    player.celestials.laitela.singularitySorting.sortOrder = 0;
    player.celestials.laitela.singularities = DC.D0;
    player.celestials.laitela.singularityCapIncreases = DC.D0;
    player.celestials.laitela.lastCheckedMilestones = DC.D0;
    player.celestials.laitela.milestoneGlow = true;
    };
    player.celestials.pelle.doomed = false;
    player.celestials.pelle.upgrades = new Set();
    player.celestials.pelle.remnants = DC.D0;
    player.celestials.pelle.realityShards = DC.D0;
    player.celestials.pelle.records.totalInfinityPoints = DC.D0;
    player.celestials.pelle.records.totalEternityPoints = DC.D0;
    player.celestials.pelle.rebuyables.antimatterDimensionMult = DC.D0;
    player.celestials.pelle.rebuyables.timeSpeedMult = DC.D0;      
    player.celestials.pelle.rebuyables.glyphLevels = DC.D0;
    player.celestials.pelle.rebuyables.infConversion = DC.D0;
    player.celestials.pelle.rebuyables.galaxyPower = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = DC.D0;
    player.celestials.pelle.rifts.vacuum.fill = DC.D0;
    player.celestials.pelle.rifts.vacuum.active = false;
    player.celestials.pelle.rifts.vacuum.reducedTo = 1;
    player.celestials.pelle.rifts.decay.fill = DC.D0;
    player.celestials.pelle.rifts.decay.active = false;
    player.celestials.pelle.rifts.decay.percentageSpent = 0;
    player.celestials.pelle.rifts.decay.reducedTo = 1;
    player.celestials.pelle.rifts.chaos.fill = 0;
    player.celestials.pelle.rifts.chaos.active = false;
    player.celestials.pelle.rifts.chaos.reducedTo = 1;
    player.celestials.pelle.rifts.recursion.fill = DC.D0;
    player.celestials.pelle.rifts.recursion.active = false;
    player.celestials.pelle.rifts.recursion.reducedTo = 1;
    player.celestials.pelle.rifts.paradox.fill = DC.D0;
    player.celestials.pelle.rifts.paradox.active = false;
    player.celestials.pelle.rifts.paradox.reducedTo = 1;
    player.celestials.pelle.progressBits = 0;
    player.celestials.pelle.galaxyGenerator.unlocked = false;
    player.celestials.pelle.galaxyGenerator.spentGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.phase = 0;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
    player.celestials.pelle.collapsed.upgrades = false;
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.collapsed.galaxies = false;
    player.celestials.pelle.showBought = false;
    player.celestials.pelle.records.totalAntimatterThisShatter = DC.D0;
    player.dilation.studies = [];
    player.dilation.active = false;
    player.dilation.upgrades.clear();
    player.dilation.rebuyables = {
      1: DC.D0,
      2: DC.D0,
      3: DC.D0,
      11: DC.D0,
      12: DC.D0,
      13: DC.D0,
    };
    Currency.tachyonParticles.reset();
    player.dilation.nextThreshold = DC.E3;
    player.dilation.baseTachyonGalaxies = DC.D0;
    player.dilation.totalTachyonGalaxies = DC.D0;
    Currency.dilatedTime.reset();
    player.dilation.lastEP = DC.DM1;
    resetChallengeStuff();
    player.eternityChalls = {};
    player.reality.unlockedEC = 0;
    player.reality.lastAutoEC = DC.D0;
    player.challenge.eternity.current = 0;
    player.challenge.eternity.unlocked = 0;
    player.challenge.eternity.requirementBits = 0;
    Lazy.invalidateAll();
    ECTimeStudyState.invalidateCachedRequirements();
    player.IPMultPurchases = DC.D0;
    Currency.infinityPower.reset();
    player.postC4Tier = 0;
    Currency.timeShards.reset();
    
    Currency.eternityPoints.reset();
    EternityUpgrade.epMult.reset();
    Currency.eternities.reset();
    player.eternityUpgrades.clear();
    player.totalTickGained = DC.D0;
    player.totalTickBought = DC.D0;
    Currency.timeTheorems.reset();
    resetEternityRuns();
    secondSoftReset(false);
    player.respec = false;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    InfinityDimensions.fullReset();
    InfinityDimensions.resetAmount();
    fullResetTimeDimensions();
    resetTimeDimensions();
    player.buyUntil10 = true;
    player.sacrificed = DC.D0;
    playerInfinityUpgradesOnReset();
    Currency.infinityPoints.reset();
    resetInfinityRuns();
    Currency.infinities.reset();
    Currency.infinitiesBanked.reset();
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.dimensionBoosts = DC.D0;
    player.galaxies = DC.D0;
    
    if (player.exposes.gte(15)){
    player.break = true;
    };
    if (player.exposes.lt(15)) {
      player.break = false;
      Achievement(33).lock();
      Achievement(34).lock();
      Achievement(35).lock();
      Achievement(36).lock();
      Achievement(37).lock();
      Achievement(38).lock();
      Achievement(41).lock();
      Achievement(42).lock();
      Achievement(43).lock();
      Achievement(44).lock();
      Achievement(45).lock();
      Achievement(46).lock();
      Achievement(47).lock();
      Achievement(48).lock();
      Achievement(51).lock();
      Achievement(52).lock();
      Achievement(53).lock();
      Achievement(54).lock();
      Achievement(55).lock();
      Achievement(56).lock();
      Achievement(57).lock();
      Achievement(58).lock();
      Achievement(61).lock();
      Achievement(62).lock();
      Achievement(63).lock();
      Achievement(64).lock();
      Achievement(65).lock();
      Achievement(66).lock();
      Achievement(67).lock();
      Achievement(68).lock();
      Achievement(71).lock();
      Achievement(72).lock();
      Achievement(73).lock();
      Achievement(74).lock();
      Achievement(75).lock();
      Achievement(76).lock();
      Achievement(77).lock();
      Achievement(78).lock();
      Achievement(81).lock();
      Achievement(82).lock();
      Achievement(83).lock();
      Achievement(84).lock();
      Achievement(85).lock();
      Achievement(86).lock();
      Achievement(87).lock();

    }
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    initializeChallengeCompletions(true);
    if (player.exposes.lt(25)){
    Achievement(188).lock();
    };
    Achievement(318).lock();
    Currency.eternityPoints.reset();
    Currency.antimatter.reset();
    Currency.timeTheorems.reset();
    Currency.timeShards.reset();
    Currency.dilatedTime.reset();
    Currency.tachyonParticles.reset();
    Currency.imaginaryMachines.reset();
    Currency.realityMachines.reset();
    AntimatterDimensions.reset();
    player.reality.maxAM = DC.D0;
    player.reality.maxIP = DC.D0;
    player.reality.maxEP = DC.D0;
    player.reality.maxDT = DC.D0;
    player.infinities = DC.D0;
    if (player.exposes.gte(20)) {
    player.eternities = new Decimal(1000);
    };
    if (player.exposes.lt(20)) {
    player.eternities = DC.D0;
    Achievement(88).lock();
    Achievement(91).lock();
    Achievement(92).lock();
    Achievement(93).lock();
    Achievement(94).lock();
    Achievement(95).lock();
    Achievement(96).lock();
    Achievement(97).lock();
    Achievement(98).lock();
    Achievement(101).lock();
    Achievement(102).lock();
    Achievement(103).lock();
    Achievement(104).lock();
    Achievement(105).lock();
    Achievement(106).lock();
    Achievement(107).lock();
    Achievement(108).lock();
    Achievement(111).lock();
    Achievement(112).lock();
    Achievement(113).lock();
    Achievement(114).lock();
    Achievement(115).lock();
    Achievement(116).lock();
    Achievement(117).lock();
    Achievement(118).lock();
    Achievement(121).lock();
    Achievement(122).lock();
    Achievement(123).lock();
    Achievement(124).lock();
    Achievement(125).lock();
    Achievement(126).lock();
    Achievement(127).lock();
    Achievement(128).lock();
    Achievement(131).lock();
    Achievement(132).lock();
    Achievement(133).lock();
    Achievement(134).lock();
    Achievement(135).lock();
    Achievement(136).lock();
    Achievement(137).lock();
    Achievement(138).lock();
    };
    RemnantDimensions.resetAmount();
    player.expose.shatterPower = DC.D0;
    Replicanti.reset();
    if (player.exposes.gte(1)) {
      Effarig.quotes.firstShatter.show();
      Sercanote.quotes.initial.show();
    };
    if (player.exposes.gte(15)) {
      Teresa.quotes.shatter15.show();
    };
    if (player.exposes.gte(20)) {
      Enslaved.quotes.shatter20.show();
    };
    if (player.exposes.gte(25)) {
      Teresa.quotes.shatter25.show();
    };
    if (player.exposes.gte(50)) {
      Sercanote.quotes.shatter50.show();
    };
  }
}

  restartWithCarryoverPostShatter() {
    let rowProtect = 0;
    rowProtect = player.reality.glyphs.protectedRows;
    GameEnd.creditsClosed = false;
    GameEnd.creditsEverClosed = false;
    player.isGameEnd = false;
    player.isGameEnd2 = false;
    Pelle.isGameEnd = false;
    player.celestials.pelle.doomed = false;
    Tab.dimensions.antimatter.show();
    AchievementTimers.marathon2.reset();
    player.tabNotifications = new Set();
    player.triggeredTabNotificationBits = 0;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    if (player.exposes.lt(25)){
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    };
    Glyphs.unequipAll();
    if (player.exposes.lt(25)){
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = rowProtect;
    }
    if (player.exposes.gte(25)){
      player.reality.upgReqs = 67108800;
      player.reality.imaginaryUpgReqs = 67108800;
      player.reality.upgradeBits = 67108800;
      player.reality.imaginaryUpgradeBits = 67108800;
      player.realities = new Decimal(10000);
    }
    if (player.exposes.lt(25)){
      Achievement(141).lock();
      Achievement(142).lock();
      Achievement(143).lock();
      Achievement(144).lock();
      Achievement(145).lock();
      Achievement(146).lock();
      Achievement(147).lock();
      Achievement(148).lock();
      Achievement(151).lock();
      Achievement(152).lock();
      Achievement(153).lock();
      Achievement(154).lock();
      Achievement(155).lock();
      Achievement(156).lock();
      Achievement(157).lock();
      Achievement(158).lock();
      Achievement(161).lock();
      Achievement(162).lock();
      Achievement(163).lock();
      Achievement(164).lock();
      Achievement(165).lock();
      Achievement(166).lock();
      Achievement(167).lock();
      Achievement(168).lock();
      Achievement(171).lock();
      Achievement(172).lock();
      Achievement(173).lock();
      Achievement(174).lock();
      Achievement(175).lock();
      Achievement(176).lock();
      Achievement(177).lock();
      Achievement(178).lock();
      Achievement(181).lock();
      Achievement(182).lock();
      Achievement(183).lock();
      Achievement(184).lock();
      Achievement(185).lock();
      Achievement(186).lock();
      Achievement(187).lock();
      player.realities = DC.D0;
      player.partSimulatedReality = DC.D0;
      player.reality.glyphs.sac.power = DC.D0;
      player.reality.glyphs.sac.infinity = DC.D0;
      player.reality.glyphs.sac.time = DC.D0;
      player.reality.glyphs.sac.replication = DC.D0;
      player.reality.glyphs.sac.dilation = DC.D0;
      player.reality.glyphs.sac.effarig = DC.D0;
      player.reality.glyphs.sac.reality = DC.D0;
      player.reality.glyphs.undo = [];
      player.reality.glyphs.sets = new Array(7).fill({
        name: "",
        glyphs: []
      });
      player.reality.respec = false;
      player.reality.showGlyphSacrifice = false;
      player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
      player.reality.autoSort = 0;
      player.reality.autoCollapse = false;
      player.reality.autoAutoClean = false;
      player.reality.applyFilterToPurge = false;
      player.reality.moveGlyphsOnProtection = false;
      player.reality.autoEC = true;
      player.reality.glyphs.createdRealityGlyph = false;
      player.reality.initialSeed = Math.floor(Date.now() * Math.random() + 1);
      player.reality.seed = 1;
      player.reality.secondGaussian = 1e6;
      player.reality.musicSeed = Math.floor(Date.now() * Math.random() + 0xBCDDECCB);
      player.reality.musicSecondGaussian = 1e6;
      
      player.reality.upgradeBits = 0;
      player.reality.upgReqs = 0;
      player.reality.imaginaryUpgradeBits = 0;
      player.reality.imaginaryUpgReqs = 0;
      
      player.reality.reqLock = {
        reality: 0,
        imaginary: 0,
      };
    };
    player.reality.realityMachines = DC.D0;
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
    player.reality.rebuyables = {
        1: new Decimal(),
        2: new Decimal(),
        3: new Decimal(),
        4: new Decimal(),
        5: new Decimal(),
      };
    player.reality.imaginaryRebuyables = {
        1: new Decimal(),
        2: new Decimal(),
        3: new Decimal(),
        4: new Decimal(),
        5: new Decimal(),
        6: new Decimal(),
        7: new Decimal(),
        8: new Decimal(),
        9: new Decimal(),
        10: new Decimal(),
      };
    player.reality.respec = false;
    player.reality.showGlyphSacrifice = false;
    player.reality.showSidebarPanel = GLYPH_SIDEBAR_MODE.INVENTORY_MANAGEMENT;
    player.reality.autoSort = 0;
    player.reality.autoCollapse = false;
    player.reality.autoAutoClean = false;
    player.reality.applyFilterToPurge = false;
    player.reality.moveGlyphsOnProtection = false;
    player.reality.unlockedEC = 0;
    player.reality.autoEC = true;
    player.reality.lastAutoEC = DC.D0;
    player.reality.partEternitied = DC.D0;
    player.reality.autoAchieve = true;
    player.reality.gainedAutoAchievements = true;
    player.reality.achTimer = new Decimal();
    player.reality.hasCheckedFilter = false;
    if (player.exposes.lt(25)) {
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.perks.reset();
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    player.blackHole = Array.range(0, 2).map(id => ({
      id,
      intervalUpgrades: DC.D0,
      powerUpgrades: DC.D0,
      durationUpgrades: DC.D0,
      phase: DC.D0,
      active: false,
      unlocked: false,
      activations: DC.D0,
    }));
    player.blackHolePause = false;
    };
    player.blackHoleAutoPauseMode = 0;
    player.blackHolePauseTime = DC.D0;
    player.blackHoleNegative = DC.D1;
    

    Autobuyers.reset();
    player.reality.partEternitied = DC.D0;
    if (player.exposes.lt(25)){
    player.celestials.teresa.pouredAmount = 0;
    player.celestials.teresa.quoteBits = 0;
    player.celestials.teresa.unlockBits = 0;
    player.celestials.teresa.run = false;
    player.celestials.teresa.bestRunAM = DC.D1;
    player.celestials.teresa.bestAMSet = [];
    player.celestials.teresa.perkShop = Array.repeat(DC.D0, 6);
    player.celestials.teresa.lastRepeatedMachines = DC.D0;
    player.celestials.teresa.lastRepeatediM = DC.D0;
    player.celestials.effarig.relicShards = DC.D0;
    player.celestials.effarig.unlockBits = 0;
    player.celestials.effarig.run = false;
    player.celestials.effarig.quoteBits = 0;
    player.celestials.effarig.glyphWeights.ep = 25;
    player.celestials.effarig.glyphWeights.repl = 25;
    player.celestials.effarig.glyphWeights.dt = 25;
    player.celestials.effarig.glyphWeights.eternities = 25;
    player.celestials.effarig.autoAdjustGlyphWeights = false;
    player.celestials.enslaved.isStoring = false;
    player.celestials.enslaved.stored = DC.D0;
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.storedReal = DC.D0;
    player.celestials.enslaved.autoStoreReal = false;
    player.celestials.enslaved.isAutoReleasing = false;
    player.celestials.enslaved.quoteBits = 0;
    player.celestials.enslaved.unlocks = [];
    player.celestials.enslaved.run = false;
    player.celestials.enslaved.completed = false;
    player.celestials.enslaved.tesseracts = DC.D0;
    player.celestials.enslaved.hasSecretStudy = false;
    player.celestials.enslaved.feltEternity = false;
    player.celestials.enslaved.progressBits = 0;
    player.celestials.enslaved.hintBits = 0;
    player.celestials.enslaved.hintUnlockProgress = 0;
    player.celestials.enslaved.glyphHintsGiven = 0;
    player.celestials.enslaved.zeroHintTime = 0;
    Enslaved.autoReleaseTick = 0;
    player.celestials.v.unlockBits = 0;
    player.celestials.v.run = false;
    player.celestials.v.quoteBits = 0;
    player.celestials.v.runUnlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.goalReductionSteps = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    player.celestials.v.STSpent = 0;
    player.celestials.v.runGlyphs = [[], [], [], [], [], [], [], [], []];
    player.celestials.v.runRecords = [-10, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, 0, DC.D0, DC.D0];
    player.celestials.v.wantsFlipped = true;
    V.spaceTheorems = 0;
    player.celestials.ra.pets.teresa.level = 1;
    player.celestials.ra.pets.teresa.memories = DC.D0;
    player.celestials.ra.pets.teresa.memoryChunks = DC.D0;
    player.celestials.ra.pets.teresa.memoryUpgrades = 0;
    player.celestials.ra.pets.teresa.chunkUpgrades = 0;
    player.celestials.ra.pets.effarig.level = 1;
    player.celestials.ra.pets.effarig.memories = DC.D0;
    player.celestials.ra.pets.effarig.memoryChunks = DC.D0;
    player.celestials.ra.pets.effarig.memoryUpgrades = 0;
    player.celestials.ra.pets.effarig.chunkUpgrades = 0;
    player.celestials.ra.pets.enslaved.level = 1;
    player.celestials.ra.pets.enslaved.memories = DC.D0;
    player.celestials.ra.pets.enslaved.memoryChunks = DC.D0;
    player.celestials.ra.pets.enslaved.memoryUpgrades = 0;
    player.celestials.ra.pets.enslaved.chunkUpgrades = 0;
    player.celestials.ra.pets.v.level = 1;
    player.celestials.ra.pets.v.memories = DC.D0;
    player.celestials.ra.pets.v.memoryChunks = DC.D0;
    player.celestials.ra.pets.v.memoryUpgrades = 0;
    player.celestials.ra.pets.v.chunkUpgrades = 0;
    player.celestials.ra.alchemy = Array.repeat(0, 21)
      .map(() => ({
        amount: DC.D0,
        reaction: false
      }));
    player.celestials.ra.highestRefinementValue.power = DC.D0;
    player.celestials.ra.highestRefinementValue.infinity = DC.D0;
    player.celestials.ra.highestRefinementValue.time = DC.D0;
    player.celestials.ra.highestRefinementValue.replication = DC.D0;
    player.celestials.ra.highestRefinementValue.dilation = DC.D0;
    player.celestials.ra.highestRefinementValue.effarig = DC.D0;
    player.celestials.ra.quoteBits = 0;
    player.celestials.ra.momentumTime = DC.D0;
    player.celestials.ra.unlockBits = 0;
    player.celestials.ra.run = false;
    player.celestials.ra.charged = new Set();
    player.celestials.ra.disCharge = false;
    player.celestials.ra.peakGamespeed = DC.D1;
    player.celestials.ra.petWithRemembrance = "";
    player.celestials.laitela.darkMatter = DC.D0;
    player.celestials.laitela.maxDarkMatter = DC.D0;
    player.celestials.laitela.run = false;
    player.celestials.laitela.quoteBits = 0;
    player.celestials.laitela.dimensions = Array.range(0, 4).map(() =>
      ({
        amount: DC.D0,
        intervalUpgrades: DC.D0,
        powerDMUpgrades: DC.D0,
        powerDEUpgrades: DC.D0,
        timeSinceLastUpdate: DC.D0,
        ascensionCount: DC.D0
      }));
    player.celestials.laitela.entropy = DC.D0;
    player.celestials.laitela.thisCompletion = new Decimal(3600);
    player.celestials.laitela.fastestCompletion = new Decimal(3600);
    player.celestials.laitela.difficultyTier = 0;
    player.celestials.laitela.upgrades = {};
    player.celestials.laitela.darkMatterMult = DC.D1;
    player.celestials.laitela.darkEnergy = DC.D0;
    player.celestials.laitela.singularitySorting.displayResource = 0;
    player.celestials.laitela.singularitySorting.sortResource = 0;
    player.celestials.laitela.singularitySorting.showCompleted = 0;
    player.celestials.laitela.singularitySorting.sortOrder = 0;
    player.celestials.laitela.singularities = DC.D0;
    player.celestials.laitela.singularityCapIncreases = DC.D0;
    player.celestials.laitela.lastCheckedMilestones = DC.D0;
    player.celestials.laitela.milestoneGlow = true;
    };
    player.celestials.pelle.doomed = false;
    player.celestials.pelle.upgrades = new Set();
    player.celestials.pelle.remnants = DC.D0;
    player.celestials.pelle.realityShards = DC.D0;
    player.celestials.pelle.records.totalInfinityPoints = DC.D0;
    player.celestials.pelle.records.totalEternityPoints = DC.D0;
    player.celestials.pelle.rebuyables.antimatterDimensionMult = DC.D0;
    player.celestials.pelle.rebuyables.timeSpeedMult = DC.D0;      
    player.celestials.pelle.rebuyables.glyphLevels = DC.D0;
    player.celestials.pelle.rebuyables.infConversion = DC.D0;
    player.celestials.pelle.rebuyables.galaxyPower = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = DC.D0;
    player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = DC.D0;
    player.celestials.pelle.rifts.vacuum.fill = DC.D0;
    player.celestials.pelle.rifts.vacuum.active = false;
    player.celestials.pelle.rifts.vacuum.reducedTo = 1;
    player.celestials.pelle.rifts.decay.fill = DC.D0;
    player.celestials.pelle.rifts.decay.active = false;
    player.celestials.pelle.rifts.decay.percentageSpent = 0;
    player.celestials.pelle.rifts.decay.reducedTo = 1;
    player.celestials.pelle.rifts.chaos.fill = 0;
    player.celestials.pelle.rifts.chaos.active = false;
    player.celestials.pelle.rifts.chaos.reducedTo = 1;
    player.celestials.pelle.rifts.recursion.fill = DC.D0;
    player.celestials.pelle.rifts.recursion.active = false;
    player.celestials.pelle.rifts.recursion.reducedTo = 1;
    player.celestials.pelle.rifts.paradox.fill = DC.D0;
    player.celestials.pelle.rifts.paradox.active = false;
    player.celestials.pelle.rifts.paradox.reducedTo = 1;
    player.celestials.pelle.progressBits = 0;
    player.celestials.pelle.galaxyGenerator.unlocked = false;
    player.celestials.pelle.galaxyGenerator.spentGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.generatedGalaxies = DC.D0;
    player.celestials.pelle.galaxyGenerator.phase = 0;
    player.celestials.pelle.galaxyGenerator.sacrificeActive = false;
    player.celestials.pelle.collapsed.upgrades = false;
    player.celestials.pelle.collapsed.rifts = false;
    player.celestials.pelle.collapsed.galaxies = false;
    player.celestials.pelle.showBought = false;
    player.celestials.pelle.records.totalAntimatterThisShatter = DC.D0;
    player.dilation.studies = [];
    player.dilation.active = false;
    player.dilation.upgrades.clear();
    player.dilation.rebuyables = {
      1: DC.D0,
      2: DC.D0,
      3: DC.D0,
      11: DC.D0,
      12: DC.D0,
      13: DC.D0,
    };
    Currency.tachyonParticles.reset();
    player.dilation.nextThreshold = DC.E3;
    player.dilation.baseTachyonGalaxies = DC.D0;
    player.dilation.totalTachyonGalaxies = DC.D0;
    Currency.dilatedTime.reset();
    player.dilation.lastEP = DC.DM1;
    resetChallengeStuff();
    player.eternityChalls = {};
    player.reality.unlockedEC = 0;
    player.reality.lastAutoEC = DC.D0;
    player.challenge.eternity.current = 0;
    player.challenge.eternity.unlocked = 0;
    player.challenge.eternity.requirementBits = 0;
    Lazy.invalidateAll();
    ECTimeStudyState.invalidateCachedRequirements();
    player.IPMultPurchases = DC.D0;
    Currency.infinityPower.reset();
    player.postC4Tier = 0;
    Currency.timeShards.reset();
    
    Currency.eternityPoints.reset();
    EternityUpgrade.epMult.reset();
    Currency.eternities.reset();
    player.eternityUpgrades.clear();
    player.totalTickGained = DC.D0;
    player.totalTickBought = DC.D0;
    Currency.timeTheorems.reset();
    resetEternityRuns();
    secondSoftReset(false);
    player.respec = false;
    player.eterc8ids = 50;
    player.eterc8repl = 40;
    InfinityDimensions.fullReset();
    InfinityDimensions.resetAmount();
    fullResetTimeDimensions();
    resetTimeDimensions();
    player.buyUntil10 = true;
    player.sacrificed = DC.D0;
    playerInfinityUpgradesOnReset();
    Currency.infinityPoints.reset();
    resetInfinityRuns();
    Currency.infinities.reset();
    Currency.infinitiesBanked.reset();
    player.partInfinityPoint = 0;
    player.partInfinitied = 0;
    player.dimensionBoosts = DC.D0;
    player.galaxies = DC.D0;
    
    if (player.exposes.gte(15)){
    player.break = true;
    };
    if (player.exposes.lt(15)) {
      player.break = false;
      Achievement(33).lock();
      Achievement(34).lock();
      Achievement(35).lock();
      Achievement(36).lock();
      Achievement(37).lock();
      Achievement(38).lock();
      Achievement(41).lock();
      Achievement(42).lock();
      Achievement(43).lock();
      Achievement(44).lock();
      Achievement(45).lock();
      Achievement(46).lock();
      Achievement(47).lock();
      Achievement(48).lock();
      Achievement(51).lock();
      Achievement(52).lock();
      Achievement(53).lock();
      Achievement(54).lock();
      Achievement(55).lock();
      Achievement(56).lock();
      Achievement(57).lock();
      Achievement(58).lock();
      Achievement(61).lock();
      Achievement(62).lock();
      Achievement(63).lock();
      Achievement(64).lock();
      Achievement(65).lock();
      Achievement(66).lock();
      Achievement(67).lock();
      Achievement(68).lock();
      Achievement(71).lock();
      Achievement(72).lock();
      Achievement(73).lock();
      Achievement(74).lock();
      Achievement(75).lock();
      Achievement(76).lock();
      Achievement(77).lock();
      Achievement(78).lock();
      Achievement(81).lock();
      Achievement(82).lock();
      Achievement(83).lock();
      Achievement(84).lock();
      Achievement(85).lock();
      Achievement(86).lock();
      Achievement(87).lock();

    }
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    initializeChallengeCompletions(true);
    if (player.exposes.lt(25)){
    Achievement(188).lock();
    };
    Achievement(318).lock();
    Currency.eternityPoints.reset();
    Currency.antimatter.reset();
    Currency.timeTheorems.reset();
    Currency.timeShards.reset();
    Currency.dilatedTime.reset();
    Currency.tachyonParticles.reset();
    Currency.imaginaryMachines.reset();
    Currency.realityMachines.reset();
    AntimatterDimensions.reset();
    player.reality.maxAM = DC.D0;
    player.reality.maxIP = DC.D0;
    player.reality.maxEP = DC.D0;
    player.reality.maxDT = DC.D0;
    player.infinities = DC.D0;
    if (player.exposes.gte(20)) {
    player.eternities = new Decimal(1000);
    };
    if (player.exposes.lt(20)) {
    player.eternities = DC.D0;
    Achievement(88).lock();
    Achievement(91).lock();
    Achievement(92).lock();
    Achievement(93).lock();
    Achievement(94).lock();
    Achievement(95).lock();
    Achievement(96).lock();
    Achievement(97).lock();
    Achievement(98).lock();
    Achievement(101).lock();
    Achievement(102).lock();
    Achievement(103).lock();
    Achievement(104).lock();
    Achievement(105).lock();
    Achievement(106).lock();
    Achievement(107).lock();
    Achievement(108).lock();
    Achievement(111).lock();
    Achievement(112).lock();
    Achievement(113).lock();
    Achievement(114).lock();
    Achievement(115).lock();
    Achievement(116).lock();
    Achievement(117).lock();
    Achievement(118).lock();
    Achievement(121).lock();
    Achievement(122).lock();
    Achievement(123).lock();
    Achievement(124).lock();
    Achievement(125).lock();
    Achievement(126).lock();
    Achievement(127).lock();
    Achievement(128).lock();
    Achievement(131).lock();
    Achievement(132).lock();
    Achievement(133).lock();
    Achievement(134).lock();
    Achievement(135).lock();
    Achievement(136).lock();
    Achievement(137).lock();
    Achievement(138).lock();
    };
    RemnantDimensions.resetAmount();
    player.expose.shatterPower = DC.D0;
    Replicanti.reset();
    if (player.exposes.gte(1)) {
      Effarig.quotes.firstShatter.show();
      Sercanote.quotes.initial.show();
    };
    if (player.exposes.gte(15)) {
      Teresa.quotes.shatter15.show();
    };
    if (player.exposes.gte(20)) {
      Enslaved.quotes.shatter20.show();
    };
    if (player.exposes.gte(25)) {
      Teresa.quotes.shatter25.show();
    };
    if (player.exposes.gte(50)) {
      Sercanote.quotes.shatter50.show();
    };
  }
}

import * as ADNotations from "adnot-beport-small";
import { DC } from "./constants";
import { Player } from "./player";
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
    player.isGameEnd = false;
    Tab.dimensions.antimatter.show();
    AchievementTimers.marathon2.reset();
    player.tabNotifications = new Set();
    player.triggeredTabNotificationBits = 0;
    player.tutorialState = 0;
    player.tutorialActive = true;
    player.options.confirmations.glyphSelection = true;
    ui.view.newUI = player.options.newUI;
    ui.view.news = player.options.news.enabled;
    Themes.find(Theme.currentName()).set();
    Notations.all.find(n => n.name === player.options.notation).setAsCurrent();
    ADNotations.Settings.exponentCommas.min = 10 ** player.options.notationDigits.comma;
    ADNotations.Settings.exponentCommas.max = 10 ** player.options.notationDigits.notation;
    player.realities = DC.D0;
    player.partSimulatedReality = DC.D0;
    player.reality.realityMachines = DC.D0;
    player.reality.maxRM = DC.D0;
    player.reality.imaginaryMachines = DC.D0;
    player.reality.iMCap = DC.D0;
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
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = 2;
    Glyphs.unequipAll();
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = 2;
    player.reality.glyphs.filter = {
      select: AUTO_GLYPH_SCORE.LOWEST_SACRIFICE,
      trash: AUTO_GLYPH_REJECT.SACRIFICE,
      simple: 0,
      types: Object.keys(getGlyphTypes())
        .filter(t => GlyphInfo.generatedGlyphTypes.includes(t))
        .mapToObject(t => t, t => ({
          rarity: new Decimal(),
          score: 0,
          effectCount: 0,
          specifiedMask: [],
          effectScores: [...Array(GlyphInfo[t].effectIDs.length).keys()].mapToObject(e => GlyphInfo[t].effectIDs[e], () => 0),
        })),
    };
    player.reality.glyphs.createdRealityGlyph = false;
    player.reality.initialSeed = Math.floor(Date.now() * Math.random() + 1);
    player.reality.seed = 1;
    player.reality.secondGaussian = 1e6;
    player.reality.musicSeed = Math.floor(Date.now() * Math.random() + 0xBCDDECCB);
    player.reality.musicSecondGaussian = 1e6;
    player.reality.rebuyables = {
      1: new Decimal(),
      2: new Decimal(),
      3: new Decimal(),
      4: new Decimal(),
      5: new Decimal(),
    };
    player.reality.upgradeBits = 0;
    player.reality.upgReqs = 0;
    player.reality.imaginaryUpgradeBits = 0;
    player.reality.imaginaryUpgReqs = 0;
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
    player.reality.reqLock = {
      reality: 0,
      imaginary: 0,
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
    player.reality.lastAutoEC = 0;
    player.reality.partEternitied = DC.D0;
    player.reality.autoAchieve = true;
    player.reality.gainedAutoAchievements = true;
    player.reality.achTimer = new Decimal();
    player.reality.hasCheckedFilter = false;
    player.reality.glyphs.sac.power = DC.D0;
    player.reality.glyphs.sac.infinity = DC.D0;
    player.reality.glyphs.sac.time = DC.D0;
    player.reality.glyphs.sac.replication = DC.D0;
    player.reality.glyphs.sac.dilation = DC.D0;
    player.reality.glyphs.sac.effarig = DC.D0;
    player.reality.glyphs.sac.reality = DC.D0;
    player.blackHole = Array.range(0, 2).map(id => ({
      id,
      intervalUpgrades: 0,
      powerUpgrades: DC.D0,
      durationUpgrades: DC.D0,
      phase: DC.D0,
      active: false,
      unlocked: false,
      activations: DC.D0,
    }));
    player.blackHolePause = false;
    player.blackHoleAutoPauseMode = 0;
    player.blackHolePauseTime = DC.D0;
    player.blackHoleNegative = DC.D1;
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
    player.shownRuns.Reality = true;
    player.shownRuns.Eternity = true;
    player.shownRuns.Infinity = true;
    player.requirementChecks.infinity.maxAll = false;
    player.requirementChecks.infinity.noSacrifice = true;
    player.requirementChecks.infinity.noAD8 = true;
    player.requirementChecks.eternity.onlyAD1 = true;
    player.requirementChecks.eternity.onlyAD8 = true;
    player.requirementChecks.eternity.noAD1 = true;
    player.requirementChecks.eternity.noRG = true;
    player.requirementChecks.reality.noAM = true;
    player.requirementChecks.reality.noTriads = true;
    player.requirementChecks.reality.noPurchasedTT = true;
    player.requirementChecks.reality.noInfinities = true;
    player.requirementChecks.reality.noEternities = true;
    player.requirementChecks.reality.noContinuum = true;
    player.requirementChecks.reality.maxID1 = DC.D0;
    player.requirementChecks.reality.maxStudies = 0;
    player.requirementChecks.reality.maxGlyphs = 0;
    player.requirementChecks.reality.slowestBH = DC.D1;
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
    Replicanti.reset(true);
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
    player.auto.bigCrunch.mode = 0;
    player.auto.eternity.mode = 0;
    Autobuyers.reset();
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
    player.break = true;
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    initializeChallengeCompletions(true);
    Achievement(188).lock();
    Achievement(288).lock();
    player.records.totalTimePlayed = player.records.realTimePlayed;
    player.records.timePlayedAtBHUnlock = Number.MAX_VALUE;
    player.records.realTimeDoomed = DC.D0;
    player.records.recentInfinities = Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, ""]);
    player.records.recentEternities = Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0]);
    player.records.recentRealities = Array.range(0, 10).map(() =>
      [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0, DC.D0]);
    player.records.thisInfinity.time = DC.D0;
    player.records.thisInfinity.realTime = DC.D0;
    player.records.thisInfinity.trueTime = 0;
    player.records.thisInfinity.lastBuyTime = DC.D0;
    player.records.thisInfinity.maxAM = DC.D0;
    player.records.thisInfinity.bestIPmin = DC.D0;
    player.records.thisInfinity.bestIPminVal = DC.D0;
    player.records.bestInfinity.time = DC.BEMAX;
    player.records.bestInfinity.realTime = DC.BEMAX;
    player.records.bestInfinity.trueTime = 0;
    player.records.bestInfinity.bestIPminEternity = DC.D0;
    player.records.bestInfinity.bestIPminReality = DC.D0;
    player.records.thisEternity.time = DC.D0;
    player.records.thisEternity.realTime = DC.D0;
    player.records.thisEternity.trueTime = 0;
    player.records.thisEternity.maxAM = DC.D0;
    player.records.thisEternity.maxIP = DC.D0;
    player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
    player.records.thisEternity.bestEPmin = DC.D0;
    player.records.thisEternity.bestEPminVal = DC.D0;
    player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
    player.records.bestEternity.time = DC.BEMAX;
    player.records.bestEternity.realTime = DC.BEMAX;
    player.records.bestEternity.trueTime = 0;
    player.records.bestEternity.bestEPminReality = DC.D0;
    player.records.thisReality.time = DC.D0;
    player.records.thisReality.realTime = DC.D0;
    player.records.thisReality.trueTime = 0;
    player.records.thisReality.maxAM = DC.D0;
    player.records.thisReality.maxIP = DC.D0;
    player.records.thisReality.maxEP = DC.D0;
    player.records.thisReality.bestEternitiesPerMs = DC.D0;
    player.records.thisReality.maxReplicanti = DC.D0;
    player.records.thisReality.maxDT = DC.D0;
    player.records.thisReality.bestRSmin = DC.D0;
    player.records.thisReality.bestRSminVal = DC.D0;
    player.records.bestReality.time = DC.BEMAX;
    player.records.bestReality.realTime = DC.BEMAX;
    player.records.bestReality.trueTime = 0;
    player.records.bestReality.glyphStrength = DC.D0;
    player.records.bestReality.RM = DC.D0;
    player.records.bestReality.RMSet = [];
    player.records.bestReality.RMmin = DC.D0;
    player.records.bestReality.RMminSet = [];
    player.records.bestReality.glyphLevel = DC.D0;
    player.records.bestReality.glyphLevelSet = [];
    player.records.bestReality.bestEP = DC.D0;
    player.records.bestReality.bestEPSet = [];
    player.records.bestReality.speedSet = [];
    player.records.bestReality.iMCapSet = [];
    player.records.bestReality.laitelaSet = [];
    pelle.isGameEnd = false;
    pelle.isDoomed = false;
  },
restartWithCarryoverPostShatter() {
    player.isGameEnd = false;
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
  
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = 2;
    Glyphs.unequipAll();
    player.reality.glyphs.protectedRows = 0;
    Glyphs.autoClean(0);
    player.reality.glyphs.protectedRows = 2;
    
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
    player.reality.lastAutoEC = 0;
    player.reality.partEternitied = DC.D0;
  
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
    Replicanti.reset(true);
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
    player.break = true;
    resetTickspeed();
    AntimatterDimensions.reset();
    Currency.antimatter.reset();
    initializeChallengeCompletions(true);
    Achievement(188).lock();
    Achievement(288).lock();
    pelle.isGameEnd = false;
    pelle.isDoomed = false;
  }
};

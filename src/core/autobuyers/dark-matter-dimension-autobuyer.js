import { IntervaledAutobuyerState } from "./autobuyer";

export class DarkMatterDimensionAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.darkMatterDims;
  }

  get name() {
    return i18n("auto", "dmdAuto");
  }

  get isUnlocked() {
    return SingularityMilestone.darkDimensionAutobuyers.canBeApplied;
  }

  get interval() {
    return 1000 * SingularityMilestone.darkAutobuyerSpeed.effectValue;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    Laitela.maxAllDMDimensions(SingularityMilestone.darkDimensionAutobuyers.effectValue);
  }
}
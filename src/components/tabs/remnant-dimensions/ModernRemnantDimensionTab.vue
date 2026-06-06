<script>
import PrimaryButton from "@/components/PrimaryButton";
import ModernRemnantDimensionRow from "./ModernRemnantDimensionRow";

export default {
  name: "ModernRemnantDimensionsTab",
  components: {
    PrimaryButton,
    ModernRemnantDimensionRow
  },
  data() {
    return {
      totalUpgrades: new Decimal(0),
      shatterPower: new Decimal(0),
      shatterPowerPerSecond: new Decimal(0),
      areAutobuyersUnlocked: false,
      conversionRate: new Decimal(0),
      effect: new Decimal(0),
    };
  },
  computed: {
  },
  methods: {
    update() {
      this.shatterPower.copyFrom(Currency.shatterpower);
      this.shatterPowerPerSecond.copyFrom(RemnantDimension(1).productionPerRealSecond);
     // this.areAutobuyersUnlocked = Autobuyer.remnantDimension(1).isUnlocked;
     this.conversionRate.copyFrom(Currency.shatterpowerconversionrate);
     this.effect = this.shatterPower.pow(this.conversionRate).max(1)
    },
    maxAll() {
      RemnantDimensions.buyMax()
    },
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <!--<PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>-->
    </div>
    <div>
      <p>
          <span class="c-remnant-dim-description__accent">{{formatX(effect, 2, 2)}}</span> Dimboost Strength (With the conversion rate by having <span class="c-remnant-dim-description__accent">{{format(shatterPower,2,2)}}</span> Shatter Power, raised to the power of <span class="c-remnant-dim-description__accent">{{format(conversionRate,2,2)}}</span>)
      </p>
    </div>
    <div>You are getting {{ format(shatterPowerPerSecond, 2, 0) }} shatter power per second.</div>
    <div class="l-dimensions-container">
      <ModernRemnantDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
  </div>
</template>
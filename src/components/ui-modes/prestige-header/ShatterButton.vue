<script>
export default {
  name: "ShatterButton",
  data() {
    return {
      canShatter: false,
      gainedSS: 0
    };
  },
  computed: {
    formatSSGain() {
      return `Shattershards gained: ${format(this.gainedSS, 2)}`;
    },
    classObject() {
      return {
        "c-shatter-button--unlocked": this.canShatter,
        "c-shatter-button--locked": !this.canShatter
      };
    }
  },
  methods: {
    update() {
      this.canShatter = isShatterAvailable();
      this.showPelleGlow = true;
      if (!this.canShatter) {
        this.gainedSS = 0;
        return;
      }
      this.gainedSS = gainedShatterShards();
    },
    handleClick() {
      if (this.canShatter) {
        shatterResetRequest();
      }
    }
  }
};
</script>

<template>
  <div class="l-shatter-button">
    <button
      class="c-shatter-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-shatter-button__contents">
        <template v-if="canShatter">
          <div class="c-shatter-button__header">
            Shatter
          </div>
          <div>{{ formatSSGain }}</div>
        </template>
        <template v-else>
          <div>Reach {{ format("1e9000000000000000") }} Antimatter to unlock the ability to Shatter</div>
        </template>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>

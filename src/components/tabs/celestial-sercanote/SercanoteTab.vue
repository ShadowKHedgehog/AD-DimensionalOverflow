<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";


export default {
  name: "Sercanotetab",
  components: { 
    CelestialQuoteHistory
  },
  data() {
    return {
      isTrapped: false,
      canEnterSercanote: false,
      completedRows: 0,
      cappedResources: 0,
    };
  },
  computed: {
    symbol() {
      return Sercanote.symbol;
    },
    totalRows() {
      return Achievements.PreSercanote.length;
    },
    totalAlchemyResources() {
      return AlchemyResources.all.length;
    }
  },
  methods: {
    update() {
      this.isTrapped = Sercanote.isTrapped;
      if (!this.isTrapped) {
        this.completedRows = Achievements.preSercanote.countWhere(r => r.every(a => a.isUnlocked));
        this.cappedResources = AlchemyResources.all.countWhere(r => r.capped);
        this.canEnterSercanote = this.completedRows === this.totalRows &&
          this.cappedResources === this.totalAlchemyResources;
      }
      t
    },
    toggleBought() {
      // implement later
    },
    showModal() {
      // implement later
    },
    enterEndingModal() {
      // implement later
    }
  }
};
</script>

<template>
  <div class="l-sercanote-celestial-tab">
    <div
      v-if="isTrapped"
      class="l-sercanote-all-content-container"
    >
      <CelestialQuoteHistory celestial="pelle" />
      <div class="button-container">
        <button
          class="o-sercanote-button"
          @click="showModal"
        >
          not implemented yet
        </button>
      </div>
      <br>
    </div>
    <button
      v-else-if="canEnterSercanote"
      class="s-sercanote-realityenter-button"
      @click="enterEndingModal"
    >
      Enter<br>The<br>Final<br>Reality</br>
      <div class="sercanote-icon-container">
        <span class="sercanote-icon">{{ symbol }}</span>
      </div>
    </button>
    <div
      v-else
      class="sercanote-unlock-requirements"
    >
      You must have {{ formatInt(totalRows) }} rows of Achievements
      and all of your Glyph Alchemy Resources capped to unlock Pelle, Celestial of Antimatter.
      <br>
      <br>
      {{ formatInt(completedRows) }} / {{ formatInt(totalRows) }} Achievement rows completed
      <br>
      {{ formatInt(cappedResources) }} / {{ formatInt(totalAlchemyResources) }} capped Alchemy Resources
    </div>
  </div>
</template>

<style scoped>
.l-sercanote-celestial-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.l-sercanote-all-content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.o-sercanote-button {
  font-family: Typewriter;
  color: var(--color-text);
  background: var(--color-text-inverted);
  border: 0.1rem solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1rem;
  padding: 1rem;
  transition-duration: 0.12s;
  cursor: pointer;
}

.o-sercanote-button:hover {
  box-shadow: 0.1rem 0.1rem 0.3rem var(--color-pelle--base);
}

.o-sercanote-quotes-button {
  display: flex;
  width: 7rem;
  height: 7rem;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: 900;
  color: var(--color-pelle--base);
}

.sercanote-unlock-requirements {
  width: 50rem;
  padding: 0.5rem;
  font-size: 2.4rem;
  color: var(--color-pelle--base);
  background: black;
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
}

.sercanote-realityenter-button {
  width: 20rem;
  align-self: center;
  font-family: Typewriter;
  font-size: 3rem;
  color: var(--color-sercanote--base);
  background: black;
  border: var(--var-border-width, 0.2rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 1rem;
  transition-duration: 0.4s;
  cursor: pointer;
}

.sercanote-enterreality-button:hover {
  box-shadow: 0 0 2rem var(--color-sercanote--base);
}

.sercanote-icon-container {
  display: flex;
  width: 15rem;
  height: 15rem;
  justify-content: center;
  align-items: center;
  font-size: 10rem;
  text-shadow: 0 0 1.5rem #9b0101;
  background: white;
  border: var(--var-border-width, 0.4rem) solid var(--color-pelle--base);
  border-radius: 50%;
  box-shadow: 0 0 1.5rem #9b0101;
  margin: auto;
  margin-top: 3rem;
  transition-duration: 0.4s;
}

.pelle-doom-button:hover .pelle-icon-container {
  color: var(--color-pelle--base);
  background: black;
}

@keyframes a-roll {
  100% { transform: rotateY(360deg); }
}

.pelle-icon {
  animation: a-roll infinite 8s linear;
}
</style>

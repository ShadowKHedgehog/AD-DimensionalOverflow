import { isDecimal } from "../../../utility/type-check";

export const END_STATE_MARKERS = {
  // Tab zalgoification starts as soon as endState > 0
  get GAME_END() {
    if (player.exposes.gte(1)) return 1e308;
    return 1;
  },
  get TAB_START_HIDE() {
    if (player.exposes.gte(1)) return 1e308;
    return 1.5;
  },
  get INTERACTIVITY_DISABLED() {
    if (player.exposes.gte(1)) return 1e308;
    return 2.5;
  },
  get FADE_AWAY() {
    if (player.exposes.gte(1)) return 1e308;
    return 2.5;
  },
  get SAVE_DISABLED() {
    if (sha512_256(player.password.replace(/\s/gu, "").toUpperCase()) !== "060646bd56a29d5cbdad16195f6afbcb0367ce33dba3150e882b961d14885544") {
      return -9e15;
    }
    if (player.exposes.gte(1)) return 1e308;
    return 4;
  },
  get END_NUMBERS() {
    if (player.exposes.gte(1)) return 1e308;
    return 4.2;
  },
  get CREDITS_START() {
    if (player.endgames >= 1) return 1e308;
    return 4.5;
  },
  get SHOW_NEW_GAME() {
    if (player.exposes.gte(1)) return 1e308;
    return 15.5;
  },
  get SPECTATE_GAME() {
    if (player.exposes.gte(1)) return 1e308;
    return 15.9;
  },
  // The song is 4:27 and the credits increment by 1 every 20 seconds. Needs changing if the song is changed.
  get SONG_END() {
    if (player.exposes.gte(1)) return 1e308;
    return 17.9;
  },
  get CREDITS_END() {
    if (player.exposes.gte(1)) return 1e308;
    return 160;
  },
};

export const GameEnd = {
  get endState() {
    if (this.removeAdditionalEnd || player.bypassEnd) return this.additionalEnd;
    return Math.max(player.celestials.pelle.records.totalAntimatter.add(1).log10().add(1).log10().sub(8.7)
      .div(Math.log10(9e15) - 8.7).min(1).toNumber() + this.additionalEnd);
  },

  _additionalEnd: 0,
  get additionalEnd() {
    return (player.isGameEnd || this.removeAdditionalEnd) ? this._additionalEnd : 0;
  },
  set additionalEnd(x) {
    this._additionalEnd = (player.isGameEnd || this.removeAdditionalEnd) ? x : 0;
  },

  removeAdditionalEnd: false,

  creditsClosed: false,
  creditsEverClosed: false,

  gameLoop(diffr) {
    const diff = isDecimal(diffr) ? diffr.toNumber() : diffr;
    if (this.removeAdditionalEnd) {
      this.additionalEnd -= Math.min(diff / 200, 0.5);
      if (this.additionalEnd < 4) {
        this.additionalEnd = 0;
        this.removeAdditionalEnd = false;
      }
    }
    if (!this.removeAdditionalEnd && this.endState >= END_STATE_MARKERS.GAME_END &&
        ui.$viewModel.modal.progressBar === undefined) {
      player.isGameEnd = true;
      this.additionalEnd += Math.min(diff / 1000 / 20, 0.1);
    }
  }
};

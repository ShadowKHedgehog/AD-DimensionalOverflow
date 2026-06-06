export function shatterResetRequest() {
  if (!Player.canShatter) return;
  shatterReset();
}
export function shatterReset() {
  if (!Player.canShatter) return;
  EventHub.dispatch(GAME_EVENT.SHATTER_RESET_BEFORE);
  shatterGiveRewards();
  restartWithCarryoverPostShatter();
  EventHub.dispatch(GAME_EVENT.SHATTER_RESET_AFTER);
}
function shatterGiveRewards() {
  shatterUpdateStatistics();

  const shatterShards = gainedShatterShards();
  Currency.shattershards.add(shatterShards);
  player.exposes = player.exposes.add(gainedExposes());
}
function shatterUpdateStatistics() {
  player.records.bestShatter.time = Decimal.min(player.records.thisShatter.time, player.records.bestShatter.time);
  player.records.bestShatter.trueTime = Decimal.min(player.records.thisShatter.trueTime, player.records.bestShatter.time).toNumber();
  player.records.bestShatter.realTime = Decimal.min(player.records.thisShatter.realTime, player.records.bestShatter.time);
  player.records.bestShatter.shattershards = Decimal.max(player.records.bestShatter.shattershards, gainedShatterShards();
  player.records.thisShatter = {
      time: new Decimal(0),
      realTime: new Decimal(0),
      trueTime: 0,
      maxAM: new Decimal(0),
      bestEP: new Decimal(0),
  }
}

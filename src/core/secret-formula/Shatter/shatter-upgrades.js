import { DC } from "../../constants";



export const shatterUpgrades = {
  remotescaleEX: rebuyable({
    id: "Remote Scalingx",
    initialCost: new Decimal(1e5),
    costIncrease: new Decimal(5e50),
    maxUpgrades: new Decimal(100),
    description: "Remote Scaling is moved 10k Galaxies Later",
    effect: () => player.expose.remotegalaxypurchases.times(10000),
    formatEffect: value => formatX(value, 2, 2),
  }),
  
};

import { clamp } from './util.js';

export function computePrice(cp, item, destinationBiome, policy){
  if (item.regions && item.regions.includes(destinationBiome)){
    return roundMoney(cp * (item.regional_mult_in ?? 1));
  }
  let out = item.regional_mult_out ?? 1;
  const p = policy[destinationBiome] || {};
  if (item.perishable) out += p.delta_perishable || 0;
  if (item.bulky) out += p.delta_bulky || 0;
  if (item.fragile) out += p.delta_fragile || 0;
  out = clamp(out, 0.90, 1.40);
  return roundMoney(cp * out);
}

export function roundMoney(v){
  return Math.round(v*100)/100;
}



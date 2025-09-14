import { AttrBlock, Member, maxHP, maxMP, maxStamina, recomputeResources, makeMember } from "./party";

export interface Enemy extends Member {
  xpYield?: number;
}

export function makeEnemy(params: {
  id: string; name: string; level: number; race?: string;
  startingAttributes: AttrBlock; currentAttributes?: Partial<AttrBlock>;
  role?: Member["role"]; xpYield?: number;
}): Enemy {
  const enemy = makeMember({
    ...params,
    isPlayer: false,
    isNPC: true,
    controllable: false,
  }) as Enemy;
  enemy.faction = "enemy";
  enemy.xpYield = params.xpYield;
  return enemy;
}

/** Recalculate enemy resource maximums and clamp current values. */
export function recomputeEnemyResources(e: Enemy): void {
  recomputeResources(e);
}

export const enemyMaxHP = (vit: number, con: number, level: number) => maxHP(vit, con, level);
export const enemyMaxMP = (wis: number, level: number) => maxMP(wis, level);
export const enemyMaxStamina = (con: number, level: number) => maxStamina(con, level);

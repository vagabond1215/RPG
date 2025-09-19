import { describe, expect, it } from "vitest";

import {
  calculateApparelVariantPrice,
  calculateArmorVariantPrice,
  calculateWeaponVariantPrice,
  getArmorEnchantmentDetail,
  getWeaponBaseline,
  getWeaponEnchantmentDetail,
  listWeaponBaselines,
} from "../data/game/item_baselines";

describe("item baselines", () => {
  it("exposes canonical sword archetypes", () => {
    const swords = listWeaponBaselines("sword");
    expect(swords.length).toBeGreaterThan(3);
    const ids = swords.map((entry) => entry.key);
    expect(ids).toContain("longsword");
  });

  it("anchors weapon pricing on base values", () => {
    const baseline = getWeaponBaseline("arming-sword");
    expect(baseline?.basePriceCp).toBe(710);
    const price = calculateWeaponVariantPrice("arming-sword");
    expect(price).toBe(710);
  });

  it("scales weapon prices with quality, material, and enchantments", () => {
    const base = calculateWeaponVariantPrice("arming-sword");
    const fineMithril = calculateWeaponVariantPrice("arming-sword", {
      quality: "Masterwork",
      materialKey: "mithril",
    });
    const enchanted = calculateWeaponVariantPrice("arming-sword", {
      materialKey: "mithril",
      quality: "Masterwork",
      enchantmentKey: "stormlash",
      enchantmentGrade: "Major",
    });
    expect(fineMithril).toBeGreaterThan(base!);
    expect(enchanted).toBeGreaterThan(fineMithril!);
  });

  it("exposes enchantment grade details", () => {
    const detail = getWeaponEnchantmentDetail("stormlash", "Greater");
    expect(detail?.effectSlug).toContain("lightning");
    const armorDetail = getArmorEnchantmentDetail("spellward", "Minor");
    expect(armorDetail?.effectSlug).toContain("spell");
  });

  it("scales armor pricing based on configuration", () => {
    const base = calculateArmorVariantPrice("breastplate");
    const upgraded = calculateArmorVariantPrice("breastplate", {
      materialKey: "dragonhide",
      quality: "Masterwork",
      enchantmentKey: "spellward",
      enchantmentGrade: "Greater",
    });
    expect(upgraded).toBeGreaterThan(base!);
  });

  it("scales apparel pricing with enchantments", () => {
    const base = calculateApparelVariantPrice("traveler-cloak");
    const tailored = calculateApparelVariantPrice("traveler-cloak", {
      quality: "Masterwork",
      materialKey: "dragon-thread",
      enchantmentKey: "trailblazer",
      enchantmentGrade: "Greater",
    });
    expect(tailored).toBeGreaterThan(base!);
  });
});

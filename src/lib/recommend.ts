import {
  dishes,
  type Dish,
  type HealthTag,
  type Vendor,
  vendors,
} from "../data";
import type { Profile } from "../store";

const goalTag: Record<string, HealthTag[]> = {
  muscle: ["High Protein"],
  energy: ["Energy Boost"],
  iron: ["Rich Iron"],
  light: ["Balanced Fiber"],
  family: [],
};

const goalReason: Record<string, string> = {
  muscle: "High protein, for the days you train",
  energy: "Slow energy for a long day",
  iron: "Rich iron, from greens and meat",
  light: "Fiber-rich and gentle",
  family: "A pot that works for the whole table",
};

export type DishMatch = {
  dish: Dish;
  safe: boolean;
  score: number;
  reasons: string[];
  pantryMatches: number;
};

export function isSafeFor(dish: Dish, profile: Profile | null): boolean {
  if (!profile) return true;
  return !dish.allergens.some((allergen) => profile.allergens.includes(allergen));
}

export function scoreDish(dish: Dish, profile: Profile | null): DishMatch {
  if (!profile) {
    return { dish, safe: true, score: 60, reasons: [], pantryMatches: 0 };
  }

  const blocked = dish.allergens.filter((allergen) =>
    profile.allergens.includes(allergen),
  );
  if (blocked.length > 0) {
    return {
      dish,
      safe: false,
      score: -100,
      reasons: [`Contains ${blocked.join(" and ")}`],
      pantryMatches: 0,
    };
  }

  let score = 58;
  const reasons: string[] = [];

  for (const goal of profile.goals) {
    if (goal === "family") {
      if (dish.goals.includes("family")) {
        score += 8;
        reasons.push("Built for a family pot");
      }
      continue;
    }
    const tags = goalTag[goal] ?? [];
    if (tags.some((tag) => dish.health.includes(tag))) {
      score += 14;
      reasons.push(goalReason[goal]);
    }
  }

  const pantryMatches = dish.pantryKeys.filter((key) => profile.pantry.includes(key)).length;
  if (pantryMatches > 0) {
    score += Math.min(22, pantryMatches * 5);
    reasons.push(
      pantryMatches === 1
        ? "Uses 1 thing already in your pantry"
        : `Uses ${pantryMatches} things already in your pantry`,
    );
  }

  const disliked = dish.contains.filter((item) => profile.dislikes.includes(item));
  if (disliked.length > 0) {
    score -= 22 * disliked.length;
  }

  for (const caution of dish.cautions) {
    if (profile.conditions.includes(caution.condition)) {
      score -= 5;
    }
  }

  if (profile.children > 0 && dish.goals.includes("family")) {
    score += 4;
  }

  if (reasons.length === 0) {
    reasons.push("A good place to start");
  }

  return {
    dish,
    safe: true,
    score,
    reasons: reasons.slice(0, 3),
    pantryMatches,
  };
}

export function getMatches(profile: Profile | null): DishMatch[] {
  return dishes
    .map((dish) => scoreDish(dish, profile))
    .sort((a, b) => b.score - a.score);
}

export function getSafeDishes(profile: Profile | null): Dish[] {
  return dishes.filter((dish) => isSafeFor(dish, profile));
}

export function findDish(id: string | undefined): Dish | undefined {
  return dishes.find((dish) => dish.id === id);
}

export function findVendor(id: string): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === id);
}

export function getIngredientPrice(
  dish: Dish,
  ingredientId: string,
  choice: "raw" | "ready",
): number {
  const ingredient = dish.ingredients.find((item) => item.id === ingredientId);
  if (!ingredient) return 0;
  if (choice === "ready" && ingredient.ready) return ingredient.ready.price;
  return ingredient.rawPrice;
}

export function getDishCost(
  dish: Dish,
  servings: number,
  choices: Record<string, "raw" | "ready"> = {},
): number {
  const scale = servings / dish.baseServings;
  const total = dish.ingredients.reduce((sum, ingredient) => {
    const choice = ingredient.ready ? choices[ingredient.id] ?? "raw" : "raw";
    return sum + getIngredientPrice(dish, ingredient.id, choice) * scale;
  }, 0);
  return Math.round(total / 25) * 25;
}

export function getReadySavings(dish: Dish, servings: number): number {
  const raw = getDishCost(dish, servings);
  const ready = getDishCost(
    dish,
    servings,
    Object.fromEntries(
      dish.ingredients
        .filter((ingredient) => ingredient.ready)
        .map((ingredient) => [ingredient.id, "ready"]),
    ),
  );
  return Math.max(0, ready - raw);
}

export function getHealthCounts(profile: Profile | null): Record<HealthTag, number> {
  const counts = {
    "High Protein": 0,
    "Rich Iron": 0,
    "Energy Boost": 0,
    "Balanced Fiber": 0,
  } satisfies Record<HealthTag, number>;

  for (const dish of getSafeDishes(profile)) {
    for (const tag of dish.health) counts[tag] += 1;
  }
  return counts;
}

export function getTableSize(profile: Profile | null): number {
  if (!profile) return 4;
  return Math.max(1, profile.adults + profile.children);
}

export function describeTable(profile: Profile | null): string {
  if (!profile) return "Table of 4";
  const size = getTableSize(profile);
  return `Table of ${size}`;
}

export function locationLabel(profile: Profile | null): string {
  if (!profile) return "Bamenda";
  if (profile.locationMode === "elsewhere") {
    return profile.city.trim() || "Outside Bamenda";
  }
  return profile.neighborhood;
}

export function getHouseholdNote(profile: Profile | null): string {
  if (!profile) return "Set your table so every suggestion fits it.";
  const bits: string[] = [];
  if (profile.allergens.length > 0) bits.push(`no ${profile.allergens.join(", ")}`);
  if (profile.dislikes.length > 0) bits.push(`no ${profile.dislikes.slice(0, 2).join(", ")}`);
  if (profile.goals.includes("muscle")) bits.push("more protein");
  if (profile.conditions.includes("blood-pressure")) bits.push("lower-salt flags");
  if (bits.length === 0) bits.push("family portions");
  return bits.join(" · ");
}

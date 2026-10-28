export function pepperColor(value: number): string {
  const t = Math.max(0, Math.min(100, value)) / 100;
  const from = [43, 108, 181];
  const mid = [213, 143, 47];
  const to = [223, 47, 39];
  const [a, b, local] =
    t < 0.5 ? [from, mid, t * 2] : [mid, to, (t - 0.5) * 2];
  const rgb = a.map((channel, index) =>
    Math.round(channel + (b[index] - channel) * local),
  );
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function pepperLabel(value: number): "Mild" | "Medium" | "Hot" {
  if (value < 34) return "Mild";
  if (value < 68) return "Medium";
  return "Hot";
}

export function pepperDescription(value: number): string {
  const label = pepperLabel(value);
  if (label === "Mild") return "Gentle heat — good for children and cautious eaters.";
  if (label === "Medium") return "A proper Bamenda table heat, without overwhelming the pot.";
  return "Bright, assertive pepper. We will keep the heat visible in the recipe.";
}

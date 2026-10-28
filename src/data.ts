export type HealthTag =
  | "High Protein"
  | "Rich Iron"
  | "Energy Boost"
  | "Balanced Fiber";

export type Allergen =
  | "peanuts"
  | "tree nuts"
  | "shellfish"
  | "fish"
  | "dairy"
  | "eggs"
  | "gluten"
  | "soy";

export type Condition = "blood-pressure" | "blood-sugar";

export type Goal = "muscle" | "energy" | "iron" | "light" | "family";

export type Neighborhood =
  | "Bamenda Centre"
  | "Nkwen"
  | "Upstation"
  | "Ntarikon"
  | "Bambili"
  | "Bali"
  | "Santa"
  | "Mankon"
  | "Ndop";

export interface Vendor {
  id: string;
  name: string;
  shortName: string;
  neighborhood: Neighborhood;
  specialties: string[];
  story: string;
  image?: string;
  initials: string;
  color: string;
  rating: number;
  reviews: number;
  verified: string;
  correspondent: string;
  prepTime: string;
  pickup: string;
  priceNote: string;
}

export interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  note?: string;
  pantryKey?: string;
  rawPrice: number;
  ready?: {
    label: string;
    vendorId: string;
    price: number;
    note: string;
  };
}

export interface RecipeStep {
  title: string;
  body: string;
  tip: string;
  minutes: number;
}

export interface Dish {
  id: string;
  name: string;
  localName: string;
  origin: string;
  tagline: string;
  description: string;
  story: string;
  image: string;
  time: number;
  prepTime: number;
  difficulty: "Easy" | "Steady" | "Weekend";
  baseServings: number;
  health: HealthTag[];
  allergens: Allergen[];
  contains: string[];
  goals: Goal[];
  pantryKeys: string[];
  cautions: { condition: Condition; text: string }[];
  nutrition: {
    calories: number;
    protein: number;
    iron: number;
    fibre: number;
  };
  ingredients: Ingredient[];
  steps: RecipeStep[];
  cookNote: string;
  servingNote: string;
  accent: string;
}

export const neighborhoods: {
  name: Neighborhood;
  blurb: string;
  vendors: number;
  lastVerified: string;
}[] = [
  { name: "Bamenda Centre", blurb: "Commercial Avenue and the main market", vendors: 3, lastVerified: "12 Oct 2026" },
  { name: "Nkwen", blurb: "Mile 3 to Mile 8, market and food stalls", vendors: 3, lastVerified: "12 Oct 2026" },
  { name: "Upstation", blurb: "Food stalls and neighbourhood kitchens", vendors: 2, lastVerified: "10 Oct 2026" },
  { name: "Ntarikon", blurb: "Prepared foods and fresh produce", vendors: 2, lastVerified: "09 Oct 2026" },
  { name: "Bambili", blurb: "Campus kitchens and student portions", vendors: 2, lastVerified: "08 Oct 2026" },
  { name: "Bali", blurb: "Highland produce and smoked fish", vendors: 2, lastVerified: "06 Oct 2026" },
  { name: "Santa", blurb: "Farm-gate cocoyam, beans and plantain", vendors: 2, lastVerified: "05 Oct 2026" },
  { name: "Mankon", blurb: "Prepared leaves, meats and spices", vendors: 2, lastVerified: "11 Oct 2026" },
  { name: "Ndop", blurb: "Rice, groundnuts and dry goods", vendors: 2, lastVerified: "04 Oct 2026" },
];

export const vendors: Vendor[] = [
  {
    id: "mama-ngum",
    name: "Mama Ngum's Kitchen",
    shortName: "Mama Ngum",
    neighborhood: "Nkwen",
    specialties: ["Pounded cocoyam", "Yellow soup spice", "Cleaned eru"],
    story:
      "Mama Ngum has pounded cocoyam at Mile 4 for eleven years. She prepares to order each morning and packs in banana leaves.",
    image: "/images/vendor-greens.jpg",
    initials: "MN",
    color: "#7b4d31",
    rating: 4.9,
    reviews: 86,
    verified: "12 Oct 2026",
    correspondent: "Neba A.",
    prepTime: "Ready in 2–3 hours",
    pickup: "Mile 4, Nkwen",
    priceNote: "Cash or mobile money",
  },
  {
    id: "mama-kate",
    name: "Aunty Kate's Prep",
    shortName: "Aunty Kate",
    neighborhood: "Ntarikon",
    specialties: ["Groundnut paste", "Peeled koki beans", "Cut plantain"],
    story:
      "Aunty Kate runs a two-woman prep kitchen beside Ntarikon market. Everything is cleaned, portioned and labelled by household size.",
    initials: "AK",
    color: "#b9653b",
    rating: 4.8,
    reviews: 64,
    verified: "09 Oct 2026",
    correspondent: "Manka T.",
    prepTime: "Ready in 1–2 hours",
    pickup: "Ntarikon market, stall 14",
    priceNote: "Mobile money welcome",
  },
  {
    id: "nkwen-market",
    name: "Nkwen Market Women's Collective",
    shortName: "Nkwen collective",
    neighborhood: "Nkwen",
    specialties: ["Greens", "Country onion", "Fresh pepper"],
    story:
      "A rotating stall of nine women who sell what they harvest. The collective keeps a daily record of what is in season.",
    image: "/images/vendor-beans.jpg",
    initials: "NW",
    color: "#3f5c42",
    rating: 4.9,
    reviews: 121,
    verified: "12 Oct 2026",
    correspondent: "Neba A.",
    prepTime: "Same day",
    pickup: "Nkwen market, back row",
    priceNote: "Market price, no markup",
  },
  {
    id: "upstation-fresh",
    name: "Upstation Fresh",
    shortName: "Upstation Fresh",
    neighborhood: "Upstation",
    specialties: ["Chicken", "Fresh fish", "Vegetables"],
    story:
      "A small family counter selling chicken cut to order, fresh vegetables and fish brought up from the lowlands twice a week.",
    initials: "UF",
    color: "#326a65",
    rating: 4.7,
    reviews: 39,
    verified: "10 Oct 2026",
    correspondent: "Bih C.",
    prepTime: "Ready in 45 minutes",
    pickup: "Upstation, opposite the council",
    priceNote: "Cut to order",
  },
  {
    id: "bambili-kitchen",
    name: "Bambili Student Kitchen",
    shortName: "Bambili kitchen",
    neighborhood: "Bambili",
    specialties: ["Portioned fufu", "Beans", "Peeled plantain"],
    story:
      "Started by three final-year students, this kitchen sells single and family portions built for small rooms and small budgets.",
    initials: "BK",
    color: "#a4772e",
    rating: 4.8,
    reviews: 52,
    verified: "08 Oct 2026",
    correspondent: "Nfor E.",
    prepTime: "Ready in 1 hour",
    pickup: "Bambili, near campus gate",
    priceNote: "Student portions available",
  },
  {
    id: "santa-farm",
    name: "Santa Farm Gate",
    shortName: "Santa farm gate",
    neighborhood: "Santa",
    specialties: ["Cocoyam", "Beans", "Plantain"],
    story:
      "A farm-gate collection point for four families in Santa. Produce is harvested to order and sent down on the morning bus.",
    initials: "SF",
    color: "#66753d",
    rating: 4.9,
    reviews: 45,
    verified: "05 Oct 2026",
    correspondent: "Fon L.",
    prepTime: "Next-day delivery",
    pickup: "Santa motor park",
    priceNote: "Seasonal prices",
  },
  {
    id: "bali-highland",
    name: "Bali Highland Foods",
    shortName: "Bali highland",
    neighborhood: "Bali",
    specialties: ["Smoked fish", "Beef", "Cocoyam"],
    story:
      "Smokes fish over hardwood in Bali and brings it down three times a week. The smoke is slow, the fish is firm.",
    initials: "BH",
    color: "#6f4a3c",
    rating: 4.7,
    reviews: 33,
    verified: "06 Oct 2026",
    correspondent: "Tita M.",
    prepTime: "Ready in 3 hours",
    pickup: "Bali market, fish row",
    priceNote: "Smoked to order",
  },
  {
    id: "centre-spice",
    name: "Bamenda Centre Spice Stall",
    shortName: "Centre spice stall",
    neighborhood: "Bamenda Centre",
    specialties: ["Yellow soup spice", "Kanwa", "Pepper"],
    story:
      "The spice stall many cooks send their children to. Everything is ground fresh, and the yellow soup mix is measured for a pot of four.",
    initials: "CS",
    color: "#ad5b2e",
    rating: 4.9,
    reviews: 97,
    verified: "12 Oct 2026",
    correspondent: "Ngwa P.",
    prepTime: "Same day",
    pickup: "Commercial Avenue, spice line",
    priceNote: "Ground fresh",
  },
  {
    id: "mankon-prep",
    name: "Mankon Home Prep",
    shortName: "Mankon home prep",
    neighborhood: "Mankon",
    specialties: ["Cleaned ndole", "Cow skin", "Tripe"],
    story:
      "Aunty Juliana cleans ndole leaf by leaf, then washes it six times. She also sells cow skin and tripe cleaned and cut.",
    initials: "MH",
    color: "#5a4632",
    rating: 4.8,
    reviews: 58,
    verified: "11 Oct 2026",
    correspondent: "Ndzana R.",
    prepTime: "Ready in 3–4 hours",
    pickup: "Mankon, beside the palace road",
    priceNote: "Order a day ahead",
  },
  {
    id: "ndop-grains",
    name: "Ndop Rice & Grains",
    shortName: "Ndop grains",
    neighborhood: "Ndop",
    specialties: ["Rice", "Groundnuts", "Beans"],
    story:
      "Rice from the Ndop plain, dried and winnowed by hand. Groundnuts are sorted the same week they are sold.",
    initials: "NG",
    color: "#7d7136",
    rating: 4.8,
    reviews: 41,
    verified: "04 Oct 2026",
    correspondent: "Mbah J.",
    prepTime: "Same day",
    pickup: "Ndop market, grain shed",
    priceNote: "Sold by the bucket",
  },
];

export const dishes: Dish[] = [
  {
    id: "achu",
    name: "Achu & Yellow Soup",
    localName: "Achu",
    origin: "Bamenda highlands",
    tagline: "Pounded cocoyam, a bright yellow soup, and meat that falls apart.",
    description:
      "The Sunday pot that still shows up on Tuesdays. Smooth pounded cocoyam, a yellow soup built on palm oil and kanwa, and meat with greens on the side.",
    story:
      "Achu is a gathering dish: the pounding is work, the eating is slow. This version keeps the yellow soup honest and gives you a way to tell when the cocoyam is smooth enough.",
    image: "/images/dishes/achu.jpg",
    time: 75,
    prepTime: 30,
    difficulty: "Weekend",
    baseServings: 4,
    health: ["Energy Boost", "Balanced Fiber"],
    allergens: [],
    contains: ["cocoyam"],
    goals: ["energy", "family"],
    pantryKeys: ["cocoyam", "plantain", "palm oil", "onions"],
    cautions: [
      {
        condition: "blood-pressure",
        text: "The soup can carry a lot of salt and stock cube. Taste before adding more, and use less than the recipe says if you are watching salt.",
      },
    ],
    nutrition: { calories: 640, protein: 28, iron: 5.2, fibre: 9 },
    cookNote:
      "The soup should look like thin, glossy custard. If it is thick and pasty, add warm water a spoon at a time — never cold water, or the palm oil will separate.",
    servingNote:
      "Serve the cocoyam in one smooth mound per person with the soup in a bowl on the side, so everyone can dip at their own pace.",
    accent: "#d79f24",
    ingredients: [
      {
        id: "achu-cocoyam",
        name: "Cocoyam (taro)",
        qty: 1.5,
        unit: "kg",
        note: "Choose firm, dry roots; peel and cut into chunks",
        pantryKey: "cocoyam",
        rawPrice: 2500,
        ready: {
          label: "Pounded cocoyam, still warm",
          vendorId: "mama-ngum",
          price: 3500,
          note: "Pounded this morning; collect within 3 hours",
        },
      },
      {
        id: "achu-banana",
        name: "Achu banana",
        qty: 6,
        unit: "fingers",
        note: "Ripe but still firm",
        pantryKey: "plantain",
        rawPrice: 1000,
        ready: {
          label: "Peeled and cut achu banana",
          vendorId: "mama-ngum",
          price: 1400,
          note: "Peeled and kept in water",
        },
      },
      {
        id: "achu-palm",
        name: "Red palm oil",
        qty: 6,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 800,
        ready: {
          label: "Measured yellow-soup palm oil",
          vendorId: "centre-spice",
          price: 1000,
          note: "Measured for a pot of four",
        },
      },
      {
        id: "achu-kanwa",
        name: "Kanwa (limestone water)",
        qty: 1,
        unit: "tsp",
        note: "A little goes a long way",
        rawPrice: 200,
        ready: {
          label: "Prepared kanwa water",
          vendorId: "centre-spice",
          price: 300,
          note: "Diluted and ready to use",
        },
      },
      {
        id: "achu-beef",
        name: "Beef",
        qty: 500,
        unit: "g",
        note: "Cut into serving pieces",
        rawPrice: 3000,
        ready: {
          label: "Cleaned and cut beef",
          vendorId: "bali-highland",
          price: 3500,
          note: "Cut and washed",
        },
      },
      {
        id: "achu-fish",
        name: "Smoked fish",
        qty: 1,
        unit: "large",
        note: "Rinse and remove the hard head",
        rawPrice: 1500,
        ready: {
          label: "Cleaned smoked fish",
          vendorId: "bali-highland",
          price: 1900,
          note: "Rinsed and split",
        },
      },
      {
        id: "achu-greens",
        name: "Huckleberry or spinach",
        qty: 1,
        unit: "bunch",
        note: "Wash three times and shred",
        pantryKey: "greens",
        rawPrice: 500,
        ready: {
          label: "Washed and shredded greens",
          vendorId: "nkwen-market",
          price: 800,
          note: "Washed three times",
        },
      },
      {
        id: "achu-spice",
        name: "Yellow soup spice",
        qty: 2,
        unit: "tbsp",
        note: "Country onion, pepper, small spice",
        rawPrice: 500,
        ready: {
          label: "Fresh-ground yellow soup spice",
          vendorId: "centre-spice",
          price: 700,
          note: "Ground the same morning",
        },
      },
      {
        id: "achu-salt",
        name: "Salt",
        qty: 1,
        unit: "tsp",
        note: "To taste",
        pantryKey: "salt",
        rawPrice: 100,
      },
    ],
    steps: [
      {
        title: "Wash the cocoyam properly",
        body:
          "Peel the cocoyam and cut it into rough chunks. Wash in three changes of water until the water runs clear — this removes the sap that makes your hands itch. Wear gloves if your skin is sensitive.",
        tip:
          "If your hands itch after peeling, rub them with a little palm oil before washing with soap. Do not use hot water on the itch.",
        minutes: 15,
      },
      {
        title: "Boil until a knife goes through",
        body:
          "Put the cocoyam and achu banana in a pot, cover with water, and boil for 20–25 minutes. A knife should slide through the cocoyam with no resistance. Do not drain the water yet.",
        tip:
          "Undercooked cocoyam will never pound smooth. If the knife still catches, give it five more minutes.",
        minutes: 25,
      },
      {
        title: "Pound while it is hot",
        body:
          "Move the cocoyam to a mortar, or use a heavy pot and a wooden spoon. Pound in small batches, adding a little hot cooking water as you go, until it is smooth and stretchy. Keep the banana separate and serve it on the side.",
        tip:
          "Do not let the cocoyam cool before pounding. Cold cocoyam turns lumpy and no amount of pounding will fix it.",
        minutes: 15,
      },
      {
        title: "Start the yellow soup",
        body:
          "Warm the palm oil in a pot on low heat. Add the yellow soup spice and stir for one minute — do not let it burn. Add the kanwa water, then two cups of hot water, and stir until the soup looks like thin custard.",
        tip:
          "The soup should be bright yellow, not brown. If it turns brown, the spice or the palm oil has caught on the fire.",
        minutes: 8,
      },
      {
        title: "Cook the meat in the soup",
        body:
          "Add the beef and smoked fish to the soup. Cover and simmer for 20 minutes, then add the greens and cook for five more. Taste for salt and turn off the heat.",
        tip:
          "Add the greens last. If they cook too long, they lose their colour and turn the soup muddy.",
        minutes: 25,
      },
      {
        title: "Check the soup, then serve",
        body:
          "Lift a spoon of soup and let it run back into the pot. It should coat the spoon lightly and still be pourable. Serve the pounded cocoyam in mounds, the soup in bowls, and the banana on the side.",
        tip:
          "Keep a small pot of hot water nearby. If the soup tightens while people are eating, loosen it with a spoonful.",
        minutes: 5,
      },
    ],
  },
  {
    id: "ndole",
    name: "Ndolé & Plantain",
    localName: "Ndolé",
    origin: "Bamenda & Douala",
    tagline: "Bitter greens, groundnut, shrimp, and sweet ripe plantain.",
    description:
      "The dish that shows up for celebrations and quiet Sundays alike. Washed ndolé leaves simmered in groundnut, with beef and shrimp, and ripe plantain alongside.",
    story:
      "The washing is the whole dish. Ndolé that is not washed enough tastes bitter; washed too little and no amount of groundnut will save it. This recipe gives you the squeeze test.",
    image: "/images/dishes/ndole.jpg",
    time: 60,
    prepTime: 30,
    difficulty: "Steady",
    baseServings: 4,
    health: ["High Protein", "Rich Iron"],
    allergens: ["peanuts", "shellfish"],
    contains: ["crayfish", "plantain"],
    goals: ["muscle", "iron", "family"],
    pantryKeys: ["greens", "onions", "palm oil", "plantain"],
    cautions: [
      {
        condition: "blood-pressure",
        text: "Shrimp, stock cubes and salted beef all bring salt. Rinse the shrimp, use one stock cube at most, and taste before adding salt.",
      },
      {
        condition: "blood-sugar",
        text: "Ripe plantain raises blood sugar quickly. Keep to one small piece and fill the plate with ndolé and greens.",
      },
    ],
    nutrition: { calories: 590, protein: 34, iron: 6.4, fibre: 8 },
    cookNote:
      "Wash the ndolé until the water is only faintly green and a leaf tastes slightly bitter, not sharp. That is the point where the groundnut can hold it.",
    servingNote:
      "Serve with boiled or fried ripe plantain. For a lighter plate, add a small mound of rice instead of a second plantain.",
    accent: "#386044",
    ingredients: [
      {
        id: "ndole-leaves",
        name: "Ndolé leaves",
        qty: 1,
        unit: "kg",
        note: "Washed and squeezed at least four times",
        pantryKey: "greens",
        rawPrice: 1000,
        ready: {
          label: "Cleaned and washed ndolé",
          vendorId: "mankon-prep",
          price: 1800,
          note: "Washed six times; ready to cook",
        },
      },
      {
        id: "ndole-groundnut",
        name: "Groundnuts",
        qty: 250,
        unit: "g",
        note: "Roasted and ground into paste",
        pantryKey: "groundnut",
        rawPrice: 1000,
        ready: {
          label: "Fresh groundnut paste",
          vendorId: "mama-kate",
          price: 1600,
          note: "Ground smooth, no sugar",
        },
      },
      {
        id: "ndole-beef",
        name: "Beef",
        qty: 500,
        unit: "g",
        note: "Cut into serving pieces",
        rawPrice: 3000,
        ready: {
          label: "Cleaned and cut beef",
          vendorId: "bali-highland",
          price: 3500,
          note: "Cut and washed",
        },
      },
      {
        id: "ndole-shrimp",
        name: "Shrimp",
        qty: 150,
        unit: "g",
        note: "Rinse well if salted",
        rawPrice: 2000,
        ready: {
          label: "Cleaned shrimp",
          vendorId: "bali-highland",
          price: 2400,
          note: "Deveined and rinsed",
        },
      },
      {
        id: "ndole-palm",
        name: "Red palm oil",
        qty: 4,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 500,
      },
      {
        id: "ndole-plantain",
        name: "Ripe plantain",
        qty: 6,
        unit: "fingers",
        note: "Yellow with black spots",
        pantryKey: "plantain",
        rawPrice: 1000,
        ready: {
          label: "Peeled and cut ripe plantain",
          vendorId: "mama-kate",
          price: 1300,
          note: "Cut for boiling or frying",
        },
      },
      {
        id: "ndole-onion",
        name: "Onions",
        qty: 2,
        unit: "medium",
        pantryKey: "onions",
        rawPrice: 300,
      },
      {
        id: "ndole-spice",
        name: "Garlic, ginger & pepper",
        qty: 1,
        unit: "set",
        note: "Blended into a rough paste",
        rawPrice: 500,
      },
      {
        id: "ndole-stock",
        name: "Stock cube",
        qty: 1,
        unit: "cube",
        note: "Optional; use half if watching salt",
        pantryKey: "stock",
        rawPrice: 100,
      },
    ],
    steps: [
      {
        title: "Wash the bitterness out",
        body:
          "Put the shredded ndolé in a large bowl, cover with water, and squeeze handfuls of leaves against each other. Pour off the green water and repeat four to six times. Stop when a leaf tastes mildly bitter and the water is only faintly green.",
        tip:
          "If you are buying already-cleaned ndolé, still taste a leaf. Cleaning is not the same as washing, and every batch is different.",
        minutes: 20,
      },
      {
        title: "Cook the meat",
        body:
          "Season the beef with half the onion, garlic, ginger and pepper. Add one cup of water and simmer for 25 minutes, until the beef is tender. Keep the stock — it goes into the pot later.",
        tip:
          "Do not add salt at this stage. The stock reduces, and what tastes right now will taste too salty at the end.",
        minutes: 25,
      },
      {
        title: "Make the groundnut base",
        body:
          "Mix the groundnut paste with two cups of warm water until there are no lumps. Add it to a pot with the palm oil and the rest of the onion. Cook on low heat for 10 minutes, stirring often, until the paste thickens and the oil rises.",
        tip:
          "Stir with a wooden spoon and keep the heat low. Groundnut catches quickly at the bottom and one burnt patch will flavour the whole pot.",
        minutes: 10,
      },
      {
        title: "Add the ndolé",
        body:
          "Add the washed ndolé to the groundnut base with one cup of the beef stock. Stir, cover, and simmer for 15 minutes. The leaves should collapse and the sauce should turn a deep green-brown.",
        tip:
          "If the pot looks dry before the leaves collapse, add stock a quarter cup at a time. You want a thick stew, not soup.",
        minutes: 15,
      },
      {
        title: "Finish with beef and shrimp",
        body:
          "Add the beef and shrimp. Simmer for eight minutes, then taste. Add half a stock cube if needed, and only a pinch of salt at the end. Turn off the heat and let it rest for five minutes.",
        tip:
          "Shrimp turns rubbery when it boils. Eight minutes in a simmer is enough; they should curl into a loose C, not a tight O.",
        minutes: 8,
      },
      {
        title: "Boil or fry the plantain",
        body:
          "Peel the plantain and cut it into thick rounds. Boil in salted water for 10 minutes, or shallow-fry until golden. Serve hot beside the ndolé.",
        tip:
          "For boiling, use plantain that is yellow with a few black spots. Green plantain is for frying, not for this plate.",
        minutes: 10,
      },
    ],
  },
  {
    id: "eru",
    name: "Eru & Water Fufu",
    localName: "Eru",
    origin: "Nkwen & Mankon",
    tagline: "Dark greens, smoked fish, and soft water fufu.",
    description:
      "Eru is slow comfort: finely cut greens cooked down with palm oil, crayfish and smoked fish, eaten with soft, slightly sour water fufu.",
    story:
      "In many Bamenda homes, eru is the meal that says someone came to visit. The greens shrink to almost nothing, so buy more than you think you need.",
    image: "/images/dishes/eru.jpg",
    time: 55,
    prepTime: 25,
    difficulty: "Steady",
    baseServings: 4,
    health: ["Balanced Fiber", "Rich Iron"],
    allergens: ["fish", "shellfish"],
    contains: ["crayfish", "smoked fish"],
    goals: ["light", "iron", "family"],
    pantryKeys: ["greens", "palm oil", "onions"],
    cautions: [
      {
        condition: "blood-pressure",
        text: "Smoked fish and crayfish are already salty. Rinse them, skip the stock cube, and add salt only after tasting.",
      },
    ],
    nutrition: { calories: 470, protein: 25, iron: 7.1, fibre: 11 },
    cookNote:
      "Eru should be soft but not a paste. When you press a spoon into it, the greens should spring back slowly. If it looks watery, let it cook uncovered for the last five minutes.",
    servingNote:
      "Serve the water fufu in one smooth ball per person, with the eru in a separate bowl. Eat with your right hand, or a spoon if that is easier.",
    accent: "#485d35",
    ingredients: [
      {
        id: "eru-leaves",
        name: "Eru leaves",
        qty: 500,
        unit: "g",
        note: "Finely cut; wash in two changes of water",
        pantryKey: "greens",
        rawPrice: 1000,
        ready: {
          label: "Cleaned and cut eru",
          vendorId: "mama-ngum",
          price: 1800,
          note: "Washed and cut fine",
        },
      },
      {
        id: "eru-fufu",
        name: "Water fufu (cassava)",
        qty: 1,
        unit: "kg",
        note: "Soaked cassava, drained",
        pantryKey: "fufu",
        rawPrice: 1200,
        ready: {
          label: "Prepared water fufu",
          vendorId: "mama-ngum",
          price: 1800,
          note: "Drained and portioned",
        },
      },
      {
        id: "eru-fish",
        name: "Smoked fish",
        qty: 2,
        unit: "medium",
        note: "Rinse and remove bones",
        rawPrice: 2500,
        ready: {
          label: "Cleaned smoked fish",
          vendorId: "bali-highland",
          price: 3000,
          note: "Bones removed",
        },
      },
      {
        id: "eru-crayfish",
        name: "Crayfish",
        qty: 3,
        unit: "tbsp",
        note: "Ground",
        rawPrice: 800,
      },
      {
        id: "eru-beef",
        name: "Beef",
        qty: 400,
        unit: "g",
        note: "Cut small",
        rawPrice: 2500,
      },
      {
        id: "eru-palm",
        name: "Red palm oil",
        qty: 4,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 500,
      },
      {
        id: "eru-onion",
        name: "Onion",
        qty: 1,
        unit: "large",
        pantryKey: "onions",
        rawPrice: 200,
      },
      {
        id: "eru-pepper",
        name: "Hot pepper",
        qty: 2,
        unit: "small",
        note: "Crushed; use one for a milder pot",
        rawPrice: 200,
      },
    ],
    steps: [
      {
        title: "Prepare the water fufu",
        body:
          "Put the water fufu in a bowl, cover with water, and break up any lumps with your fingers. Drain through a sieve and press out excess water. Set aside.",
        tip:
          "Water fufu should smell faintly sour, not sharp. If it smells strong, rinse it twice more before cooking.",
        minutes: 10,
      },
      {
        title: "Cook the beef",
        body:
          "Put the beef in a pot with the onion, half the pepper and a cup of water. Simmer for 20 minutes, until tender. Keep the stock.",
        tip:
          "Cut the beef small for eru. Large pieces sit at the bottom while the greens cook down around them.",
        minutes: 20,
      },
      {
        title: "Build the base",
        body:
          "Warm the palm oil in a wide pot. Add the onion and the rest of the pepper and stir for two minutes. Add the crayfish and stir for another minute, until it smells nutty.",
        tip:
          "Do not let the crayfish brown. Once it darkens, it turns bitter and the whole pot tastes like ash.",
        minutes: 4,
      },
      {
        title: "Wilt the eru",
        body:
          "Add the eru in three handfuls, stirring after each one. It will look like too much at first — keep going. Add half a cup of beef stock, cover, and cook for 10 minutes on low heat.",
        tip:
          "If the pot looks dry, add stock, not water. Water washes out the taste you just built.",
        minutes: 10,
      },
      {
        title: "Add fish and beef",
        body:
          "Flake the smoked fish into the pot, add the beef, and stir gently. Simmer uncovered for 10 minutes. Taste and add salt only if it needs it.",
        tip:
          "Stir from the bottom with a flat spoon. Eru likes to settle and catch.",
        minutes: 10,
      },
      {
        title: "Turn the fufu",
        body:
          "Bring a small pot of water to a boil. Add the drained water fufu and stir continuously with a wooden spoon. It will thicken and pull away from the sides. Turn for 8–10 minutes, then shape into balls with a wet spoon.",
        tip:
          "The fufu is ready when a spoon stands upright in it for a moment. If it tastes gritty, it needs more turning, not more water.",
        minutes: 10,
      },
    ],
  },
  {
    id: "kati-kati",
    name: "Kati-Kati",
    localName: "Kati-kati",
    origin: "Nso & Bamenda",
    tagline: "Cow skin, greens, and a slow, peppery sauce.",
    description:
      "A Nso classic built on cow skin and tripe, cooked down with palm oil, country onion and greens, then eaten with fufu. Deep, peppery and generous.",
    story:
      "Kati-kati is not a quick pot. The cow skin needs washing, the tripe needs time, and the sauce needs to reduce until it coats the meat. The result is worth the afternoon.",
    image: "/images/dishes/kati.jpg",
    time: 90,
    prepTime: 35,
    difficulty: "Weekend",
    baseServings: 4,
    health: ["High Protein", "Energy Boost"],
    allergens: ["fish"],
    contains: ["cow skin", "smoked fish"],
    goals: ["energy", "muscle", "family"],
    pantryKeys: ["palm oil", "onions", "fufu"],
    cautions: [
      {
        condition: "blood-pressure",
        text: "Cow skin and smoked fish are salty, and the sauce reduces. Skip the stock cube and taste before adding salt.",
      },
      {
        condition: "blood-sugar",
        text: "Serve a modest portion of fufu with plenty of the greens and meat. Fufu is dense and raises blood sugar quickly.",
      },
    ],
    nutrition: { calories: 610, protein: 38, iron: 5.8, fibre: 7 },
    cookNote:
      "The sauce should be dark, glossy and thick enough to sit on the meat, not run off. If it is still watery after the meat is tender, remove the lid and reduce for ten minutes.",
    servingNote:
      "Serve with a small ball of fufu or garri. A side of boiled greens cuts through the richness.",
    accent: "#75452e",
    ingredients: [
      {
        id: "kati-cowskin",
        name: "Cow skin",
        qty: 500,
        unit: "g",
        note: "Cleaned and cut into strips",
        rawPrice: 2000,
        ready: {
          label: "Cleaned and cut cow skin",
          vendorId: "mankon-prep",
          price: 2800,
          note: "Scraped and cut; ready to cook",
        },
      },
      {
        id: "kati-tripe",
        name: "Tripe",
        qty: 400,
        unit: "g",
        note: "Washed with salt and lemon",
        rawPrice: 2000,
        ready: {
          label: "Cleaned tripe",
          vendorId: "mankon-prep",
          price: 2600,
          note: "Washed and cut",
        },
      },
      {
        id: "kati-fish",
        name: "Smoked fish",
        qty: 1,
        unit: "large",
        note: "Rinse and break into pieces",
        rawPrice: 1500,
      },
      {
        id: "kati-greens",
        name: "Green leaves",
        qty: 1,
        unit: "bunch",
        note: "Huckleberry, spinach or bitterleaf",
        pantryKey: "greens",
        rawPrice: 500,
      },
      {
        id: "kati-palm",
        name: "Red palm oil",
        qty: 5,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 600,
      },
      {
        id: "kati-spice",
        name: "Country onion & pepper",
        qty: 2,
        unit: "tbsp",
        note: "Ground together",
        rawPrice: 500,
      },
      {
        id: "kati-onion",
        name: "Onions",
        qty: 2,
        unit: "medium",
        pantryKey: "onions",
        rawPrice: 300,
      },
      {
        id: "kati-fufu",
        name: "Fufu (corn or cassava)",
        qty: 1,
        unit: "kg",
        note: "To serve",
        pantryKey: "fufu",
        rawPrice: 1200,
        ready: {
          label: "Prepared fufu",
          vendorId: "bambili-kitchen",
          price: 1500,
          note: "Portioned for four",
        },
      },
    ],
    steps: [
      {
        title: "Wash the cow skin again",
        body:
          "Even cleaned cow skin needs a second wash. Scrub both sides with salt and warm water, then rinse until the water runs clear. Cut into strips the width of your finger.",
        tip:
          "If the skin smells strong, rub it with lemon or vinegar, then rinse. Do not skip this — the smell goes straight into the sauce.",
        minutes: 15,
      },
      {
        title: "Boil the skin and tripe",
        body:
          "Put the cow skin and tripe in a pot with half the onion, a pinch of salt and enough water to cover. Boil for 35–40 minutes, until the tripe is tender. Keep the cooking water.",
        tip:
          "Test the tripe with a knife, not your teeth. If the knife drags, it needs another ten minutes.",
        minutes: 40,
      },
      {
        title: "Fry the base",
        body:
          "Heat the palm oil in a heavy pot. Add the rest of the onion and fry for three minutes. Add the country onion and pepper and stir for one minute, until fragrant.",
        tip:
          "Country onion burns quickly in hot oil. Keep the heat medium and keep moving the spoon.",
        minutes: 5,
      },
      {
        title: "Add the meats",
        body:
          "Add the cow skin and tripe with one cup of their cooking water. Stir, cover, and simmer for 15 minutes so the meat takes on the spice.",
        tip:
          "Do not throw away the cooking water. It has body and flavour, and it is the best thing to loosen the pot with.",
        minutes: 15,
      },
      {
        title: "Add fish and greens",
        body:
          "Add the smoked fish and greens. Cook uncovered for 12 minutes, stirring occasionally, until the sauce thickens and coats the meat. Taste for salt.",
        tip:
          "Uncovered is the secret to a thick sauce. If you cover it, the water stays in and the sauce never coats.",
        minutes: 12,
      },
      {
        title: "Rest, then serve",
        body:
          "Turn off the heat and let the pot rest for five minutes. Shape the fufu into balls and serve while hot, with the kati-kati spooned over.",
        tip:
          "Kati-kati tastes even better the next day. Cool it quickly and keep it in the fridge for up to two days.",
        minutes: 5,
      },
    ],
  },
  {
    id: "koki",
    name: "Koki & Ripe Plantain",
    localName: "Koki",
    origin: "Bamenda & Mankon",
    tagline: "Steamed bean pudding, palm oil, and sweet plantain.",
    description:
      "Ground black-eyed peas steamed in banana leaves with palm oil and pepper. Soft, savoury and filling, with ripe plantain to balance it.",
    story:
      "Koki is proof that beans can be a celebration. The pudding should be soft and custardy, not dry — the banana leaf keeps the steam in and the flavour close.",
    image: "/images/dishes/koki.jpg",
    time: 65,
    prepTime: 30,
    difficulty: "Steady",
    baseServings: 4,
    health: ["Balanced Fiber", "High Protein"],
    allergens: [],
    contains: ["beans"],
    goals: ["light", "family", "muscle"],
    pantryKeys: ["beans", "plantain", "palm oil"],
    cautions: [
      {
        condition: "blood-sugar",
        text: "Ripe plantain is sweet and starchy. Keep the plantain portion small and eat the koki with plenty of vegetables.",
      },
    ],
    nutrition: { calories: 520, protein: 24, iron: 5.1, fibre: 12 },
    cookNote:
      "Koki should wobble when you shake the leaf, like a soft custard. If it feels firm and dry, it steamed too long or there was not enough water in the pot.",
    servingNote:
      "Serve warm in the leaf, with ripe plantain on the side. A spoonful of fresh pepper sauce is the usual finish.",
    accent: "#d89a27",
    ingredients: [
      {
        id: "koki-beans",
        name: "Black-eyed peas",
        qty: 500,
        unit: "g",
        note: "Soaked overnight, skins removed",
        pantryKey: "beans",
        rawPrice: 1000,
        ready: {
          label: "Peeled and ground koki beans",
          vendorId: "mama-kate",
          price: 1800,
          note: "Soaked, peeled and ground",
        },
      },
      {
        id: "koki-palm",
        name: "Red palm oil",
        qty: 5,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 600,
      },
      {
        id: "koki-pepper",
        name: "Scotch bonnet pepper",
        qty: 2,
        unit: "small",
        note: "Blended, seeds removed for less heat",
        rawPrice: 200,
      },
      {
        id: "koki-onion",
        name: "Onion",
        qty: 1,
        unit: "large",
        pantryKey: "onions",
        rawPrice: 200,
      },
      {
        id: "koki-leaves",
        name: "Banana leaves",
        qty: 8,
        unit: "squares",
        note: "Wilted over a flame",
        rawPrice: 300,
      },
      {
        id: "koki-plantain",
        name: "Ripe plantain",
        qty: 6,
        unit: "fingers",
        note: "Yellow with black spots",
        pantryKey: "plantain",
        rawPrice: 900,
      },
    ],
    steps: [
      {
        title: "Soak and peel the beans",
        body:
          "Soak the black-eyed peas overnight in plenty of water. Rub them between your palms to remove the skins, then float the skins off with water. Keep going until most of the beans are pale and bare.",
        tip:
          "Do not rush this with hot water. The skins will not come off evenly, and the koki will be grainy.",
        minutes: 20,
      },
      {
        title: "Grind to a smooth paste",
        body:
          "Blend the peeled beans with the onion, pepper and a little water until smooth. It should be thick enough to hold a spoon, not runny.",
        tip:
          "Add water one tablespoon at a time. Too much water and the koki will not set.",
        minutes: 8,
      },
      {
        title: "Beat in the palm oil",
        body:
          "Pour the paste into a bowl and add the palm oil. Beat with a wooden spoon for three minutes, until the colour is even and the mixture looks a little lighter.",
        tip:
          "Beating traps air and gives koki its soft texture. Do not skip it.",
        minutes: 4,
      },
      {
        title: "Wrap in banana leaves",
        body:
          "Wilt the banana squares over a low flame for a few seconds. Spoon the mixture onto each square, fold into a parcel, and tie with string. Leave a little room for the pudding to expand.",
        tip:
          "Double-wrap the parcels. A single leaf tears, and the water gets in.",
        minutes: 10,
      },
      {
        title: "Steam until set",
        body:
          "Put the parcels in a pot with a rack and an inch of water. Cover and steam for 40 minutes, adding hot water if the pot runs dry. Carefully open one parcel to check — it should be set but still soft.",
        tip:
          "Do not let the water touch the parcels. They should steam, not boil.",
        minutes: 40,
      },
      {
        title: "Boil the plantain",
        body:
          "Peel the plantain and cut into thick rounds. Boil in lightly salted water for 10 minutes, until tender. Serve with the koki, still in the leaf.",
        tip:
          "Do not stir the plantain while it boils. Let it sit, or it will break apart.",
        minutes: 10,
      },
    ],
  },
  {
    id: "beans-dodo",
    name: "Beans & Dodo",
    localName: "Beans and dodo",
    origin: "Bamenda everyday",
    tagline: "Slow-cooked beans, sweet fried plantain, and a soft egg if you like.",
    description:
      "The plate that gets a family through a busy week. Beans cooked until creamy, fried ripe plantain, and a simple onion-tomato base that makes it taste like more than the sum of its parts.",
    story:
      "This is the meal students learn first and never stop making. It is cheap, forgiving, and better the next day. The only rule: cook the beans long enough to be soft, not just cooked.",
    image: "/images/dishes/beans.jpg",
    time: 55,
    prepTime: 10,
    difficulty: "Easy",
    baseServings: 4,
    health: ["Balanced Fiber", "High Protein"],
    allergens: [],
    contains: ["beans", "plantain"],
    goals: ["light", "energy", "family", "muscle"],
    pantryKeys: ["beans", "plantain", "onions", "palm oil"],
    cautions: [
      {
        condition: "blood-sugar",
        text: "Ripe plantain and beans both raise blood sugar. Keep the plantain portion to one small piece and fill half the plate with vegetables.",
      },
    ],
    nutrition: { calories: 460, protein: 21, iron: 5.6, fibre: 14 },
    cookNote:
      "The beans are ready when you can mash one against the side of the pot with a spoon. If the skins are still separate and the inside is chalky, keep cooking.",
    servingNote:
      "Serve with fried or boiled plantain, and a spoonful of pepper sauce. A boiled egg on top adds protein for about 100 FCFA.",
    accent: "#c27a2b",
    ingredients: [
      {
        id: "beans-beans",
        name: "Red beans",
        qty: 500,
        unit: "g",
        note: "Sorted and washed",
        pantryKey: "beans",
        rawPrice: 1000,
        ready: {
          label: "Sorted and washed beans",
          vendorId: "ndop-grains",
          price: 1300,
          note: "Stones removed",
        },
      },
      {
        id: "beans-plantain",
        name: "Ripe plantain",
        qty: 6,
        unit: "fingers",
        note: "Yellow with black spots",
        pantryKey: "plantain",
        rawPrice: 900,
        ready: {
          label: "Peeled and cut plantain",
          vendorId: "bambili-kitchen",
          price: 1200,
          note: "Cut for frying",
        },
      },
      {
        id: "beans-palm",
        name: "Red palm oil",
        qty: 3,
        unit: "tbsp",
        pantryKey: "palm oil",
        rawPrice: 400,
      },
      {
        id: "beans-onion",
        name: "Onion",
        qty: 1,
        unit: "large",
        pantryKey: "onions",
        rawPrice: 200,
      },
      {
        id: "beans-tomato",
        name: "Tomatoes",
        qty: 3,
        unit: "medium",
        pantryKey: "tomatoes",
        rawPrice: 400,
      },
      {
        id: "beans-pepper",
        name: "Hot pepper",
        qty: 1,
        unit: "small",
        note: "Optional",
        rawPrice: 100,
      },
      {
        id: "beans-salt",
        name: "Salt",
        qty: 1,
        unit: "tsp",
        note: "To taste",
        pantryKey: "salt",
        rawPrice: 100,
      },
    ],
    steps: [
      {
        title: "Sort and wash the beans",
        body:
          "Spread the beans on a plate and pick out stones, broken beans and anything that does not belong. Wash in two changes of water.",
        tip:
          "Do this even if the beans look clean. One stone can crack a tooth and end the meal.",
        minutes: 5,
      },
      {
        title: "Boil until soft",
        body:
          "Put the beans in a pot with plenty of water — about three fingers above the beans. Bring to a boil, then lower the heat and simmer for 35–45 minutes, until the beans mash easily. Top up with hot water as needed.",
        tip:
          "Do not add salt at the start. Salt early and the beans stay tough.",
        minutes: 40,
      },
      {
        title: "Fry the base",
        body:
          "While the beans cook, heat the palm oil in a pan. Fry the onion for three minutes, add the tomatoes and pepper, and cook for eight minutes until the mixture is thick and dark.",
        tip:
          "Cook the tomatoes down properly. If they are still watery, the beans will taste thin.",
        minutes: 12,
      },
      {
        title: "Bring it together",
        body:
          "Add the fried base to the beans with a cup of the bean water. Stir, add salt, and simmer uncovered for 10 minutes. The liquid should thicken and coat the beans.",
        tip:
          "If the beans are soft but the pot is watery, mash a ladleful against the side and stir it back in.",
        minutes: 10,
      },
      {
        title: "Fry the dodo",
        body:
          "Peel the plantain and cut into diagonal slices. Heat a thin layer of oil in a pan and fry for two minutes on each side, until golden. Drain on a paper towel.",
        tip:
          "Do not crowd the pan. Overcrowded plantain steams and turns soft instead of golden.",
        minutes: 8,
      },
      {
        title: "Serve hot",
        body:
          "Spoon the beans into bowls and lay the dodo alongside. Add pepper sauce or a boiled egg if you have it.",
        tip:
          "The beans thicken as they cool. Loosen leftovers with a splash of water when reheating.",
        minutes: 2,
      },
    ],
  },
  {
    id: "poulet-dg",
    name: "Poulet DG",
    localName: "Poulet DG",
    origin: "Bamenda celebration table",
    tagline: "Chicken and sweet plantain, cooked together with peppers and carrots.",
    description:
      "The celebratory one-pot: browned chicken, ripe plantain, carrots and green beans in a rich tomato base. A treat-day meal that still gets vegetables onto the plate.",
    story:
      "Poulet DG is what people order when they want the table to feel special. At home, the trick is to brown the chicken properly before the sauce goes in — that colour is most of the flavour.",
    image: "/images/dishes/poulet-dg.jpg",
    time: 65,
    prepTime: 20,
    difficulty: "Steady",
    baseServings: 4,
    health: ["High Protein", "Energy Boost"],
    allergens: [],
    contains: ["plantain"],
    goals: ["muscle", "energy", "family"],
    pantryKeys: ["plantain", "onions", "tomatoes", "oil"],
    cautions: [
      {
        condition: "blood-pressure",
        text: "Use one stock cube and taste before adding salt. The sauce reduces, so it gets saltier as it cooks.",
      },
      {
        condition: "blood-sugar",
        text: "Ripe plantain is high in sugar and starch. Keep your portion small and load the plate with the vegetables and chicken.",
      },
    ],
    nutrition: { calories: 650, protein: 39, iron: 4.3, fibre: 6 },
    cookNote:
      "The plantain should hold its shape and stay sweet. Add it near the end and fold, do not stir, or it will break into the sauce.",
    servingNote:
      "Serve straight from the pot with a green salad or steamed vegetables. It is rich, so a little goes a long way.",
    accent: "#b04e31",
    ingredients: [
      {
        id: "dg-chicken",
        name: "Chicken",
        qty: 1.2,
        unit: "kg",
        note: "Cut into pieces, skin on",
        rawPrice: 4500,
        ready: {
          label: "Cut and seasoned chicken",
          vendorId: "upstation-fresh",
          price: 5200,
          note: "Cut, washed and seasoned",
        },
      },
      {
        id: "dg-plantain",
        name: "Ripe plantain",
        qty: 6,
        unit: "fingers",
        note: "Yellow with black spots",
        pantryKey: "plantain",
        rawPrice: 1200,
        ready: {
          label: "Peeled and cubed plantain",
          vendorId: "mama-kate",
          price: 1500,
          note: "Cut for Poulet DG",
        },
      },
      {
        id: "dg-carrot",
        name: "Carrots",
        qty: 3,
        unit: "medium",
        note: "Cut into sticks",
        pantryKey: "carrots",
        rawPrice: 600,
      },
      {
        id: "dg-beans",
        name: "Green beans",
        qty: 200,
        unit: "g",
        note: "Topped and tailed",
        rawPrice: 700,
      },
      {
        id: "dg-tomato",
        name: "Tomatoes",
        qty: 4,
        unit: "medium",
        note: "Blended",
        pantryKey: "tomatoes",
        rawPrice: 500,
      },
      {
        id: "dg-onion",
        name: "Onions",
        qty: 2,
        unit: "medium",
        pantryKey: "onions",
        rawPrice: 300,
      },
      {
        id: "dg-spice",
        name: "Garlic, ginger & pepper",
        qty: 1,
        unit: "set",
        note: "Blended",
        rawPrice: 500,
      },
      {
        id: "dg-oil",
        name: "Vegetable oil",
        qty: 6,
        unit: "tbsp",
        pantryKey: "oil",
        rawPrice: 600,
      },
      {
        id: "dg-stock",
        name: "Chicken stock cube",
        qty: 1,
        unit: "cube",
        pantryKey: "stock",
        rawPrice: 100,
      },
    ],
    steps: [
      {
        title: "Season and brown the chicken",
        body:
          "Season the chicken with half the garlic, ginger and pepper. Heat half the oil in a wide pot and brown the chicken in batches, skin-side down first, for four minutes each side. Remove and set aside.",
        tip:
          "Do not crowd the pot. Chicken that is crowded steams and goes pale instead of brown.",
        minutes: 15,
      },
      {
        title: "Build the sauce",
        body:
          "In the same pot, add the rest of the oil and the onions. Fry for three minutes, then add the blended tomatoes and the rest of the garlic, ginger and pepper. Cook for 12 minutes, until the sauce is thick and the oil begins to separate.",
        tip:
          "The sauce is ready when a spoon dragged across the pot leaves a clean line that holds for a second.",
        minutes: 15,
      },
      {
        title: "Return the chicken",
        body:
          "Add the chicken and stock cube with one cup of water. Cover and simmer for 20 minutes, turning the pieces once, until the chicken is cooked through.",
        tip:
          "If the sauce reduces too much, add hot water — not cold, which will toughen the chicken.",
        minutes: 20,
      },
      {
        title: "Cook the vegetables",
        body:
          "Add the carrots and green beans. Cook for seven minutes, until they are tender but still have a bite. Taste the sauce for salt.",
        tip:
          "Cut the carrots and beans to the same thickness so they cook at the same speed.",
        minutes: 7,
      },
      {
        title: "Fry the plantain",
        body:
          "Peel the plantain and cut into thick cubes. Fry in a separate pan until golden on the outside and soft inside, about six minutes. Drain.",
        tip:
          "Fry the plantain separately. If it goes into the sauce raw, it breaks apart and makes the dish sweet and cloudy.",
        minutes: 8,
      },
      {
        title: "Fold and serve",
        body:
          "Add the fried plantain to the pot and fold gently with a flat spoon. Cook for two minutes, then turn off the heat. Serve hot.",
        tip:
          "Fold, do not stir. The plantain is soft and will break if you treat it like a stew.",
        minutes: 3,
      },
    ],
  },
];

export const pantryOptions = [
  { key: "cocoyam", label: "Cocoyam" },
  { key: "plantain", label: "Plantain" },
  { key: "beans", label: "Beans" },
  { key: "rice", label: "Rice" },
  { key: "fufu", label: "Fufu / garri" },
  { key: "greens", label: "Greens" },
  { key: "groundnut", label: "Groundnut" },
  { key: "palm oil", label: "Palm oil" },
  { key: "oil", label: "Vegetable oil" },
  { key: "onions", label: "Onions" },
  { key: "tomatoes", label: "Tomatoes" },
  { key: "carrots", label: "Carrots" },
  { key: "salt", label: "Salt" },
  { key: "stock", label: "Stock cubes" },
];

export const goalOptions: { key: Goal; label: string; hint: string }[] = [
  { key: "muscle", label: "Build muscle", hint: "High-protein meals to the top" },
  { key: "energy", label: "Lasting energy", hint: "For long days on your feet" },
  { key: "iron", label: "More iron", hint: "Dark greens, meat and fish" },
  { key: "light", label: "Eat lighter", hint: "Fiber-rich, gentler plates" },
  { key: "family", label: "Feed the family", hint: "Crowd-pleasing, mild pots" },
];

export const allergenOptions: { key: Allergen; label: string }[] = [
  { key: "peanuts", label: "Peanuts" },
  { key: "tree nuts", label: "Tree nuts" },
  { key: "shellfish", label: "Shellfish" },
  { key: "fish", label: "Fish" },
  { key: "dairy", label: "Dairy" },
  { key: "eggs", label: "Eggs" },
  { key: "gluten", label: "Gluten" },
  { key: "soy", label: "Soy" },
];

export const dislikeOptions = [
  { key: "okra", label: "Okra" },
  { key: "bitterleaf", label: "Bitterleaf" },
  { key: "crayfish", label: "Crayfish" },
  { key: "smoked fish", label: "Smoked fish" },
  { key: "plantain", label: "Plantain" },
  { key: "cow skin", label: "Cow skin" },
  { key: "beans", label: "Beans" },
  { key: "cocoyam", label: "Cocoyam" },
];

export const healthMeta: Record<
  HealthTag,
  { short: string; description: string; color: string; background: string }
> = {
  "High Protein": {
    short: "Protein",
    description: "Helps rebuild muscle and keeps you full",
    color: "#2d4a31",
    background: "#dce7d5",
  },
  "Rich Iron": {
    short: "Iron",
    description: "Supports energy and healthy blood",
    color: "#7d2f23",
    background: "#f3d8cd",
  },
  "Energy Boost": {
    short: "Energy",
    description: "Slow carbohydrates for a long day",
    color: "#7a5412",
    background: "#f5e5bd",
  },
  "Balanced Fiber": {
    short: "Fiber",
    description: "Gentle on the gut and good for the heart",
    color: "#3b5540",
    background: "#e3ead9",
  },
};

export const conditionLabels: Record<Condition, string> = {
  "blood-pressure": "Blood pressure",
  "blood-sugar": "Blood sugar",
};

export const conditionOptions: { key: Condition; label: string; hint: string }[] = [
  { key: "blood-pressure", label: "Watching blood pressure", hint: "We flag salty pots and suggest swaps" },
  { key: "blood-sugar", label: "Watching blood sugar", hint: "We flag sweet and starchy portions" },
];

export const formatFCFA = (value: number) =>
  `${Math.round(value).toLocaleString("fr-FR").replace(/\u202f/g, " ")} FCFA`;

export const formatQty = (value: number, unit: string) => {
  if (value === 0) return "to taste";
  const rounded = Math.round(value * 100) / 100;
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
  return `${text} ${unit}`;
};

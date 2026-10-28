import { dishes, vendors } from "../data";

export type VerificationStatus = "pending" | "approved" | "changes";

export interface VerificationItem {
  id: string;
  vendorId: string;
  place: string;
  correspondent: string;
  submitted: string;
  seen: string;
  priceNote: string;
  status: VerificationStatus;
  note: string;
}

export const verificationSeed: VerificationItem[] = [
  {
    id: "VF-024",
    vendorId: "mama-ngum",
    place: "Nkwen",
    correspondent: "Neba A.",
    submitted: "12 Oct 2026 · 08:40",
    seen: "Pounded cocoyam, cleaned eru, yellow soup spice",
    priceNote: "Cocoyam up 200 FCFA a heap",
    status: "pending",
    note: "Cocoyam quality good; eru cleaned in the morning. New price board at the stall.",
  },
  {
    id: "VF-023",
    vendorId: "mama-kate",
    place: "Ntarikon",
    correspondent: "Manka T.",
    submitted: "09 Oct 2026 · 15:10",
    seen: "Groundnut paste, peeled koki beans, cut plantain",
    priceNote: "Groundnut paste 1,600 FCFA per tub",
    status: "pending",
    note: "Second visit. Utensils covered, portions weighed in front of me.",
  },
  {
    id: "VF-022",
    vendorId: "bali-highland",
    place: "Bali",
    correspondent: "Tita M.",
    submitted: "06 Oct 2026 · 11:05",
    seen: "Smoked fish, beef, cocoyam",
    priceNote: "Smoked fish from 1,500 FCFA",
    status: "approved",
    note: "Smokehouse visited. Fish stored on racks, not on the floor.",
  },
];

export const activeVendors = vendors.filter((vendor) =>
  verificationSeed.some((item) => item.vendorId === vendor.id),
);

export const vendorPreparedItems = (vendorId: string) =>
  dishes.flatMap((dish) =>
    dish.ingredients
      .filter((ingredient) => ingredient.ready?.vendorId === vendorId)
      .map((ingredient) => ({
        dish: dish.name,
        label: ingredient.ready?.label ?? ingredient.name,
        price: ingredient.ready?.price ?? ingredient.rawPrice,
        available: true,
      })),
  );

export const peopleSeed = [
  { id: "u1", name: "Ngwa P.", email: "ngwa@chopweti.app", role: "admin", place: "Bamenda Centre" },
  { id: "u2", name: "Manka T.", email: "manka@chopweti.app", role: "regulator", place: "Ntarikon" },
  { id: "u3", name: "Neba A.", email: "neba@chopweti.app", role: "correspondent", place: "Nkwen" },
  { id: "u4", name: "Nfor E.", email: "nfor@chopweti.app", role: "correspondent", place: "Bambili" },
  { id: "u5", name: "Mama Ngum", email: "mamangum@chopweti.app", role: "vendor", place: "Nkwen" },
  { id: "u6", name: "Aunty Kate", email: "kate@chopweti.app", role: "vendor", place: "Ntarikon" },
];

export const requestsSeed = [
  {
    id: "RQ-108",
    household: "The Ngwa table",
    items: ["Pounded cocoyam · 1.5 kg", "Cleaned eru · 500 g"],
    pickup: "Today, 5:00–6:00 pm",
    total: 5300,
    status: "new",
  },
  {
    id: "RQ-107",
    household: "Bambili student table",
    items: ["Prepared fufu · 1 kg"],
    pickup: "Today, 7:00 pm",
    total: 1500,
    status: "new",
  },
  {
    id: "RQ-106",
    household: "The Fon table",
    items: ["Pounded cocoyam · 3 kg", "Yellow soup spice · 2 sets"],
    pickup: "Tomorrow, 10:00 am",
    total: 7600,
    status: "accepted",
  },
];

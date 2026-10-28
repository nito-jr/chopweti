import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "../components/Header";
import { Footer } from "../components/Footer";

const credits = [
  {
    image: "/images/hero-eru.jpg",
    title: "Eru traditionnel",
    creator: "Étienne Talla",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Eru_traditionnel.jpg",
  },
  {
    image: "/images/dishes/ndole.jpg",
    title: "Ndolé camerounais",
    creator: "PRA",
    license: "CC BY 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Ndol%C3%A9_camerounais.JPG",
  },
  {
    image: "/images/dishes/achu.jpg",
    title: "Achu and Yellow Soup with vegetable",
    creator: "OlgaEmma",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Achu_and_Yellow_Soup_with_vegetable.jpg",
  },
  {
    image: "/images/dishes/kati.jpg",
    title: "Kati-kati",
    creator: "Alvy Bih",
    license: "CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Kati-kati.jpg",
  },
  {
    image: "/images/dishes/koki.jpg",
    title: "Koki and ripe plantains",
    creator: "Black Lyn",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Koki_and_ripe_plantains.jpg",
  },
  {
    image: "/images/dishes/beans.jpg",
    title: "Plat de haricots accompagné de plantain 01",
    creator: "Kondah",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Plat_de_haricots_accompagn%C3%A9_de_plantain_01.jpg",
  },
  {
    image: "/images/dishes/poulet-dg.jpg",
    title: "Poulet GD (fried chicken with ripe plantains and mixed vegetables)",
    creator: "Adesolive",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Poulet_GD_(fried_chicken_with_ripe_plantains_and_mixed_vegetables).jpg",
  },
  {
    image: "/images/market-bamenda.jpg",
    title: "Commercial Avenue, Bamenda, Cameroon",
    creator: "Ambo64",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Commercial_Avenue,_Bamenda,_Cameroon.jpg",
  },
  {
    image: "/images/vendor-greens.jpg",
    title: "Peanut Vendor in Bafia – Cameroon",
    creator: "Bediong",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Peanut_Vendor_in_Bafia_-_Cameroon.jpg",
  },
  {
    image: "/images/vendor-beans.jpg",
    title: "Food market 3",
    creator: "AminouT",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Food_market_3.jpg",
  },
  {
    image: "/images/market-fruit.jpg",
    title: "Nkwen Fruit Market",
    creator: "Dada dada",
    license: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Nkwen_Fruit_Market_-_panoramio.jpg",
  },
];

export function CreditsPage() {
  return (
    <div className="credits-page">
      <SiteHeader />
      <main className="shell credits-main">
        <p className="eyebrow">
          <span className="eyebrow__dot" />
          Photography & sources
        </p>
        <h1>
          The people who
          <em> took the pictures.</em>
        </h1>
        <p className="credits-intro">
          ChopWeti uses real photography of Cameroonian food and places, shared
          by Wikimedia Commons contributors. Images are cropped and lightly
          colour-adjusted for layout. Each remains under the licence shown.
        </p>
        <div className="credits-grid">
          {credits.map((credit) => (
            <a
              className="credit-card"
              key={credit.image}
              href={credit.href}
              target="_blank"
              rel="noreferrer"
            >
              <img src={credit.image} alt="" loading="lazy" />
              <div>
                <strong>{credit.title}</strong>
                <span>{credit.creator}</span>
                <small>{credit.license}</small>
              </div>
              <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
        <div className="credits-note">
          <h2>About this prototype</h2>
          <p>
            ChopWeti is a product prototype built from a detailed concept brief.
            Household details, vendors, prices, field notes and verification dates
            are illustrative. Recipes are written as a starting point for a real
            kitchen and should be reviewed by local cooks before publication.
          </p>
          <p>
            Recipe guidance is not medical advice. If you are managing a health
            condition, follow the plan you have agreed with your clinician.
          </p>
          <p>
            Photography licences: CC BY 3.0, CC BY 4.0 and CC BY-SA 3.0/4.0 via
            Wikimedia Commons. No endorsement by the photographers is implied.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

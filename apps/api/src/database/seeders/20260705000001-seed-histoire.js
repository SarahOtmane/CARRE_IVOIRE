"use strict";

const { Op } = require("sequelize");

const sections = [
  {
    key: "enfance",
    display_order: 0,
    image:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Cabosses et fèves de cacao",
    paragraphs: JSON.stringify([
      "Pour moi, ils ont la couleur d'une cabosse de cacao mûrie sous le soleil de Côte d'Ivoire.",
      "Enfant, je passais du temps dans les plantations familiales. Je regardais les cabosses être récoltées, ouvertes à la machette, puis les fèves fermenter avant de sécher lentement au soleil. Je me souviens encore du goût délicatement sucré de la pulpe blanche qui les entoure.",
      "À cette époque, je ne savais pas que ces instants guideraient un jour toute ma vie.",
    ]),
  },
  {
    key: "parcours",
    display_order: 1,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Artisan chocolatier au travail",
    paragraphs: JSON.stringify([
      "Les années ont passé.",
      "Installée en France, j'ai choisi d'apprendre les métiers de bouche avec la même exigence que celle des artisans que j'admire.",
      "Pâtisserie, boulangerie, puis chocolaterie-confiserie : chaque formation m'a permis d'acquérir un savoir-faire et une rigueur qui m'accompagnent aujourd'hui dans chacune de mes créations.",
      "Mais une question revenait sans cesse. Pourquoi la Côte d'Ivoire, premier producteur mondial de cacao, est-elle surtout connue pour exporter des fèves, alors que toute leur richesse aromatique peut être révélée par des artisans qui les transforment avec soin ?",
    ]),
  },
  {
    key: "naissance",
    display_order: 2,
    image:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Tablettes de chocolat artisanal",
    paragraphs: JSON.stringify([
      "C'est de cette réflexion qu'est né Carré Ivoire.",
      "Une chocolaterie artisanale où chaque création raconte un voyage : celui d'un cacao cultivé en Côte d'Ivoire, puis transformé en France selon la méthode Bean-to-Bar, de la fève jusqu'à la tablette.",
      "Dans mon atelier, rien n'est laissé au hasard. Chaque étape est réalisée avec patience : la sélection des fèves, la torréfaction, le raffinage, le conchage, le tempérage et le moulage.",
      "Le temps devient un ingrédient à part entière. Je ne cherche pas simplement à fabriquer du chocolat. Je souhaite révéler l'identité du cacao ivoirien, faire découvrir ses arômes, son caractère et l'histoire des femmes et des hommes qui le cultivent.",
    ]),
  },
  {
    key: "hommage",
    display_order: 3,
    image:
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80",
    image_alt: "Plantation de cacao",
    paragraphs: JSON.stringify([
      "Carré Ivoire est aussi un hommage à mes racines.",
      "À cette terre qui m'a vu grandir.",
      "À celles et ceux qui travaillent les plantations avec courage.",
      "À tous ceux qui croient qu'un chocolat peut être plus qu'une gourmandise : un lien entre les cultures, un savoir-faire, une mémoire et une émotion.",
    ]),
  },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "histoire_sections",
      sections.map((s) => ({
        ...s,
        created_at: now,
        updated_at: now,
      })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("histoire_sections", {
      key: { [Op.in]: sections.map((s) => s.key) },
    });
  },
};

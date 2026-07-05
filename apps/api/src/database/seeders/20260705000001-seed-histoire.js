"use strict";

const { Op } = require("sequelize");

const sections = [
  {
    key: "enfance",
    display_order: 0,
    image: "http://localhost:3000/uploads/e3ecf26b-9fee-4681-b319-3e9808dc3002.webp",
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
    image: "http://localhost:3000/uploads/8d32b956-61a2-4037-99b8-3907cbd72c02.webp",
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
    image: "http://localhost:3000/uploads/3abb9067-bec9-4f5c-ba28-8ca8c1fd73bc.webp",
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
    image: "http://localhost:3000/uploads/876624e9-c4a3-419f-9380-c9b1b7501206.webp",
    image_alt: "Plantation de cacao",
    paragraphs: JSON.stringify([
      "Carré Ivoire est aussi un hommage à mes racines.",
      "À cette terre qui m'a vu grandir.",
      "À celles et ceux qui travaillent les plantations avec courage.",
      "À tous ceux qui croient qu'un chocolat peut être plus qu'une gourmandise : un lien entre les cultures, un savoir-faire, une mémoire et une émotion.",
      "Lorsque vous dégustez un chocolat Carré Ivoire, vous ne découvrez pas seulement une tablette. Vous découvrez une histoire, la mienne et, je l'espère, un peu de la vôtre.",
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

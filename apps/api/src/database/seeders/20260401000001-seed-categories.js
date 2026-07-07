"use strict";

const { Op } = require("sequelize");

const categories = [
  {
    name: "Carrés Signature",
    slug: "carres-signature",
    description:
      "Nos créations emblématiques en ganaches, pralinés et rochers.",
    image_url: "http://localhost:3000/uploads/f437f8fc-98bb-4c9f-a6dd-93b27a353a34.webp",
    display_order: 1,
  },
  {
    name: "Mini Carrés",
    slug: "mini-carres",
    description: "L'intensité des Carrés Signature en format dégustation.",
    image_url: "http://localhost:3000/uploads/f4f14a96-d126-45b7-9075-c305c212d8c3.webp",
    display_order: 2,
  },
  {
    name: "Tablettes",
    slug: "tablettes",
    description: "Chocolats grands crus en tablettes artisanales.",
    image_url: "http://localhost:3000/uploads/a110b116-ff58-4b3e-bff0-2fe49b29b5ee.webp",
    display_order: 3,
  },
  {
    name: "Gourmandises",
    slug: "gourmandises",
    description: "Mendiants, orangettes et autres créations chocolatées.",
    image_url: "http://localhost:3000/uploads/401b69d4-0ce2-400c-98b1-d25d50992f30.webp",
    display_order: 4,
  },
  {
    name: "Pâtes à tartiner",
    slug: "pates-a-tartiner",
    description: "Pâtes artisanales aux chocolats et pralinés maison.",
    image_url: "http://localhost:3000/uploads/e6aa2325-7336-4074-8c8e-ee9aa4817eae.webp",
    display_order: 5,
  },
  {
    name: "Chocobombs",
    slug: "chocobombs",
    description: "Bombes de chocolat chaud à fondre dans un lait chaud.",
    image_url: "http://localhost:3000/uploads/8961b19d-6255-46d0-9c8e-19d7082482ce.webp",
    display_order: 6,
  },
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "categories",
      categories.map((cat) => ({
        ...cat,
        is_active: 1,
        created_at: now,
        updated_at: now,
      })),
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("categories", {
      slug: { [Op.in]: categories.map((c) => c.slug) },
    });
  },
};

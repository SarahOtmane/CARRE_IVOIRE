'use strict'

const categories = [
  {
    name: 'Carrés Signature',
    slug: 'carres-signature',
    description: 'Nos créations emblématiques en ganaches, pralinés et rochers.',
    display_order: 1,
  },
  {
    name: 'Mini Carrés',
    slug: 'mini-carres',
    description: "L'intensité des Carrés Signature en format dégustation.",
    display_order: 2,
  },
  {
    name: 'Tablettes',
    slug: 'tablettes',
    description: 'Chocolats grands crus en tablettes artisanales.',
    display_order: 3,
  },
  {
    name: 'Gourmandises',
    slug: 'gourmandises',
    description: 'Mendiants, orangettes et autres créations chocolatées.',
    display_order: 4,
  },
  {
    name: 'Pâtes à tartiner',
    slug: 'pates-a-tartiner',
    description: 'Pâtes artisanales aux chocolats et pralinés maison.',
    display_order: 5,
  },
  {
    name: 'Chocobombs',
    slug: 'chocobombs',
    description: 'Bombes de chocolat chaud à fondre dans un lait chaud.',
    display_order: 6,
  },
]

module.exports = {
  async up(queryInterface) {
    const now = new Date()
    await queryInterface.bulkInsert(
      'categories',
      categories.map((cat) => ({
        ...cat,
        is_active: 1,
        created_at: now,
        updated_at: now,
      })),
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', {
      slug: categories.map((c) => c.slug),
    })
  },
}

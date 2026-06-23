'use strict'

module.exports = {
  async up(queryInterface) {
    const now = new Date()

    const [products] = await queryInterface.sequelize.query(
      "SELECT id FROM products WHERE slug = 'carre-noir-intense-72' LIMIT 1",
    )
    if (products.length === 0) return
    const productId = products[0].id

    const [existing] = await queryInterface.sequelize.query(
      'SELECT id FROM product_variants WHERE product_id = ?',
      { replacements: [productId] },
    )
    if (existing.length > 0) return

    await queryInterface.bulkInsert('product_variants', [
      {
        product_id: productId,
        label: '250g',
        weight_grams: 250,
        price: 2000,
        stock: 25,
        stock_status: 'in_stock',
        display_order: 1,
        is_active: 1,
        created_at: now,
        updated_at: now,
      },
      {
        product_id: productId,
        label: '500g',
        weight_grams: 500,
        price: 3500,
        stock: 0,
        stock_status: 'out_of_stock',
        display_order: 2,
        is_active: 1,
        created_at: now,
        updated_at: now,
      },
    ])
  },

  async down(queryInterface) {
    const [products] = await queryInterface.sequelize.query(
      "SELECT id FROM products WHERE slug = 'carre-noir-intense-72' LIMIT 1",
    )
    if (products.length === 0) return
    await queryInterface.bulkDelete('product_variants', { product_id: products[0].id })
  },
}

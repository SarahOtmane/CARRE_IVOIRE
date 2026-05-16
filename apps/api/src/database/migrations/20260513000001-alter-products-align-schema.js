'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename columns to match packages/types
    await queryInterface.renameColumn('products', 'short_desc', 'short_description')
    await queryInterface.renameColumn('products', 'long_desc', 'description')
    await queryInterface.renameColumn('products', 'composition', 'ingredients')

    // Add missing columns
    await queryInterface.addColumn('products', 'discount_price', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'price',
    })
    await queryInterface.addColumn('products', 'images', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'image_url',
    })
    await queryInterface.addColumn('products', 'stock_status', {
      type: Sequelize.ENUM('in_stock', 'low_stock', 'out_of_stock'),
      allowNull: false,
      defaultValue: 'in_stock',
      after: 'stock',
    })
    await queryInterface.addColumn('products', 'weight_grams', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      after: 'allergens',
    })
    await queryInterface.addColumn('products', 'badge', {
      type: Sequelize.STRING(100),
      allowNull: true,
      after: 'display_order',
    })

    // Change price from DECIMAL to INT UNSIGNED (prices stored in centimes)
    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    })

    // Add image_url to categories
    await queryInterface.addColumn('categories', 'image_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      after: 'description',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('products', 'short_description', 'short_desc')
    await queryInterface.renameColumn('products', 'description', 'long_desc')
    await queryInterface.renameColumn('products', 'ingredients', 'composition')
    await queryInterface.removeColumn('products', 'discount_price')
    await queryInterface.removeColumn('products', 'images')
    await queryInterface.removeColumn('products', 'stock_status')
    await queryInterface.removeColumn('products', 'weight_grams')
    await queryInterface.removeColumn('products', 'badge')
    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    })
    await queryInterface.removeColumn('categories', 'image_url')
  },
}

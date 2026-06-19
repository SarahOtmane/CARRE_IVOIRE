'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const productsDesc = await queryInterface.describeTable('products')

    // Rename columns only if old names still exist
    if (productsDesc.short_desc) {
      await queryInterface.renameColumn('products', 'short_desc', 'short_description')
    }
    if (productsDesc.long_desc) {
      await queryInterface.renameColumn('products', 'long_desc', 'description')
    }
    if (productsDesc.composition) {
      await queryInterface.renameColumn('products', 'composition', 'ingredients')
    }

    // Add missing columns only if they don't exist yet
    const desc = await queryInterface.describeTable('products')

    if (!desc.discount_price) {
      await queryInterface.addColumn('products', 'discount_price', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        after: 'price',
      })
    }
    if (!desc.images) {
      await queryInterface.addColumn('products', 'images', {
        type: Sequelize.JSON,
        allowNull: true,
        after: 'image_url',
      })
    }
    if (!desc.stock_status) {
      await queryInterface.addColumn('products', 'stock_status', {
        type: Sequelize.ENUM('in_stock', 'low_stock', 'out_of_stock'),
        allowNull: false,
        defaultValue: 'in_stock',
        after: 'stock',
      })
    }
    if (!desc.weight_grams) {
      await queryInterface.addColumn('products', 'weight_grams', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        after: 'allergens',
      })
    }
    if (!desc.badge) {
      await queryInterface.addColumn('products', 'badge', {
        type: Sequelize.STRING(100),
        allowNull: true,
        after: 'display_order',
      })
    }

    // Change price type only if it's still DECIMAL
    if (desc.price && desc.price.type && desc.price.type.toLowerCase().includes('decimal')) {
      await queryInterface.changeColumn('products', 'price', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      })
    }

    // Add image_url to categories if missing
    const categoriesDesc = await queryInterface.describeTable('categories')
    if (!categoriesDesc.image_url) {
      await queryInterface.addColumn('categories', 'image_url', {
        type: Sequelize.STRING(500),
        allowNull: true,
        after: 'description',
      })
    }
  },

  async down(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('products')

    if (desc.short_description) {
      await queryInterface.renameColumn('products', 'short_description', 'short_desc')
    }
    if (desc.description) {
      await queryInterface.renameColumn('products', 'description', 'long_desc')
    }
    if (desc.ingredients) {
      await queryInterface.renameColumn('products', 'ingredients', 'composition')
    }
    if (desc.discount_price) {
      await queryInterface.removeColumn('products', 'discount_price')
    }
    if (desc.images) {
      await queryInterface.removeColumn('products', 'images')
    }
    if (desc.stock_status) {
      await queryInterface.removeColumn('products', 'stock_status')
    }
    if (desc.weight_grams) {
      await queryInterface.removeColumn('products', 'weight_grams')
    }
    if (desc.badge) {
      await queryInterface.removeColumn('products', 'badge')
    }
    await queryInterface.changeColumn('products', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    })

    const categoriesDesc = await queryInterface.describeTable('categories')
    if (categoriesDesc.image_url) {
      await queryInterface.removeColumn('categories', 'image_url')
    }
  },
}

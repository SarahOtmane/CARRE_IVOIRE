'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      short_desc: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      long_desc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      composition: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      allergens: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      conservation: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      tasting_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      suggested_use: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      formats: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: '[{"id":"9","label":"Coffret 9 pièces","price":18.00,"stock":15}]',
      },
      cta_label: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      is_seasonal: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.addIndex('products', ['category_id'], { name: 'idx_category' })
    await queryInterface.addIndex('products', ['is_active'], { name: 'idx_active' })
    await queryInterface.addIndex('products', ['stock'], { name: 'idx_stock' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products')
  },
}

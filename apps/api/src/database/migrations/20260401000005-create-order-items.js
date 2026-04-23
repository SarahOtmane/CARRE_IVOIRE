'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      quantity: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      unit_price: {
        // Snapshot du prix au moment de l'achat
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      format: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      product_name: {
        // Snapshot du nom produit
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    })

    await queryInterface.addIndex('order_items', ['order_id'], { name: 'idx_order' })
    await queryInterface.addIndex('order_items', ['product_id'], { name: 'idx_product' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('order_items')
  },
}

'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('order_items')
    if (!desc.variant_id) {
      await queryInterface.addColumn('order_items', 'variant_id', {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        after: 'product_id',
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
    }
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('order_items')
    if (desc.variant_id) {
      await queryInterface.removeColumn('order_items', 'variant_id')
    }
  },
}

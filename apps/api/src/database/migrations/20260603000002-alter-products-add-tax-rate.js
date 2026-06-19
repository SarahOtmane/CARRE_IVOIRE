'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('products')
    if (desc.tax_rate_id) return

    await queryInterface.addColumn('products', 'tax_rate_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      after: 'stock_status',
      references: {
        model: 'tax_rates',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('products')
    if (desc.tax_rate_id) {
      await queryInterface.removeColumn('products', 'tax_rate_id')
    }
  },
}

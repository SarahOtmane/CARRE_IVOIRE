'use strict'

module.exports = {
  async up(queryInterface) {
    const desc = await queryInterface.describeTable('products')
    if (desc.formats) {
      await queryInterface.removeColumn('products', 'formats')
    }
  },

  async down(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('products')
    if (!desc.formats) {
      await queryInterface.addColumn('products', 'formats', {
        type: Sequelize.JSON,
        allowNull: true,
      })
    }
  },
}

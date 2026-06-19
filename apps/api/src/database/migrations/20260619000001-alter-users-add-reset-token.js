'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('users')

    if (!desc.reset_token) {
      await queryInterface.addColumn('users', 'reset_token', {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: null,
        after: 'is_active',
      })
    }

    if (!desc.reset_token_expires) {
      await queryInterface.addColumn('users', 'reset_token_expires', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        after: 'reset_token',
      })
    }
  },

  async down(queryInterface) {
    const desc = await queryInterface.describeTable('users')
    if (desc.reset_token) await queryInterface.removeColumn('users', 'reset_token')
    if (desc.reset_token_expires) await queryInterface.removeColumn('users', 'reset_token_expires')
  },
}

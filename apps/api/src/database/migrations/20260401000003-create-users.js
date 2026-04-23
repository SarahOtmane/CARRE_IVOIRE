'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      address_street: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address_city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address_zip: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      address_country: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: 'France',
      },
      role: {
        type: Sequelize.ENUM('client', 'admin'),
        allowNull: false,
        defaultValue: 'client',
      },
      customer_number: {
        // Format: CI-YYYYMMDD-XXXX — généré à la création, jamais modifiable
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.addIndex('users', ['role'], { name: 'idx_role' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users')
  },
}

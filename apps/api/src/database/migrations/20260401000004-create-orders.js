'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      order_number: {
        // Format: CI-ORD-YYYYMMDD-XXXX
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'payment_pending',
          'paid',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
          'refunded',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shipping_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      delivery_mode: {
        type: Sequelize.ENUM('standard', 'express', 'pickup'),
        allowNull: false,
        defaultValue: 'standard',
      },
      stripe_pi_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      stripe_pi_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      address_street: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address_city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      address_zip: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      address_country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'France',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('orders', ['user_id'], { name: 'idx_user' })
    await queryInterface.addIndex('orders', ['status'], { name: 'idx_status' })
    await queryInterface.addIndex('orders', ['created_at'], { name: 'idx_created' })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders')
  },
}

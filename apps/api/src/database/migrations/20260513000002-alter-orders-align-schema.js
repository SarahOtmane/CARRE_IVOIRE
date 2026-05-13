'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add shipping_address JSON (replaces separate address columns for new orders)
    await queryInterface.addColumn('orders', 'shipping_address', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'total_amount',
    })

    // Rename stripe_pi_id → stripe_payment_intent_id
    await queryInterface.renameColumn('orders', 'stripe_pi_id', 'stripe_payment_intent_id')

    // Update status ENUM: replace 'paid' with 'confirmed'
    await queryInterface.changeColumn('orders', 'status', {
      type: Sequelize.ENUM(
        'pending',
        'payment_pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ),
      allowNull: false,
      defaultValue: 'pending',
    })

    // Change total_amount from DECIMAL to INT UNSIGNED (centimes)
    await queryInterface.changeColumn('orders', 'total_amount', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    })

    // Change order_items.unit_price from DECIMAL to INT UNSIGNED (centimes)
    await queryInterface.changeColumn('order_items', 'unit_price', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'shipping_address')
    await queryInterface.renameColumn('orders', 'stripe_payment_intent_id', 'stripe_pi_id')
    await queryInterface.changeColumn('orders', 'status', {
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
    })
    await queryInterface.changeColumn('orders', 'total_amount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    })
    await queryInterface.changeColumn('order_items', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    })
  },
}

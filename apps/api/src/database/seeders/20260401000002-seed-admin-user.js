'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL || 'admin@carre-ivoire.fr'
    const plainPassword = process.env.ADMIN_PASSWORD || 'Admin1234!'

    const passwordHash = await bcrypt.hash(plainPassword, 12)

    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const customerNumber = `CI-${dateStr}-0001`

    await queryInterface.bulkInsert('users', [
      {
        email,
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'Carré Ivoire',
        phone: null,
        address_street: null,
        address_city: null,
        address_zip: null,
        address_country: 'France',
        role: 'admin',
        customer_number: customerNumber,
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL || 'admin@carre-ivoire.fr'
    await queryInterface.bulkDelete('users', { email })
  },
}

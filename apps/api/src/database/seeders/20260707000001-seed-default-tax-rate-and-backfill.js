'use strict'

module.exports = {
  async up(queryInterface) {
    const now = new Date()

    const [existingDefault] = await queryInterface.sequelize.query(
      'SELECT id FROM tax_rates WHERE is_default = 1 LIMIT 1',
    )

    let defaultTaxRateId
    if (existingDefault.length > 0) {
      defaultTaxRateId = existingDefault[0].id
    } else {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id FROM tax_rates ORDER BY id ASC LIMIT 1',
      )
      if (rows.length > 0) {
        defaultTaxRateId = rows[0].id
        await queryInterface.sequelize.query('UPDATE tax_rates SET is_default = 1 WHERE id = ?', {
          replacements: [defaultTaxRateId],
        })
      } else {
        await queryInterface.bulkInsert('tax_rates', [
          {
            label: 'TVA standard',
            rate: 20.0,
            is_default: 1,
            created_at: now,
            updated_at: now,
          },
        ])
        const [inserted] = await queryInterface.sequelize.query(
          'SELECT id FROM tax_rates WHERE is_default = 1 LIMIT 1',
        )
        defaultTaxRateId = inserted[0].id
      }
    }

    await queryInterface.sequelize.query('UPDATE products SET tax_rate_id = ? WHERE tax_rate_id IS NULL', {
      replacements: [defaultTaxRateId],
    })
    await queryInterface.sequelize.query('UPDATE product_variants SET tax_rate_id = ? WHERE tax_rate_id IS NULL', {
      replacements: [defaultTaxRateId],
    })
  },

  async down() {
    // Backfill non réversible de manière fiable (on ne sait plus quelles lignes étaient NULL avant) — no-op volontaire.
  },
}

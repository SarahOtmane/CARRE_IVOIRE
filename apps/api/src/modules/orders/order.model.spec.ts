import 'reflect-metadata'
import { Order } from './order.model'

describe('Order model – résolution des associations', () => {
  it('résout les relatedClassGetter (@ForeignKey) sans connexion DB', () => {
    const foreignKeys: any[] = Reflect.getMetadata('sequelize:foreignKeys', Order.prototype) ?? []
    foreignKeys.forEach((fk) => {
      expect(fk.relatedClassGetter()).toBeDefined()
    })
  })

  it('résout les associations (@BelongsTo / @HasMany) sans connexion DB', () => {
    const associations: any[] = Reflect.getMetadata('sequelize:associations', Order.prototype) ?? []
    associations.forEach((a) => {
      expect(a.getAssociatedClass()).toBeDefined()
    })
  })
})

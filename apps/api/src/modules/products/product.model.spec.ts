import 'reflect-metadata'
import { Product } from './product.model'

describe('Product model – résolution des associations', () => {
  it('résout les relatedClassGetter (@ForeignKey) sans connexion DB', () => {
    const foreignKeys: any[] = Reflect.getMetadata('sequelize:foreignKeys', Product.prototype) ?? []
    foreignKeys.forEach((fk) => {
      expect(fk.relatedClassGetter()).toBeDefined()
    })
  })

  it('résout les associations (@BelongsTo / @HasMany) sans connexion DB', () => {
    const associations: any[] = Reflect.getMetadata('sequelize:associations', Product.prototype) ?? []
    associations.forEach((a) => {
      expect(a.getAssociatedClass()).toBeDefined()
    })
  })
})

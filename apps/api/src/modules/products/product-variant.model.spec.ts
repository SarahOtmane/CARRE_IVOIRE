import 'reflect-metadata'
import { ProductVariant } from './product-variant.model'

describe('ProductVariant model – résolution des associations', () => {
  it('résout les relatedClassGetter (@ForeignKey) sans connexion DB', () => {
    const foreignKeys: any[] = Reflect.getMetadata('sequelize:foreignKeys', ProductVariant.prototype) ?? []
    foreignKeys.forEach((fk) => {
      expect(fk.relatedClassGetter()).toBeDefined()
    })
  })

  it('résout les associations (@BelongsTo) sans connexion DB', () => {
    const associations: any[] = Reflect.getMetadata('sequelize:associations', ProductVariant.prototype) ?? []
    associations.forEach((a) => {
      expect(a.getAssociatedClass()).toBeDefined()
    })
  })
})

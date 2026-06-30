import 'reflect-metadata'
import { Favorite } from './favorite.model'

describe('Favorite model – résolution des associations', () => {
  it('résout les relatedClassGetter (@ForeignKey) sans connexion DB', () => {
    const foreignKeys: any[] = Reflect.getMetadata('sequelize:foreignKeys', Favorite.prototype) ?? []
    foreignKeys.forEach((fk) => {
      expect(fk.relatedClassGetter()).toBeDefined()
    })
  })

  it('résout les associations (@BelongsTo) sans connexion DB', () => {
    const associations: any[] = Reflect.getMetadata('sequelize:associations', Favorite.prototype) ?? []
    associations.forEach((a) => {
      expect(a.getAssociatedClass()).toBeDefined()
    })
  })
})

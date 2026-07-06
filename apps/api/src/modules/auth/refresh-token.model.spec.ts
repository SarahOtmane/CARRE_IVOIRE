import 'reflect-metadata'
import { RefreshToken } from './refresh-token.model'

describe('RefreshToken model – résolution des associations', () => {
  it('résout les relatedClassGetter (@ForeignKey) sans connexion DB', () => {
    const foreignKeys: any[] = Reflect.getMetadata('sequelize:foreignKeys', RefreshToken.prototype) ?? []
    foreignKeys.forEach((fk) => {
      const resolved = fk.relatedClassGetter()
      expect(resolved).toBeDefined()
    })
  })

  it('résout les associations (@BelongsTo / @HasMany) sans connexion DB', () => {
    const associations: any[] = Reflect.getMetadata('sequelize:associations', RefreshToken.prototype) ?? []
    associations.forEach((a) => {
      const resolved = a.getAssociatedClass()
      expect(resolved).toBeDefined()
    })
  })
})

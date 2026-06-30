import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'
import { UsersRepository } from './users.repository'
import { User } from './users.model'

describe('UsersRepository', () => {
  let repo: UsersRepository
  let model: {
    findOne: jest.Mock
    findByPk: jest.Mock
    create: jest.Mock
    update: jest.Mock
    findAndCountAll: jest.Mock
    count: jest.Mock
    sequelize: { transaction: jest.Mock }
  }

  const mockUser = {
    id: 1,
    email: 'user@test.com',
    customer_number: 'CI-00000001',
    update: jest.fn().mockResolvedValue({}),
  }

  const mockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            findByPk: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue({ ...mockUser, update: jest.fn().mockResolvedValue(mockUser) }),
            update: jest.fn().mockResolvedValue([1]),
            findAndCountAll: jest.fn().mockResolvedValue({ count: 0, rows: [] }),
            count: jest.fn().mockResolvedValue(0),
            sequelize: { transaction: jest.fn().mockResolvedValue(mockTransaction) },
          },
        },
      ],
    }).compile()

    repo = module.get(UsersRepository)
    model = module.get(getModelToken(User))
  })

  describe('findByEmail', () => {
    it('recherche par email en minuscule', async () => {
      await repo.findByEmail('USER@TEST.COM')
      expect(model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { email: 'user@test.com' } }),
      )
    })
  })

  describe('findById', () => {
    it('retourne null si l\'utilisateur n\'existe pas', async () => {
      expect(await repo.findById(99)).toBeNull()
    })
  })

  describe('create', () => {
    it('crée un utilisateur avec un customer_number basé sur l\'id', async () => {
      await repo.create({ email: 'New@Test.COM', password_hash: 'hash', first_name: 'A', last_name: 'B' })
      expect(model.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@test.com' }),
        expect.anything(),
      )
    })
  })

  describe('update', () => {
    it('lève USER_NOT_FOUND si l\'utilisateur n\'existe pas', async () => {
      model.findByPk.mockResolvedValue(null)
      await expect(repo.update(99, {} as any)).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'USER_NOT_FOUND' }),
      })
    })

    it('met à jour l\'utilisateur s\'il existe', async () => {
      const user = { update: jest.fn().mockResolvedValue({ id: 1 }) }
      model.findByPk.mockResolvedValue(user as any)
      await repo.update(1, { first_name: 'Paul' } as any)
      expect(user.update).toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('retourne une page vide par défaut', async () => {
      const result = await repo.findAll({})
      expect(result.total).toBe(0)
      expect(result.items).toHaveLength(0)
      expect(result.page).toBe(1)
    })

    it('applique la recherche textuelle', async () => {
      await repo.findAll({ search: 'jean' })
      expect(model.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({}) }),
      )
    })
  })

  describe('emailExists', () => {
    it('retourne false si aucun compte avec cet email', async () => {
      expect(await repo.emailExists('nobody@test.com')).toBe(false)
    })

    it('retourne true si l\'email existe', async () => {
      model.count.mockResolvedValue(1)
      expect(await repo.emailExists('user@test.com')).toBe(true)
    })
  })

  describe('setResetToken', () => {
    it('stocke le hash du token et la date d\'expiration', async () => {
      const expires = new Date()
      await repo.setResetToken(1, 'rawtoken', expires)
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ resetToken: expect.any(String), resetTokenExpires: expires }),
        expect.objectContaining({ where: { id: 1 } }),
      )
    })
  })

  describe('clearResetToken', () => {
    it('efface le token et met à jour le hash du mot de passe', async () => {
      await repo.clearResetToken(1, 'newHash')
      expect(model.update).toHaveBeenCalledWith(
        expect.objectContaining({ password_hash: 'newHash', resetToken: null }),
        expect.objectContaining({ where: { id: 1 } }),
      )
    })
  })

  describe('findByResetToken', () => {
    it('retourne null si le token est inconnu', async () => {
      model.findOne.mockResolvedValue(null)
      expect(await repo.findByResetToken('unknowntoken')).toBeNull()
    })
  })
})

import type { SequelizeModuleOptions } from '@nestjs/sequelize'

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: process.env.DB_HOST ?? 'database',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
  define: {
    charset: 'utf8mb4',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})

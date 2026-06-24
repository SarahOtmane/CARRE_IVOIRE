import type { SequelizeModuleOptions } from '@nestjs/sequelize'

export const databaseConfig = (): SequelizeModuleOptions => ({
  dialect: 'mysql',
  host: process.env.DB_HOST ?? 'database',
  port: Number.parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  // En test, le schéma est créé une seule fois par test/_setup-db.e2e-spec.ts (pretest:e2e) —
  // resynchroniser à chaque boot d'app e2e (un par fichier, process séparés) expose un bug
  // de sequelize-typescript : Model.sync() revérifie les index à chaque appel, ce qui devient
  // raceable entre process concurrents et fragilise le registre de modèles partagé.
  synchronize: process.env.NODE_ENV === 'development',
  // alter:true uniquement en dev (base persistante) — la base de test est toujours
  // recréée vide, un simple create-if-not-exists suffit et évite l'accumulation
  // d'index observée avec alter:true (cf. incident DB-001)
  sync: process.env.NODE_ENV === 'development' ? { alter: true } : {},
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

-- Création de la base avec encodage Unicode complet
CREATE DATABASE IF NOT EXISTS `carre_ivoire`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- L'utilisateur est déjà créé par les variables MYSQL_USER/MYSQL_PASSWORD.
-- On s'assure ici que ses privilèges sont corrects sur toutes les tables.
GRANT ALL PRIVILEGES ON `carre_ivoire`.* TO `carre_user`@`%`;

FLUSH PRIVILEGES;

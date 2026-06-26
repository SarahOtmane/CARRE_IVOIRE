-- Migration : supprimer les colonnes address_* legacy de la table orders
-- Ces colonnes dupliquent le champ JSON `shipping_address`.
-- À exécuter UNE SEULE FOIS sur chaque environnement (dev, staging, production).
--
-- Avant d'exécuter :
--   1. Vérifier que `shipping_address` contient bien les données pour toutes les commandes existantes
--   2. Faire une sauvegarde de la table : mysqldump -u <user> -p <db> orders > orders_backup.sql

ALTER TABLE orders
  DROP COLUMN address_street,
  DROP COLUMN address_city,
  DROP COLUMN address_zip,
  DROP COLUMN address_country;

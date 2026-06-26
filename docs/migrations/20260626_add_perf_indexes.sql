-- Migration : index de performance complémentaires
-- À exécuter sur staging et production (le dev se sync automatiquement via Sequelize alter:true).

-- Commandes récentes par utilisateur (GET /orders/me, page admin commandes filtrées par user)
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON orders (user_id, created_at DESC);

-- Produits par catégorie filtrés actifs, triés par display_order (route publique principale)
CREATE INDEX IF NOT EXISTS idx_products_category_active_order
  ON products (category_id, is_active, display_order);

-- Produits actifs triés globalement (boutique sans filtre catégorie)
CREATE INDEX IF NOT EXISTS idx_products_active_order
  ON products (is_active, display_order);

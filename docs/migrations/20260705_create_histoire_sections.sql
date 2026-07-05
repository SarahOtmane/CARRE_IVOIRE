-- Migration : création de la table histoire_sections
-- Contenu éditable (images + paragraphes) de la page /histoire, gérable depuis le dashboard admin.
-- Le dev se sync automatiquement via Sequelize (synchronize + alter en développement) ;
-- à exécuter manuellement sur staging et production.

CREATE TABLE IF NOT EXISTS histoire_sections (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key`          VARCHAR(50)  NOT NULL,
  display_order  INT          NOT NULL DEFAULT 0,
  image          VARCHAR(500) NOT NULL,
  image_alt      VARCHAR(255) NOT NULL,
  paragraphs     JSON         NOT NULL,
  created_at     DATETIME     NOT NULL,
  updated_at     DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contenu initial (identique à ce qui était en dur dans histoire.vue avant migration).
-- Ne rien insérer si la table a déjà été peuplée par le seeder Sequelize
-- (apps/api/src/database/seeders/20260705000001-seed-histoire.js).
INSERT IGNORE INTO histoire_sections (`key`, display_order, image, image_alt, paragraphs, created_at, updated_at)
VALUES
  (
    'enfance', 0,
    'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80',
    'Cabosses et fèves de cacao',
    JSON_ARRAY(
      'Pour moi, ils ont la couleur d''une cabosse de cacao mûrie sous le soleil de Côte d''Ivoire.',
      'Enfant, je passais du temps dans les plantations familiales. Je regardais les cabosses être récoltées, ouvertes à la machette, puis les fèves fermenter avant de sécher lentement au soleil. Je me souviens encore du goût délicatement sucré de la pulpe blanche qui les entoure.',
      'À cette époque, je ne savais pas que ces instants guideraient un jour toute ma vie.'
    ),
    NOW(), NOW()
  ),
  (
    'parcours', 1,
    'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
    'Artisan chocolatier au travail',
    JSON_ARRAY(
      'Les années ont passé.',
      'Installée en France, j''ai choisi d''apprendre les métiers de bouche avec la même exigence que celle des artisans que j''admire.',
      'Pâtisserie, boulangerie, puis chocolaterie-confiserie : chaque formation m''a permis d''acquérir un savoir-faire et une rigueur qui m''accompagnent aujourd''hui dans chacune de mes créations.',
      'Mais une question revenait sans cesse. Pourquoi la Côte d''Ivoire, premier producteur mondial de cacao, est-elle surtout connue pour exporter des fèves, alors que toute leur richesse aromatique peut être révélée par des artisans qui les transforment avec soin ?'
    ),
    NOW(), NOW()
  ),
  (
    'naissance', 2,
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80',
    'Tablettes de chocolat artisanal',
    JSON_ARRAY(
      'C''est de cette réflexion qu''est né Carré Ivoire.',
      'Une chocolaterie artisanale où chaque création raconte un voyage : celui d''un cacao cultivé en Côte d''Ivoire, puis transformé en France selon la méthode Bean-to-Bar, de la fève jusqu''à la tablette.',
      'Dans mon atelier, rien n''est laissé au hasard. Chaque étape est réalisée avec patience : la sélection des fèves, la torréfaction, le raffinage, le conchage, le tempérage et le moulage.',
      'Le temps devient un ingrédient à part entière. Je ne cherche pas simplement à fabriquer du chocolat. Je souhaite révéler l''identité du cacao ivoirien, faire découvrir ses arômes, son caractère et l''histoire des femmes et des hommes qui le cultivent.'
    ),
    NOW(), NOW()
  ),
  (
    'hommage', 3,
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80',
    'Plantation de cacao',
    JSON_ARRAY(
      'Carré Ivoire est aussi un hommage à mes racines.',
      'À cette terre qui m''a vu grandir.',
      'À celles et ceux qui travaillent les plantations avec courage.',
      'À tous ceux qui croient qu''un chocolat peut être plus qu''une gourmandise : un lien entre les cultures, un savoir-faire, une mémoire et une émotion.'
    ),
    NOW(), NOW()
  );

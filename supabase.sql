-- SQL SCRIPT POUR SUPABASE : SHAKPOT
-- Copiez et collez ce script dans le SQL Editor de Supabase pour créer les tables.

-- 1. Table des Catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des Produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  promotion_price INTEGER,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_promotion BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Ajout de Row Level Security (RLS)
-- Seuls les utilisateurs authentifiés peuvent modifier les données.
-- Les visiteurs (anonymes) peuvent seulement lire les données.

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture (Publique)
CREATE POLICY "Les catégories sont visibles par tous" ON categories FOR SELECT USING (true);
CREATE POLICY "Les produits sont visibles par tous" ON products FOR SELECT USING (true);

-- Politiques d'écriture (Authentifié)
CREATE POLICY "Les administrateurs peuvent modifier les catégories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Les administrateurs peuvent modifier les produits" ON products FOR ALL USING (auth.role() = 'authenticated');

-- 4. Insertion de données fictives (Optionnel)
INSERT INTO categories (id, name, slug, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Burgers', 'burgers', 1),
  ('22222222-2222-2222-2222-222222222222', 'Tacos', 'tacos', 2);

INSERT INTO products (name, slug, description, price, category_id, is_available)
VALUES 
  ('Classic Cheeseburger', 'classic-cheeseburger', 'Steak, cheddar, sauce', 1200, '11111111-1111-1111-1111-111111111111', true),
  ('Tacos Maxi Viande', 'tacos-maxi-viande', 'Poulet, viande hachée', 2000, '22222222-2222-2222-2222-222222222222', true);

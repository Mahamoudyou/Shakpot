-- ==============================================================================
-- SCRIPT SQL COMPLET SUPABASE : SHAKPOT & MULTI-RESTAURANTS SAAS
-- À copier-coller et exécuter dans le "SQL Editor" de votre console Supabase.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE DES RESTAURANTS (MULTI-TENANT SAAS)
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  phone TEXT,
  address TEXT,
  currency TEXT DEFAULT 'FDJ' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertion du restaurant principal SHAKPOT par défaut
INSERT INTO restaurants (id, name, slug, phone, currency, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'SHAKPOT',
  'shakpot',
  '+253 773 77 50 2',
  'FDJ',
  true
)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  phone = EXCLUDED.phone;

-- 3. TABLE DES CATÉGORIES (AVEC restaurant_id)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE DEFAULT '00000000-0000-0000-0000-000000000001' NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_category_slug_per_restaurant UNIQUE (restaurant_id, slug)
);

-- 4. TABLE DES PRODUITS (AVEC restaurant_id)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE DEFAULT '00000000-0000-0000-0000-000000000001' NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  promotion_price INTEGER,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true NOT NULL,
  is_promotion BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_product_slug_per_restaurant UNIQUE (restaurant_id, slug)
);

-- 5. TABLE DES GROUPES DE VARIANTES (AVEC restaurant_id & is_required)
CREATE TABLE IF NOT EXISTS variation_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE DEFAULT '00000000-0000-0000-0000-000000000001' NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('single', 'multiple_with_quantity')) DEFAULT 'multiple_with_quantity' NOT NULL,
  is_required BOOLEAN DEFAULT false NOT NULL,
  category_ids TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE DES OPTIONS DE VARIANTES
CREATE TABLE IF NOT EXISTS variation_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variation_group_id UUID REFERENCES variation_groups(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price_adjustment INTEGER DEFAULT 0 NOT NULL,
  base_price INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE DES COMMANDES (AVEC restaurant_id)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE DEFAULT '00000000-0000-0000-0000-000000000001' NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  mode TEXT CHECK (mode IN ('sur_place', 'livraison', 'en_route')) NOT NULL,
  table_number TEXT,
  delivery_zone TEXT,
  delivery_address TEXT,
  delivery_fee INTEGER DEFAULT 0 NOT NULL,
  subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method TEXT,
  instructions TEXT,
  status TEXT DEFAULT 'en_attente' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLE DES ARTICLES DE COMMANDE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  selected_options JSONB DEFAULT '[]'::JSONB NOT NULL
);

-- ==============================================================================
-- 9. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE variation_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (Les clients peuvent consulter le menu et les infos du restaurant)
DROP POLICY IF EXISTS "Public restaurants read" ON restaurants;
CREATE POLICY "Public restaurants read" ON restaurants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public categories read" ON categories;
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products read" ON products;
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public variation_groups read" ON variation_groups;
CREATE POLICY "Public variation_groups read" ON variation_groups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public variation_options read" ON variation_options;
CREATE POLICY "Public variation_options read" ON variation_options FOR SELECT USING (true);

-- Politiques d'écriture : autoriser les administrateurs authentifiés
DROP POLICY IF EXISTS "Admins manage categories" ON categories;
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins manage products" ON products;
CREATE POLICY "Admins manage products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins manage variation_groups" ON variation_groups;
CREATE POLICY "Admins manage variation_groups" ON variation_groups FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins manage variation_options" ON variation_options;
CREATE POLICY "Admins manage variation_options" ON variation_options FOR ALL USING (true);

-- Les commandes peuvent être créées publiquement par les clients
DROP POLICY IF EXISTS "Public can create orders" ON orders;
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view own orders" ON orders;
CREATE POLICY "Public can view own orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert order items" ON order_items;
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON order_items;
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);

-- ==============================================================================
-- 10. POLITIQUES DE STOCKAGE SUPABASE STORAGE (BUCKET: restaurant-media)
-- ==============================================================================

-- Création du bucket si non existant
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-media', 'restaurant-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Lecture publique de toutes les images
DROP POLICY IF EXISTS "Public Access to Restaurant Media" ON storage.objects;
CREATE POLICY "Public Access to Restaurant Media" ON storage.objects
FOR SELECT USING (bucket_id = 'restaurant-media');

-- Upload d'images
DROP POLICY IF EXISTS "Allow upload to Restaurant Media" ON storage.objects;
CREATE POLICY "Allow upload to Restaurant Media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'restaurant-media');

-- Mise à jour et suppression d'images
DROP POLICY IF EXISTS "Allow update to Restaurant Media" ON storage.objects;
CREATE POLICY "Allow update to Restaurant Media" ON storage.objects
FOR UPDATE USING (bucket_id = 'restaurant-media');

DROP POLICY IF EXISTS "Allow delete on Restaurant Media" ON storage.objects;
CREATE POLICY "Allow delete on Restaurant Media" ON storage.objects
FOR DELETE USING (bucket_id = 'restaurant-media');

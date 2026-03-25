-- Create the menus table
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  is_special BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  menu_id UUID REFERENCES menus(id),
  menu_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  pickup_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders
CREATE POLICY "Anyone can insert orders."
ON orders FOR INSERT
WITH CHECK (true);

-- Allow everyone to read/update orders (for simplicity in this local dev version)
CREATE POLICY "Orders are viewable by everyone."
ON orders FOR SELECT
USING (true);

CREATE POLICY "Orders are updatable by everyone."
ON orders FOR UPDATE
USING (true)
WITH CHECK (true);

-- Insert initial data for menus (keep existing)
INSERT INTO menus (name, description, price, stock, image_url, is_special) VALUES
('Sate Kambing', 'Sate kambing muda empuk dengan bumbu kecap rahasia meresap sempurna. Dibakar fresh saat dipesan.', 40000, 50, '/images/hero_sate_kambing.png', false),
('Sate Ayam', 'Sate ayam full daging dengan saus kacang legit dan taburan bawang merah segar.', 25000, 100, '/images/sate_ayam_menu.png', false),
('Gulai Kambing', 'Gulai kaya rempah dengan daging kambing yang lembut dan kuah santan gurih.', 35000, 15, '/images/gulai_kambing_menu.png', true);

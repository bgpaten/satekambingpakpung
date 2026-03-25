-- Update existing menu prices
UPDATE menus SET price = 30000 WHERE name = 'Sate Kambing';
UPDATE menus SET price = 15000 WHERE name = 'Sate Ayam';
UPDATE menus SET price = 30000 WHERE name = 'Gulai Kambing';

-- Update orders table to support multiple items
ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2) DEFAULT 0;

-- Optional: Update null notes to empty string if needed
UPDATE orders SET notes = '' WHERE notes IS NULL;

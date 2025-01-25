/*
  # Add Currency Support to Campaigns

  1. Changes
    - Add currency column to campaigns table with default 'USD'
    - Add check constraint to ensure valid currency codes
    - Update existing campaigns to use USD

  2. Notes
    - Uses ISO 4217 currency codes
    - Default to USD for backward compatibility
*/

-- Add currency column with default value
ALTER TABLE campaigns
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'USD'
CHECK (currency ~ '^[A-Z]{3}$');

-- Create index for currency column
CREATE INDEX IF NOT EXISTS idx_campaigns_currency ON campaigns(currency);

-- Add function to validate currency codes
CREATE OR REPLACE FUNCTION is_valid_currency(currency_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN currency_code ~ '^[A-Z]{3}$' AND currency_code IN (
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR'
  );
END;
$$ LANGUAGE plpgsql;
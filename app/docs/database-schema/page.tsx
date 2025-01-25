import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Schema | Documentation',
  description: 'Database schema documentation for the Obsidian Order platform',
};

export default function DatabaseSchemaPage() {
  return (
    <div>
      <h1>Database Schema</h1>

      <h2>Core Tables</h2>

      <h3>Profiles</h3>
      <p>Stores user profile information and links to Supabase Auth.</p>
      <pre><code>{`profiles (
  id: uuid PRIMARY KEY,              -- Links to auth.users
  username: text UNIQUE NOT NULL,    -- Public display name
  full_name: text,                   -- Optional full name
  avatar_url: text,                  -- Profile picture URL
  website: text,                     -- Optional website
  bio: text,                         -- Optional biography
  created_at: timestamptz,           -- Account creation timestamp
  updated_at: timestamptz            -- Last update timestamp
)`}</code></pre>

      <h3>Campaigns</h3>
      <p>Main campaign data storage.</p>
      <pre><code>{`campaigns (
  id: uuid PRIMARY KEY,
  creator_id: uuid,                  -- References profiles
  title: text NOT NULL,
  description: text NOT NULL,
  type: text NOT NULL,               -- government/innovation
  funding_goal: numeric NOT NULL,
  current_amount: numeric DEFAULT 0,
  start_date: timestamptz NOT NULL,
  end_date: timestamptz NOT NULL,
  target: text NOT NULL,
  success_type: text NOT NULL,       -- reward/stretch/community
  success_description: text NOT NULL,
  failure_type: text NOT NULL,       -- refund/charity/challenge
  failure_description: text NOT NULL,
  charity_name: text,                -- For charity failure type
  refund_percentage: integer,        -- For refund failure type
  status: text DEFAULT 'draft',      -- draft/active/successful/failed
  created_at: timestamptz,
  updated_at: timestamptz
)`}</code></pre>

      {/* Add more table documentation following the same pattern */}
    </div>
  );
}
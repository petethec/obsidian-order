import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | Obsidian Order',
  description: 'Documentation for the Obsidian Order platform',
};

export default function DocsPage() {
  return (
    <div>
      <h1>Obsidian Order Platform Documentation</h1>

      <h2>Overview</h2>
      <p>
        Welcome to the Obsidian Order platform documentation. This comprehensive guide covers all aspects
        of the platform&apos;s architecture, implementation, and workflows.
      </p>

      <h2>Quick Links</h2>
      <h3>For Developers</h3>
      <ul>
        <li><a href="/docs/database-schema">Database Schema</a> - Complete database structure and relationships</li>
        <li><a href="/docs/code-structure">Code Structure</a> - Codebase organization and key components</li>
        <li><a href="/docs/api-endpoints">API Endpoints</a> - API documentation and usage</li>
      </ul>

      <h3>For Administrators</h3>
      <ul>
        <li><a href="/docs/admin-workflows">Admin Workflows</a> - Administrative procedures and tools</li>
        <li><a href="/docs/consequence-handling">Consequence Handling</a> - Managing campaign outcomes</li>
      </ul>

      <h2>Getting Started</h2>
      <ol>
        <li>
          <strong>Database Setup</strong>
          <ul>
            <li>Review the <a href="/docs/database-schema">Database Schema</a></li>
            <li>Set up Supabase project</li>
            <li>Run migrations</li>
          </ul>
        </li>
        <li>
          <strong>Development</strong>
          <ul>
            <li>Understand the <a href="/docs/code-structure">Code Structure</a></li>
            <li>Review available <a href="/docs/api-endpoints">API Endpoints</a></li>
            <li>Set up local development environment</li>
          </ul>
        </li>
        <li>
          <strong>Administration</strong>
          <ul>
            <li>Learn <a href="/docs/admin-workflows">Admin Workflows</a></li>
            <li>Understand <a href="/docs/consequence-handling">Consequence Handling</a></li>
            <li>Set up admin accounts and permissions</li>
          </ul>
        </li>
      </ol>

      <h2>Key Features</h2>
      <h3>Campaign Management</h3>
      <ul>
        <li>Multiple campaign types</li>
        <li>Milestone tracking</li>
        <li>Consequence-based accountability</li>
        <li>Automated verification</li>
      </ul>

      <h3>Marketplace</h3>
      <ul>
        <li>Campaign trading</li>
        <li>Legacy share system</li>
        <li>Advisor roles</li>
        <li>Transaction management</li>
      </ul>

      <h3>Reputation System</h3>
      <ul>
        <li>GlassScore™ metrics</li>
        <li>Achievement system</li>
        <li>User reputation tracking</li>
        <li>Voting weight calculation</li>
      </ul>

      <h2>Security</h2>
      <h3>Data Protection</h3>
      <ul>
        <li>Row Level Security (RLS)</li>
        <li>Role-based access control</li>
        <li>Audit logging</li>
        <li>Secure transactions</li>
      </ul>

      <h3>Admin Controls</h3>
      <ul>
        <li>Multi-level admin system</li>
        <li>Two-factor authentication</li>
        <li>Review processes</li>
        <li>Emergency procedures</li>
      </ul>
    </div>
  );
}
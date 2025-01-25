import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Define valid doc pages
const validDocs = [
  'database-schema',
  'api-endpoints',
  'code-structure',
  'consequence-handling',
  'admin-workflows'
];

export function generateStaticParams() {
  return validDocs.map((doc) => ({
    slug: [doc],
  }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }): Metadata {
  const title = params.slug[0]?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Documentation`,
    description: `${title} documentation for the Obsidian Order platform`,
  };
}

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = params.slug[0];
  
  if (!validDocs.includes(doc)) {
    notFound();
  }

  return (
    <div>
      <h1>{doc.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}
      </h1>
      <p>Documentation content for {doc}</p>
    </div>
  );
}
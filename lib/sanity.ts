
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Using the values from your environment variables
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6gzyu3p8'; 
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
  if (!source) return { url: () => '' };
  return builder.image(source);
};

// Helper to get the URL for files (MP3s, PDFs, etc)
export const fileUrlFor = (source: any) => {
  if (!source || !source.asset || !source.asset._ref) return null;
  
  // Format: file-assetid-extension
  const [_file, id, extension] = source.asset._ref.split('-');
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
};


import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';
import { projectId, dataset, apiVersion } from '../../../lib/sanity';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // IMPORTANT: This token must be set in your environment variables (e.g. .env.local)
    // It requires "Editor" or "Write" permissions in your Sanity project settings.
    const token = process.env.SANITY_API_TOKEN;

    if (!token) {
      // Fallback for demo purposes if no token is present, we pretend it worked.
      console.warn("No SANITY_API_TOKEN found. Simulating save.");
      return NextResponse.json({ success: true, simulated: true });
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token, // Use the token for write access
      useCdn: false, // We want fresh data for writes
    });

    // Create a new document in Sanity
    await client.create({
      _type: 'submission', // Ensure you have a schema for this or use a loose schema
      category: type,      // 'place', 'signature', 'proposal'
      ...data,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sanity save error:", error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}

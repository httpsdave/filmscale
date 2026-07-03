import { NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';

  if (query.length < 2) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    const data = await searchMulti(query, parseInt(page));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], total_results: 0 }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=25`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from iTunes API:', error);
    return NextResponse.json(
      { error: 'Failed to search Apple Music' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const r = await fetch('https://wiki.moon-bot.io/api/items.json', { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`Moon API ${r.status}`);
    const data = await r.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('items proxy error', error);
    return NextResponse.json({ error: 'Catalogue Dofus Rétro indisponible' }, { status: 502 });
  }
}

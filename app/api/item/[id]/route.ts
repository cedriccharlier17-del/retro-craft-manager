import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  try {
    const r = await fetch(`https://wiki.moon-bot.io/api/item/${id}.json`, { next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`Moon API ${r.status}`);
    return NextResponse.json(await r.json());
  } catch (error) {
    console.error('item proxy error', error);
    return NextResponse.json({ error: 'Recette indisponible' }, { status: 502 });
  }
}

import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const r = await fetch('https://wiki.moon-bot.io/api/items.json', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!r.ok) throw new Error(`Moon API ${r.status}`);
    const raw = await r.json();
    const source = Array.isArray(raw) ? raw : (raw.items ?? raw.data ?? raw.results ?? []);
    if (!Array.isArray(source)) throw new Error('Unexpected catalogue format');

    const items = source.map((item: any) => ({
      id: Number(item.id ?? item.item_id ?? item.itemId),
      name: String(item.name ?? item.n ?? ''),
      type: String(item.type ?? item.category ?? item.c ?? 'Objet'),
      level: Number(item.level ?? item.lvl ?? 0),
    })).filter((item: any) => Number.isFinite(item.id) && item.name);

    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    console.error('items proxy error', error);
    return NextResponse.json({ error: 'Catalogue Dofus Rétro indisponible' }, { status: 502 });
  }
}

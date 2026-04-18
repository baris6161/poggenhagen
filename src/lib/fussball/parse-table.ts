import type { TableEntry } from "@/data/matches";

/**
 * Ligatabelle aus Mannschaftsseiten-HTML (Bereich mit column-rank / column-points).
 */
export function parseTableFromTeamHtml(html: string): TableEntry[] {
  const rows: TableEntry[] = [];
  const trRe = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = trRe.exec(html))) {
    const tr = m[0];
    if (!tr.includes("column-rank") || !tr.includes("column-points")) continue;
    const team = tr
      .match(/<div class="club-name">\s*([^<]+?)\s*<\/div>/)?.[1]
      ?.trim();
    if (!team) continue;

    const cells = [...tr.matchAll(/<td[^>]*>([^<]*)<\/td>/g)]
      .map((x) => x[1].trim())
      .filter(Boolean);
    if (cells.length < 8) continue;

    const rank = parseInt(cells[0].replace(/\.$/, ""), 10);
    const played = parseInt(cells[1], 10);
    const won = parseInt(cells[2], 10);
    const drawn = parseInt(cells[3], 10);
    const lost = parseInt(cells[4], 10);
    const [gfRaw, gaRaw] = cells[5].split(":").map((s) => s.trim());
    const goalsFor = parseInt(gfRaw, 10);
    const goalsAgainst = parseInt(gaRaw, 10);
    const goalDiff = parseInt(cells[6], 10);
    const points = parseInt(cells[7], 10);

    if (
      [rank, played, won, drawn, lost, goalsFor, goalsAgainst, goalDiff, points].some(
        (n) => Number.isNaN(n)
      )
    ) {
      continue;
    }

    rows.push({
      rank,
      team,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDiff,
      points,
    });
  }

  rows.sort((a, b) => a.rank - b.rank);
  return rows;
}

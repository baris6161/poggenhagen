/**
 * End-to-end: Team-HTML → letztes Spiel → Tor-Events → simuliertes Merge (Datumssort).
 */
const TEAM =
  "https://www.fussball.de/mannschaft/tsv-poggenhagen-tsv-poggenhagen-niedersachsen/-/saison/2526/team-id/011MIA8IDC000000VTVG0001VTR8C1K7";

function normalizeFussballUrl(href) {
  const t = href.trim();
  if (t.startsWith("//")) return `https:${t}`;
  if (/^https?:\/\//i.test(t)) return t.replace(/^http:\/\//i, "https://");
  if (t.startsWith("/")) return `https://www.fussball.de${t}`;
  return `https://${t.replace(/^\/+/, "")}`;
}

const HREF_IN_OPEN_A_RE =
  /^<a href="((?:https:\/\/|\/\/)(?:www\.)?fussball\.de\/spiel\/[^"]+\/spiel\/[0-9A-Z]+|\/spiel\/[^"]+\/spiel\/[0-9A-Z]+)"/i;

function extractLetztesSpielMatchUrl(html, markerIdx) {
  const anchorIdx = html.lastIndexOf('<a href="', markerIdx);
  if (anchorIdx < 0 || anchorIdx < markerIdx - 4000) return null;
  const frag = html.slice(anchorIdx, anchorIdx + 700);
  const m = frag.match(HREF_IN_OPEN_A_RE);
  return m?.[1] ? normalizeFussballUrl(m[1]) : null;
}

function parseLastMatchLink(html) {
  const marker = "Letztes Spiel:";
  const markerIdx = html.indexOf(marker);
  if (markerIdx < 0) return null;
  const matchUrl = extractLetztesSpielMatchUrl(html, markerIdx);
  if (!matchUrl) return null;
  const slice = html.slice(markerIdx, markerIdx + 3500);
  const home = slice
    .match(/<span class="team-home">([^<]+)<\/span>/)?.[1]
    ?.trim();
  const away = slice
    .match(/<span class="team-away">([^<]+)<\/span>/)?.[1]
    ?.trim();
  if (!home || !away) return null;
  const dateM = slice.match(/Letztes Spiel:\s*([^<]+)<\/span>/);
  const dateLabel = (dateM?.[1] ?? "").trim();
  const timeM = slice.match(/<span>\s*(\d{2}:\d{2})\s*(?:&#124;|\|)/i);
  const time = timeM?.[1] ?? "15:00";
  return { matchUrl, homeTeam: home, awayTeam: away, dateLabel, time };
}

function parseGermanShortDateToIso(dateLabel) {
  if (!dateLabel?.trim()) return null;
  const m4 = dateLabel.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (m4) return `${m4[3]}-${m4[2]}-${m4[1]}`;
  const m2 = dateLabel.match(/(\d{2})\.(\d{2})\.(\d{2})\b/);
  if (m2) {
    const y = parseInt(m2[3], 10);
    const yyyy = y >= 60 ? 1900 + y : 2000 + y;
    return `${yyyy}-${m2[2]}-${m2[1]}`;
  }
  return null;
}

function parseMatchEventsAttr(html) {
  const key = 'data-match-events="';
  const i = html.indexOf(key);
  if (i < 0) return null;
  const start = i + key.length;
  let depth = 0;
  let end = start;
  for (let j = start; j < html.length; j++) {
    const c = html[j];
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  const raw = html.slice(start, end);
  const jsonish = raw
    .replace(/'/g, '"')
    .replace(/True/g, "true")
    .replace(/False/g, "false");
  try {
    return JSON.parse(jsonish);
  } catch {
    return null;
  }
}

function countGoals(data) {
  if (!data) return null;
  let home = 0,
    away = 0;
  for (const half of [data["first-half"], data["second-half"]]) {
    for (const ev of half?.events ?? []) {
      if (ev.type !== "goal") continue;
      if (ev.team === "home") home++;
      else if (ev.team === "away") away++;
    }
  }
  return { home, away };
}

const archiveTop = {
  id: "f4",
  homeTeam: "TSV Poggenhagen",
  awayTeam: "SV Resse",
  date: "2026-03-22",
  result: { home: 5, away: 0 },
};

const html = await fetch(TEAM, {
  headers: { "User-Agent": "TSV-Poggenhagen-Diagnose/1.0" },
}).then((r) => r.text());

const link = parseLastMatchLink(html);
console.log("--- parseLastMatchLink ---");
console.log(JSON.stringify(link, null, 2));

if (!link) {
  console.log("ABBRUCH: kein lastLink");
  process.exit(1);
}

const iso = parseGermanShortDateToIso(link.dateLabel);
console.log("parseGermanShortDateToIso(dateLabel):", iso);

const matchHtml = await fetch(link.matchUrl, {
  headers: { "User-Agent": "TSV-Poggenhagen-Diagnose/1.0" },
}).then((r) => r.text());
const data = parseMatchEventsAttr(matchHtml);
const goals = countGoals(data);
console.log("--- goals ---", goals);

const live = goals && iso && {
  id: link.matchUrl.split("/").filter(Boolean).pop(),
  homeTeam: link.homeTeam,
  awayTeam: link.awayTeam,
  date: iso,
  time: link.time,
  result: goals,
};

function sig(m) {
  return `${m.date}|${m.homeTeam.trim()}|${m.awayTeam.trim()}`;
}

const merged = live
  ? [live, archiveTop].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  : [archiveTop];

console.log("--- top after merge sort (live + ein Archiv-Eintrag) ---");
merged.forEach((m, i) =>
  console.log(i, m.date, m.homeTeam, m.result?.home, ":", m.result?.away, m.awayTeam)
);

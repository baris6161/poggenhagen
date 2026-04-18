/** Prüft: href vor „Letztes Spiel:“ = letztes Spiel (Godshorn), nicht Kolenfeld. */
const url =
  "https://www.fussball.de/mannschaft/tsv-poggenhagen-tsv-poggenhagen-niedersachsen/-/saison/2526/team-id/011MIA8IDC000000VTVG0001VTR8C1K7";

const html = await fetch(url, {
  headers: { "User-Agent": "TSV-Poggenhagen-Verify/1.0" },
}).then((r) => r.text());

const marker = "Letztes Spiel:";
const markerIdx = html.indexOf(marker);
const anchorIdx = html.lastIndexOf('<a href="', markerIdx);
const frag = html.slice(anchorIdx, anchorIdx + 700);
const m = frag.match(
  /^<a href="((?:https:\/\/|\/\/)(?:www\.)?fussball\.de\/spiel\/[^"]+\/spiel\/[0-9A-Z]+|\/spiel\/[^"]+\/spiel\/[0-9A-Z]+)"/i
);
const u = m?.[1];
const ok = u?.includes("godshorn") && !u?.includes("kolenfeld");
console.log("extracted", u?.slice(-55), "expects godshorn:", ok);

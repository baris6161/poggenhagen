import assert from "node:assert/strict";
import test from "node:test";
import {
  extractHalfResultBracketText,
  parseScoreFromJsonLd,
  parseScoreFromMetaTitles,
  parseScoreNearEdSpielIdSnippet,
} from "./parse-match-page-score-fallbacks";

test("parseScoreFromMetaTitles: konsistente Titel/Meta", () => {
  const html = `<head>
<title>TSV A - TSV B 3:1 Kreisliga</title>
<meta property="og:title" content="TSV A - TSV B 3:1 Kreisliga" />
</head>`;
  const r = parseScoreFromMetaTitles(html);
  assert.deepEqual(r, { home: 3, away: 1 });
});

test("parseScoreFromMetaTitles: widersprüchliche Werte → null", () => {
  const html = `<title>1:0</title><meta property="og:title" content="0:1" />`;
  assert.equal(parseScoreFromMetaTitles(html), null);
});

test("parseScoreFromMetaTitles: Datum DD.MM.JJJJ wird nicht als Torstand (19:4) gelesen", () => {
  const html = `<head>
<title>TSV Kolenfeld vs TSV Poggenhagen | Kreisliga — Spiel am 19.04.2026</title>
<meta property="og:title" content="TSV Kolenfeld vs TSV Poggenhagen | Kreisliga — Spiel am 19.04.2026" />
</head>`;
  assert.equal(parseScoreFromMetaTitles(html), null);
});

test("parseScoreFromJsonLd: homeScore/awayScore", () => {
  const html = `<script type="application/ld+json">
{"@type":"SportsEvent","homeScore":2,"awayScore":2}
</script>`;
  const r = parseScoreFromJsonLd(html);
  assert.deepEqual(r, { home: 2, away: 2 });
});

test("parseScoreNearEdSpielIdSnippet: heimtore/gasttore", () => {
  const html = `foo edSpielId='02ABC' bar "heimtore": 0, "gasttore": 2 baz`;
  const r = parseScoreNearEdSpielIdSnippet(html);
  assert.deepEqual(r, { home: 0, away: 2 });
});

test("extractHalfResultBracketText", () => {
  const html = `<div class="result"><span class="half-result">[0 : 1]</span></div>`;
  assert.equal(extractHalfResultBracketText(html), "[0 : 1]");
});

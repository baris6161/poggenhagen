import assert from "node:assert/strict";
import test from "node:test";
import {
  parseObfuscatedMatchScoreFromHtmlFragment,
  parseObfuscatedResultScoreFromMatchPageHtml,
} from "./obfuscated-score-glyphs";
import { parseLastMatchLink } from "./parse-last-match";

const TEAM_QUICKVIEW_SNIPPET = `
<div class="match-wrapper">
  <div class="match-meta"><span>Letztes Spiel: So, 19.04.2026</span></div>
  <div class="match-teams"><span class="team-home">TSV Kolenfeld</span><span class="colon"> - </span><span class="team-away">TSV Poggenhagen</span></div>
  <div class="match-score"><span data-obfuscation="5tmjf3yg" class="score-left">&#xE677;</span><span class="colon">:</span><span data-obfuscation="5tmjf3yg" class="score-right">&#xE69F;</span></div>
</div>
`;

const MATCH_PAGE_RESULT_SNIPPET = `
<div class="result"><span class="end-result"><span data-obfuscation="hgjsr0rp" class="score-left">&#xE666;</span><span class="colon">:</span><span data-obfuscation="hgjsr0rp" class="score-right">&#xE65F;</span></span><span class="half-result">[0 : 1]</span></div>
`;

test("parseObfuscatedMatchScoreFromHtmlFragment: Team-Slider 0:2 (Kolenfeld vs Poggenhagen)", () => {
  const r = parseObfuscatedMatchScoreFromHtmlFragment(TEAM_QUICKVIEW_SNIPPET);
  assert.deepEqual(r, { home: 0, away: 2 });
});

test("parseObfuscatedResultScoreFromMatchPageHtml: Spielseite end-result 0:2", () => {
  const r = parseObfuscatedResultScoreFromMatchPageHtml(MATCH_PAGE_RESULT_SNIPPET);
  assert.deepEqual(r, { home: 0, away: 2 });
});

test("parseLastMatchLink: summaryScore aus eingebettetem match-score", () => {
  const html = `<a href="https://www.fussball.de/spiel/tsv-kolenfeld-tsv-poggenhagen/-/spiel/02TPI0COMK000000VS5489BTVV0LE4BT">
<div class="match-wrapper">
  <div class="match-meta"><span>Letztes Spiel: So, 19.04.2026</span><span class="separator"> &#124; </span><span>15:00 &#124; Meisterschaften</span></div>
  <div class="match-teams"><span class="team-home">TSV Kolenfeld</span><span class="colon"> - </span><span class="team-away">TSV Poggenhagen</span></div>
  <div class="match-score"><span data-obfuscation="5tmjf3yg" class="score-left">&#xE677;</span><span class="colon">:</span><span data-obfuscation="5tmjf3yg" class="score-right">&#xE69F;</span></div>
</div>
</a>`;
  const link = parseLastMatchLink(html);
  assert.ok(link);
  assert.equal(link?.summaryScore?.home, 0);
  assert.equal(link?.summaryScore?.away, 2);
});

test("parseObfuscatedMatchScoreFromHtmlFragment: Live-Obfuscation 8uakhw01 (E679:E6AF = 0:2)", () => {
  const snippet = `
<div class="match-score"><span data-obfuscation="8uakhw01" class="score-left">&#xE679;</span><span class="colon">:</span><span data-obfuscation="8uakhw01" class="score-right">&#xE6AF;</span></div>`;
  const r = parseObfuscatedMatchScoreFromHtmlFragment(snippet);
  assert.deepEqual(r, { home: 0, away: 2 });
});

test("parseObfuscatedResultScoreFromMatchPageHtml: Live-Obfuscation zsct19kb (E679:E680 = 0:2)", () => {
  const snippet = `<div class="result"><span class="end-result"><span data-obfuscation="zsct19kb" class="score-left">&#xE679;</span><span class="colon">:</span><span data-obfuscation="zsct19kb" class="score-right">&#xE680;</span></span><span class="half-result">[0 : 1]</span></div>`;
  const r = parseObfuscatedResultScoreFromMatchPageHtml(snippet);
  assert.deepEqual(r, { home: 0, away: 2 });
});

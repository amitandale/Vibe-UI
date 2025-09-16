// lib/coverage/ingest.mjs
// Parse a subset of LCOV text and return a compact summary.
// We compute statement/line/function/branch coverage if present.
// Input can be an LCOV string; we ignore files and aggregate totals.

function pct(hit, total){
  if (!total) return 0;
  return Math.round((hit/total)*1000)/10; // one decimal
}

export function parseLcovSummary(lcovText){
  let linesHit=0, linesFound=0;
  let funcsHit=0, funcsFound=0;
  let branchesHit=0, branchesFound=0;
  const lines = lcovText.split(/\r?\n/);
  for (const ln of lines){
    // Lines: LH:<hit> LF:<found>
    if (ln.startsWith('LH:')) linesHit += Number(ln.slice(3))||0;
    if (ln.startsWith('LF:')) linesFound += Number(ln.slice(3))||0;
    // Functions: FNH:<hit> FNF:<found>
    if (ln.startsWith('FNH:')) funcsHit += Number(ln.slice(4))||0;
    if (ln.startsWith('FNF:')) funcsFound += Number(ln.slice(4))||0;
    // Branches: BRH:<hit> BRF:<found>
    if (ln.startsWith('BRH:')) branchesHit += Number(ln.slice(4))||0;
    if (ln.startsWith('BRF:')) branchesFound += Number(ln.slice(4))||0;
  }
  const summary = {
    lines: { hit: linesHit, found: linesFound, pct: pct(linesHit, linesFound) },
    functions: { hit: funcsHit, found: funcsFound, pct: pct(funcsHit, funcsFound) },
    branches: { hit: branchesHit, found: branchesFound, pct: pct(branchesHit, branchesFound) },
  };
  // legacy: "statements" alias to lines
  summary.statements = { ...summary.lines };
  // overall pct as lines
  summary.pct = summary.lines.pct;
  return summary;
}

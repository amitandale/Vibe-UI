// lib/billing/uiStates.mjs
/** Map summary into UI flags. */
export function computeIndicators(summary){
  const s = summary || {};
  const out = {
    empty: !s.totalUsd && !s.totalTokens,
    nearCap: !!s.softWarn,
    overCap: s.hardExceeded === true || (s.hardCents != null && s.currentCents > s.hardCents),
    softWarn: !!s.softWarn,
  };
  out.blocked = out.overCap;
  return out;
}

export function computeIndicators(summary){
  const soft = summary?.limits?.soft || 0;
  const hard = summary?.limits?.hard || 0;
  const used = summary?.usageUsd || 0;
  return {
    softCap: soft > 0 && used >= soft,
    hardCap: hard > 0 && used >= hard,
    percent: hard > 0 ? Math.min(100, Math.round((used / hard) * 100)) : 0
  };
}

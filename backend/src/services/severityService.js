const calculateSeverity = (category, aiConfidence, incidentDensityNearby) => {
  let baseSeverity = 0.50; // default Other
  
  const categoryLower = String(category).toLowerCase();
  if (categoryLower.includes('harassment')) baseSeverity = 0.65;
  else if (categoryLower.includes('stalking')) baseSeverity = 0.75;
  else if (categoryLower.includes('threat')) baseSeverity = 0.85;
  else if (categoryLower.includes('unsafe area')) baseSeverity = 0.55;
  else if (categoryLower.includes('poor lighting')) baseSeverity = 0.40;
  else if (categoryLower.includes('suspicious activity')) baseSeverity = 0.60;
  
  let severityScore = baseSeverity;
  
  // Factor in AI confidence
  if (aiConfidence > 0.7) {
    severityScore = severityScore * aiConfidence;
  }
  
  // Factor in local density (if > 5 nearby incidents)
  if (incidentDensityNearby > 5) {
    severityScore += 0.1;
  }
  
  // Clamp
  severityScore = Math.max(0.0, Math.min(1.0, severityScore));
  
  let severityLevel = 'MEDIUM';
  if (severityScore < 0.4) severityLevel = 'LOW';
  else if (severityScore > 0.7) severityLevel = 'HIGH';
  
  return {
    severity_score: parseFloat(severityScore.toFixed(3)),
    severity_level: severityLevel
  };
};

module.exports = {
  calculateSeverity
};

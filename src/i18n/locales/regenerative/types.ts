export interface LocalizedPillar {
  title: string;
  tag: string;
  description: string;
  benefits: string[];
  implementation: string;
}

export interface LocalizedRegenerativeUIStrings {
  title: string;
  subtitle: string;
  calibratedFor: string;
  onSoil: string;
  farmVitalityScore: string;
  saving: string;
  savedToFarm: string;
  unableToSave: string;
  purposeTitle: string;
  purposeDesc: (farmName: string, cropName: string) => string;
  activeFarmFallback: string;
  carbonSequestered: string;
  carbonUnit: string;
  acrossSoil: string;
  waterConserved: string;
  waterSavingsUnit: string;
  viaMulch: string;
  activePillarsCount: string;
  pillarsUnit: string;
  clickToAdopt: string;
  pillarsHeading: string;
  clickArrowsExpand: string;
  adoptBtn: string;
  activeBtn: string;
  viewDetails: string;
  collapse: string;
  guideLabel: string;
  benefitsLabel: string;
  pillarSpotlight: string;
  markImplemented: string;
  activeOnFarm: string;
  ecologicalBenefits: string;
  implementationGuide: string;
  pillars: Record<string, LocalizedPillar>;
}

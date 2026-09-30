import { Language } from '../../../types';

export interface LocalizedAgriNNode {
  id: string;
  countryCode: string;
  country: string;
  flag: string;
  institution: string;
  status: string;
  statusType: 'connected' | 'configured';
  focusArea: string;
  agroClimatic: string;
  provider: string;
  dataFreshness: 'LIVE' | 'NEAR_REAL_TIME';
  contributions: string[];
}

export interface LocalizedSharedModule {
  id: string;
  title: string;
  leadCountry: string;
  description: string;
  beneficiaryImpact: string;
  recordsCount: string;
}

export interface LocalizedAgriNUIStrings {
  networkExchangeBadge: string;
  networkExchangeTitle: string;
  bricsSovereignHeading: string;
  liveConnectionStatus: string;
  checkingStatus: string;
  connectingStatus: string;
  onlineVerifiedStatus: string;
  adapterOfflineStatus: string;
  pingingStatus: string;
  offlineStatus: string;
  strictPrivacyTitle: string;
  strictPrivacyDesc: string;
  truthfulTelemetry: string;
  memberNodesLabel: string;
  hideContributions: string;
  viewContributions: string;
  nodeStatusLabel: string;
  pingingRouter: string;
  providerRegistryLabel: string;
  noContributionsText: string;
  sharedModulesTitle: string;
  interoperablePillars: string;
  leaderLabel: string;
  impactLabel: string;
  academicDisclaimerTitle: string;
  academicDisclaimerText: string;
  activeContributions: string;
  nodeLabel: string;
  agronomicSpecialization: string;
  sovereigntyTitle: string;
  sovereigntyHeading: string;
  sovereigntyDesc: string;
  principle1Title: string;
  principle1Desc: string;
  principle2Title: string;
  principle2Desc: string;
  principle3Title: string;
  principle3Desc: string;
  bricsHubsHeading: string;
  nodes: LocalizedAgriNNode[];
  modules: LocalizedSharedModule[];
}

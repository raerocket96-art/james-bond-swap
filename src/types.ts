export interface CausalNode {
  id: string;
  parentId: string | null;
  childrenIds: string[];
  title: string;
  actionTaken: string;
  simulation: any;
  sessionLog: any[];
  history: string[];
  timestamp: number;
  depth: number;
}

export interface SaveSlot {
  id: string; // e.g. "slot-1", "slot-2", "autosave"
  name: string;
  timestamp: number;
  actorId: string;
  filmId: string;
  simulation: any;
  sessionLog: any[];
  sessionSummary: any;
  history: string[];
  treeNodes?: Record<string, CausalNode>;
  activeNodeId?: string | null;
}

export interface BondAttributes {
  coldness: number; // 0-100
  ruthlessness: number;
  compassion: number;
  empathy: number;
  humanity: number;
  humor: number;
  charm: number;
  confidence: number;
  patience: number;
  impulsiveness: number;
  riskTolerance: number;
  violenceThreshold: number;
  loyaltyToMI6: number;
  obedienceToOrders: number;
  independence: number;
  moralBoundaries: number;
  moralValue: number;
  carelessness: number;
  emotionalVulnerability: number;
  willingnessToSacrificeHimself: number;
  willingnessToSacrificeOthers: number;
  attitudeTowardCivilians: string;
  attitudeTowardWomen: string;
  attitudeTowardEnemies: string;
  tacticalIntelligence: number;
  manipulationDeception: number;
  professionalism: number;
}

export interface BondActor {
  id: string;
  name: string;
  era: string;
  description: string;
  attributes: BondAttributes;
}

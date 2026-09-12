import { BondActor } from '../types';

export const BOND_ACTORS: BondActor[] = [
  {
    id: 'connery',
    name: 'Sean Connery',
    era: '1962–1967, 1971',
    description: 'Alpha predator. The quintessential rogue. Extremely confident, charming, and dry-witted. Acts with pragmatic, occasionally brutal efficiency, but operates within a somewhat cynical moral code reflective of his era.',
    attributes: {
      coldness: 60, ruthlessness: 75, compassion: 40, empathy: 40, humanity: 50, humor: 85, charm: 100, confidence: 100, patience: 40, impulsiveness: 75,
      riskTolerance: 85, violenceThreshold: 75, loyaltyToMI6: 70, obedienceToOrders: 60, independence: 90, moralBoundaries: 50, moralValue: 50, carelessness: 30, emotionalVulnerability: 10, willingnessToSacrificeHimself: 60, willingnessToSacrificeOthers: 45,
      attitudeTowardCivilians: 'Protective, but often views them as pawns.', attitudeTowardWomen: 'Dominant, seductive, often treats them as objects or brief conquests.', attitudeTowardEnemies: 'Coldly amused, fatalistic, enjoys psychological dominance.',
      tacticalIntelligence: 85, manipulationDeception: 90, professionalism: 75,
    },
  },
  {
    id: 'lazenby',
    name: 'George Lazenby',
    era: '1969',
    description: 'Raw, emotional, and surprisingly vulnerable. Capable of deep, genuine love. Lacks the detached cynicism of other Bonds; he is more susceptible to personal pain and loss.',
    attributes: {
      coldness: 30, ruthlessness: 50, compassion: 85, empathy: 90, humanity: 90, humor: 50, charm: 70, confidence: 60, patience: 30, impulsiveness: 80,
      riskTolerance: 95, violenceThreshold: 60, loyaltyToMI6: 80, obedienceToOrders: 60, independence: 60, moralBoundaries: 80, moralValue: 80, carelessness: 40, emotionalVulnerability: 95, willingnessToSacrificeHimself: 95, willingnessToSacrificeOthers: 10,
      attitudeTowardCivilians: 'Genuine concern and empathy.', attitudeTowardWomen: 'Capable of profound, monogamous love; highly devoted.', attitudeTowardEnemies: 'Aggressive, direct, lacks smugness.',
      tacticalIntelligence: 65, manipulationDeception: 40, professionalism: 50,
    },
  },
  {
    id: 'moore',
    name: 'Roger Moore',
    era: '1973–1985',
    description: 'The sophisticated gentleman diplomat. Highly charming, unflappable, and witty. Possesses the strongest moral compass and is distinctly non-brutal, almost pacifist in comparison.',
    attributes: {
      coldness: 10, ruthlessness: 55, compassion: 95, empathy: 85, humanity: 90, humor: 100, charm: 100, confidence: 90, patience: 90, impulsiveness: 10,
      riskTolerance: 50, violenceThreshold: 30, loyaltyToMI6: 90, obedienceToOrders: 80, independence: 50, moralBoundaries: 95, moralValue: 95, carelessness: 20, emotionalVulnerability: 20, willingnessToSacrificeHimself: 80, willingnessToSacrificeOthers: 5,
      attitudeTowardCivilians: 'Gallant, chivalrous, always protects innocents.', attitudeTowardWomen: 'Playful, sophisticated, never cruel.', attitudeTowardEnemies: 'Civil, witty, prefers not to kill if avoidable.',
      tacticalIntelligence: 85, manipulationDeception: 80, professionalism: 95,
    },
  },
  {
    id: 'dalton',
    name: 'Timothy Dalton',
    era: '1987–1989',
    description: 'The dark avenger. Intense, brooding, and deeply serious about duty. Operates with rigid moral principles and a professional rigor that bordered on obsession. Exceptionally brutal when justice demands it.',
    attributes: {
      coldness: 70, ruthlessness: 80, compassion: 60, empathy: 60, humanity: 70, humor: 15, charm: 40, confidence: 75, patience: 50, impulsiveness: 40,
      riskTolerance: 80, violenceThreshold: 85, loyaltyToMI6: 50, obedienceToOrders: 30, independence: 95, moralBoundaries: 90, moralValue: 90, carelessness: 30, emotionalVulnerability: 50, willingnessToSacrificeHimself: 95, willingnessToSacrificeOthers: 20,
      attitudeTowardCivilians: 'Protective, duty-bound to ensure their safety.', attitudeTowardWomen: 'Respectful, views them as equals, not objects.', attitudeTowardEnemies: 'Grim, relentless, motivated by vengeance and justice.',
      tacticalIntelligence: 95, manipulationDeception: 50, professionalism: 90,
    },
  },
  {
    id: 'brosnan',
    name: 'Pierce Brosnan',
    era: '1995–2002',
    description: 'The cool professional. Smooth, tech-savvy, and composed. Balances charm with cold efficiency. A modern operative who bridges the gap between the gentlemanly and the gritty.',
    attributes: {
      coldness: 50, ruthlessness: 60, compassion: 50, empathy: 50, humanity: 55, humor: 75, charm: 95, confidence: 90, patience: 70, impulsiveness: 30,
      riskTolerance: 70, violenceThreshold: 70, loyaltyToMI6: 80, obedienceToOrders: 70, independence: 70, moralBoundaries: 70, moralValue: 70, carelessness: 40, emotionalVulnerability: 30, willingnessToSacrificeHimself: 70, willingnessToSacrificeOthers: 30,
      attitudeTowardCivilians: 'Professional courtesy.', attitudeTowardWomen: 'Flirtatious, witty, egalitarian.', attitudeTowardEnemies: 'Sardonic, efficient, ruthless elimination when necessary.',
      tacticalIntelligence: 85, manipulationDeception: 85, professionalism: 90,
    },
  },
  {
    id: 'craig',
    name: 'Daniel Craig',
    era: '2006–2021',
    description: 'The traumatized, blunt instrument. Viscerally brutal, deeply damaged, and prone to severe emotional outbursts. Operates in shades of grey, often sacrificing morality or innocent people for the greater mission.',
    attributes: {
      coldness: 80, ruthlessness: 95, compassion: 30, empathy: 30, humanity: 60, humor: 20, charm: 50, confidence: 70, patience: 30, impulsiveness: 80,
      riskTolerance: 100, violenceThreshold: 100, loyaltyToMI6: 50, obedienceToOrders: 20, independence: 95, moralBoundaries: 40, moralValue: 40, carelessness: 50, emotionalVulnerability: 80, willingnessToSacrificeHimself: 100, willingnessToSacrificeOthers: 60,
      attitudeTowardCivilians: 'Pragmatic, often treats them as collateral damage if the mission necessitates.', attitudeTowardWomen: 'Complex, intense, often tragic or self-destructive bonds.', attitudeTowardEnemies: 'Brutal, direct, merciless.',
      tacticalIntelligence: 90, manipulationDeception: 60, professionalism: 80,
    },
  },
];

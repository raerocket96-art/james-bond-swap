export interface FilmContext {
  id: string;
  title: string;
  year: number;
  originalActor: string;
  era: string;
  setting: string[];
  villains: string[];
  allies: string[];
  gadgets: string[];
  vehicles: string[];
  weapons: string[];
  technology: string;
  initialObjective: string;
  openingScene: {
    title: string;
    description: string;
    situation: string;
    choices: string[];
  };
}

export const BOND_FILMS: FilmContext[] = [
  {
    id: 'dr-no',
    title: 'Dr. No',
    year: 1962,
    originalActor: 'Sean Connery',
    era: 'Early 1960s Cold War',
    setting: ['Jamaica', 'Crab Key'],
    villains: ['Dr. Julius No', 'Professor Dent', 'Three Blind Mice'],
    allies: ['Felix Leiter', 'Honey Ryder', 'Quarrel', 'M'],
    gadgets: ['Geiger counter', 'LANSU watch (basic)', 'Underwater breathing apparatus'],
    vehicles: ['Sunbeam Alpine', 'Bamboo Raft', 'Motorboat'],
    weapons: ['Walther PPK', 'Suppressed Beretta'],
    technology: '1962 Analog tech, early nuclear radio jammer, dragon tank (flamethrower)',
    initialObjective: 'Investigate the disappearance of MI6 station chief John Strangways in Jamaica.',
    openingScene: {
      title: 'Scene 1: Kingston Arrival & Strangways Investigation',
      description: 'Bond arrives in Kingston, Jamaica, and immediately discovers Strangways’ office has been ransacked and his secretary is missing. Assassins attempt to poison him via a chauffeur.',
      situation: 'Bond is stranded in Jamaica with minimal gadgetry, facing unknown local assassins.',
      choices: [
        'Expose the fake chauffeur immediately and interrogate him aggressively.',
        'Play along quietly to trace the assassins back to Professor Dent.',
        'Infiltrate Strangways\' house alone at night to search for clues.'
      ]
    }
  },
  {
    id: 'goldfinger',
    title: 'Goldfinger',
    year: 1964,
    originalActor: 'Sean Connery',
    era: 'Mid 1960s',
    setting: ['Miami', 'Switzerland', 'Kentucky / Fort Knox'],
    villains: ['Auric Goldfinger', 'Oddjob', 'Pussy Galore'],
    allies: ['Felix Leiter', 'Jill Masterson', 'Tilly Masterson', 'Q'],
    gadgets: ['DB5 tracking beacon (Goldfinger tracker)', 'Explosive pen', 'GPR locator'],
    vehicles: ['Aston Martin DB5 (with ejector seat and machine guns)'],
    weapons: ['Walther PPK', 'Golden gun (Scaramanga note: standard PPK)'],
    technology: '1964 Tracking devices, industrial lasers, suitcase atomic bomb',
    initialObjective: 'Expose how Auric Goldfinger is smuggling gold internationally.',
    openingScene: {
      title: 'Scene 1: Miami Hotel Encounter',
      description: 'Bond observes Goldfinger cheating at cards in Miami and intercepts him by seducing Jill Masterson.',
      situation: 'Bond has eyes on Goldfinger and must decide how to confront or compromise him.',
      choices: [
        'Seduce Jill Masterson and blackmail Goldfinger publicly at the card table.',
        'Use stealth and wiretapping in Goldfinger\'s hotel suite to uncover smuggling ledgers.',
        'Directly confront Goldfinger with physical intimidation.'
      ]
    }
  },
  {
    id: 'goldeneye',
    title: 'GoldenEye',
    year: 1995,
    originalActor: 'Pierce Brosnan',
    era: 'Post-Cold War 1995',
    setting: ['Arkhangelsk (USSR/Russia)', 'St. Petersburg', 'Cuba'],
    villains: ['Alec Trevelyan (006)', 'Xenia Onatopp', 'General Ourumov'],
    allies: ['Natalya Simonova', 'Jack Wade', 'Q', 'M (Judi Dench)', 'Moneypenny'],
    gadgets: ['Laser watch (Omega)', 'Pitier pen grenade', 'Rappel belt'],
    vehicles: ['Aston Martin DB5', 'T55 Battle Tank', 'Z8 / Helicopter'],
    weapons: ['Walther PPK', 'AK-47 / MP5'],
    technology: '1995 Analog-Digital transition, Soviet satellite EMP weapon (GoldenEye)',
    initialObjective: 'Investigate the theft of the Soviet satellite weapon from Severnaya.',
    openingScene: {
      title: 'Scene 1: Arkhangelsk Chemical Facility Infiltration',
      description: 'Bond and 006 infiltrate the Soviet chemical weapons facility. Alec Trevelyan is seemingly captured and executed by Ourumov.',
      situation: 'Facility alarms are blaring, explosives are set, and 006 is captured.',
      choices: [
        'Abandon stealth immediately and shoot way through guards to rescue 006.',
        'Follow original timeline: complete timer sabotage and escape via plane.',
        'Pursue Colonel Ourumov directly into the chemical tanks.'
      ]
    }
  },
  {
    id: 'casino-royale',
    title: 'Casino Royale',
    year: 2006,
    originalActor: 'Daniel Craig',
    era: 'Modern 2006',
    setting: ['Prague', 'Madagascar', 'Bahamas', 'Montenegro', 'Venice'],
    villains: ['Le Chiffre', 'Mr. White', 'Dmitri Valenstein'],
    allies: ['Vesper Lynd', 'Felix Leiter', 'M (Judi Dench)', 'René Mathis'],
    gadgets: ['Encrypted Sony Ericsson smartphone', 'Medical tracking microchip in arm'],
    vehicles: ['Aston Martin DBS', 'Ford Mondeo'],
    weapons: ['Walther P99', 'Combat knife'],
    technology: 'Modern 2006 digital hacking, cellular tracking, financial wire transfers',
    initialObjective: 'Bankrupt terrorist financier Le Chiffre in a high-stakes poker tournament in Montenegro.',
    openingScene: {
      title: 'Scene 1: Madagascar Embassy Ambush',
      description: 'Bond pursues bomb-maker Mollaka through a crowded embassy and construction site in Madagascar.',
      situation: 'High-profile shootout inside a foreign embassy captured on live television.',
      choices: [
        'Shoot Mollaka dead on the spot to retrieve his phone immediately (ignoring diplomatic immunity).',
        'Capture Mollaka alive for interrogation, risking escape or international fallout.',
        'Use explosive breach through embassy walls to capture him.'
      ]
    }
  },
  { id: 'frwl', title: 'From Russia with Love', year: 1963, originalActor: 'Sean Connery', era: '1963', setting: ['Istanbul'], villains: ['Rosa Klebb'], allies: ['Kerim Bey', 'Tatiana'], gadgets: ['Briefcase'], vehicles: ['Bentley'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Retrieve Lektor.', openingScene: { title: 'Training', description: 'Grant hunting Bond.', situation: 'In training.', choices: ['Fight', 'Hide', 'Call M'] } },
  { id: 'thunderball', title: 'Thunderball', year: 1965, originalActor: 'Sean Connery', era: '1965', setting: ['Bahamas'], villains: ['Emilio Largo'], allies: ['Felix Leiter'], gadgets: ['Jetpack'], vehicles: ['DB5'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Recover nukes.', openingScene: { title: 'Valencay', description: 'Assassination.', situation: 'At chateau.', choices: ['Kill', 'Escape', 'Hide'] } },
  { id: 'yolt', title: 'You Only Live Twice', year: 1967, originalActor: 'Sean Connery', era: '1967', setting: ['Japan'], villains: ['Blofeld'], allies: ['Tanaka'], gadgets: ['Little Nellie'], vehicles: ['Toyota 2000GT'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Prevent space war.', openingScene: { title: 'Orbit', description: 'Hijacking.', situation: 'In space.', choices: ['Track', 'Wait', 'Report'] } },
  { id: 'ohmss', title: 'On Her Majesty\'s Secret Service', year: 1969, originalActor: 'George Lazenby', era: '1969', setting: ['Switzerland'], villains: ['Blofeld'], allies: ['Tracy'], gadgets: ['Radio'], vehicles: ['DBS'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Find Blofeld.', openingScene: { title: 'Beach', description: 'Rescuing Tracy.', situation: 'On beach.', choices: ['Save', 'Ignore', 'Call'] } },
  { id: 'daf', title: 'Diamonds Are Forever', year: 1971, originalActor: 'Sean Connery', era: '1971', setting: ['Las Vegas'], villains: ['Blofeld'], allies: ['Tiffany Case'], gadgets: ['Voice synth'], vehicles: ['Mustang'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Stop smuggling.', openingScene: { title: 'Vengeance', description: 'Tracking Blofeld.', situation: 'On mission.', choices: ['Interrogate', 'Kill', 'Track'] } },
  { id: 'lald', title: 'Live and Let Die', year: 1973, originalActor: 'Roger Moore', era: '1973', setting: ['New Orleans'], villains: ['Mr. Big'], allies: ['Felix Leiter'], gadgets: ['Magnetic watch'], vehicles: ['Boat'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Investigate murders.', openingScene: { title: 'UN HQ', description: 'Agent killed.', situation: 'At UN.', choices: ['Investigate', 'Infiltrate', 'Report'] } },
  { id: 'mwitgg', title: 'The Man with the Golden Gun', year: 1974, originalActor: 'Roger Moore', era: '1974', setting: ['Thailand'], villains: ['Scaramanga'], allies: ['Goodnight'], gadgets: ['Golden Gun'], vehicles: ['AMC Hornet'], weapons: ['Golden Gun'], technology: 'Analog', initialObjective: 'Find Solex.', openingScene: { title: 'Island', description: 'Target practice.', situation: 'On island.', choices: ['Stealth', 'Attack', 'Hide'] } },
  { id: 'tswlm', title: 'The Spy Who Loved Me', year: 1977, originalActor: 'Roger Moore', era: '1977', setting: ['Sardinia'], villains: ['Stromberg'], allies: ['Anya'], gadgets: ['Lotus Esprit'], vehicles: ['Lotus Esprit'], weapons: ['Walther PPK'], technology: 'Analog', initialObjective: 'Recover microfilm.', openingScene: { title: 'Ski Jump', description: 'Escape.', situation: 'In Alps.', choices: ['Jump', 'Fight', 'Hide'] } },
  { id: 'moonraker', title: 'Moonraker', year: 1979, originalActor: 'Roger Moore', era: '1979', setting: ['Space'], villains: ['Drax'], allies: ['Goodhead'], gadgets: ['Dart'], vehicles: ['Shuttle'], weapons: ['Walther PPK'], technology: 'Analog/Early Digital', initialObjective: 'Investigate shuttle.', openingScene: { title: 'In-Flight', description: 'Jump.', situation: 'In air.', choices: ['Deploy', 'Wait', 'Fight'] } },
  { id: 'fyEO', title: 'For Your Eyes Only', year: 1981, originalActor: 'Roger Moore', era: '1981', setting: ['Greece'], villains: ['Kristatos'], allies: ['Melina'], gadgets: ['Decryption'], vehicles: ['Lotus'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Recover ATAC.', openingScene: { title: 'Cemetery', description: 'Visiting grave.', situation: 'At grave.', choices: ['Depart', 'Wait', 'Track'] } },
  { id: 'octopussy', title: 'Octopussy', year: 1983, originalActor: 'Roger Moore', era: '1983', setting: ['India'], villains: ['Khan'], allies: ['Octopussy'], gadgets: ['Egg'], vehicles: ['Acrostar Jet'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Investigate egg.', openingScene: { title: 'Cuba', description: 'Infiltration.', situation: 'At airbase.', choices: ['Stealth', 'Attack', 'Hide'] } },
  { id: 'avtak', title: 'A View to a Kill', year: 1985, originalActor: 'Roger Moore', era: '1985', setting: ['Siberia'], villains: ['Zorin'], allies: ['Stacey'], gadgets: ['Snowboard'], vehicles: ['Renault'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Retrieve chip.', openingScene: { title: 'Siberia', description: 'Escape.', situation: 'In snow.', choices: ['Ski', 'Fight', 'Hide'] } },
  { id: 'tld', title: 'The Living Daylights', year: 1987, originalActor: 'Timothy Dalton', era: '1987', setting: ['Afghanistan'], villains: ['Whitaker'], allies: ['Kara'], gadgets: ['Cello case'], vehicles: ['Aston Martin'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Defect General.', openingScene: { title: 'Gibraltar', description: 'Exercise.', situation: 'At training.', choices: ['Complete', 'Quit', 'Report'] } },
  { id: 'ltk', title: 'Licence to Kill', year: 1989, originalActor: 'Timothy Dalton', era: '1989', setting: ['Mexico'], villains: ['Sanchez'], allies: ['Pam'], gadgets: ['Laser'], vehicles: ['Truck'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Avenge Felix.', openingScene: { title: 'Key West', description: 'Wedding.', situation: 'At wedding.', choices: ['Celebrate', 'Leave', 'Track'] } },
  { id: 'tnd', title: 'Tomorrow Never Dies', year: 1997, originalActor: 'Pierce Brosnan', era: '1997', setting: ['Vietnam'], villains: ['Carver'], allies: ['Wai Lin'], gadgets: ['Phone'], vehicles: ['BMW'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Stop Carver.', openingScene: { title: 'Arms Fair', description: 'Infiltration.', situation: 'At fair.', choices: ['Stealth', 'Attack', 'Infiltrate'] } },
  { id: 'twine', title: 'The World Is Not Enough', year: 1999, originalActor: 'Pierce Brosnan', era: '1999', setting: ['Istanbul'], villains: ['Renard'], allies: ['Christmas'], gadgets: ['Glasses'], vehicles: ['BMW'], weapons: ['Walther PPK'], technology: 'Digital', initialObjective: 'Protect oil.', openingScene: { title: 'Bilbao', description: 'Bank.', situation: 'At bank.', choices: ['Talk', 'Stealth', 'Attack'] } },
  { id: 'dad', title: 'Die Another Day', year: 2002, originalActor: 'Pierce Brosnan', era: '2002', setting: ['North Korea'], villains: ['Graves'], allies: ['Jinx'], gadgets: ['Invisible car'], vehicles: ['Vanquish'], weapons: ['Walther PPK'], technology: 'Advanced Digital', initialObjective: 'Exchange.', openingScene: { title: 'Surfing', description: 'Infiltration.', situation: 'On beach.', choices: ['Surf', 'Hide', 'Attack'] } },
  { id: 'qos', title: 'Quantum of Solace', year: 2008, originalActor: 'Daniel Craig', era: '2008', setting: ['Bolivia'], villains: ['Greene'], allies: ['Camille'], gadgets: ['Earpiece'], vehicles: ['DBS'], weapons: ['PPK'], technology: 'Modern', initialObjective: 'Investigate.', openingScene: { title: 'Car Chase', description: 'Transport.', situation: 'In car.', choices: ['Race', 'Fight', 'Stop'] } },
  { id: 'skyfall', title: 'Skyfall', year: 2012, originalActor: 'Daniel Craig', era: '2012', setting: ['Scotland'], villains: ['Silva'], allies: ['Eve'], gadgets: ['Gun'], vehicles: ['DB5'], weapons: ['PPK'], technology: 'Modern Cyber', initialObjective: 'Recover list.', openingScene: { title: 'Istanbul', description: 'Pursuit.', situation: 'On motorcycle.', choices: ['Chase', 'Stop', 'Report'] } },
  { id: 'spectre', title: 'Spectre', year: 2015, originalActor: 'Daniel Craig', era: '2015', setting: ['Morocco'], villains: ['Blofeld'], allies: ['Madeleine'], gadgets: ['Watch'], vehicles: ['DB10'], weapons: ['PPK'], technology: 'Modern', initialObjective: 'Track Spectre.', openingScene: { title: 'Mexico', description: 'Assassination.', situation: 'At festival.', choices: ['Infiltrate', 'Assassinate', 'Escape'] } },
  { id: 'nttd', title: 'No Time to Die', year: 2021, originalActor: 'Daniel Craig', era: '2021', setting: ['Norway'], villains: ['Safin'], allies: ['Nomi'], gadgets: ['EMP'], vehicles: ['DB5'], weapons: ['PPK'], technology: 'Modern Nanotech', initialObjective: 'Rescue.', openingScene: { title: 'Matera', description: 'Grave.', situation: 'At grave.', choices: ['Visit', 'Hide', 'Attack'] } }
];

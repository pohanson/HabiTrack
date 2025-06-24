// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_eminent_wild_pack.sql';
import m0001 from './0001_purple_sheva_callister.sql';
import m0002 from './0002_known_random.sql';
import m0003 from './0003_conscious_jocasta.sql';
import m0004 from './0004_mighty_smiling_tiger.sql';
import m0005 from './0005_jazzy_punisher.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
  },
};

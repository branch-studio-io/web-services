import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260208_230924 from './20260208_230924';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260208_230924.up,
    down: migration_20260208_230924.down,
    name: '20260208_230924',
  },
];

import * as migration_20260510_152346_initial_schema from './20260510_152346_initial_schema';
import * as migration_20260602_220540_rsvp_unify_wa from './20260602_220540_rsvp_unify_wa';
import * as migration_20260608_000000_rsvp_confirmation_status from './20260608_000000_rsvp_confirmation_status';

export const migrations = [
  {
    up: migration_20260510_152346_initial_schema.up,
    down: migration_20260510_152346_initial_schema.down,
    name: '20260510_152346_initial_schema',
  },
  {
    up: migration_20260602_220540_rsvp_unify_wa.up,
    down: migration_20260602_220540_rsvp_unify_wa.down,
    name: '20260602_220540_rsvp_unify_wa'
  },
  {
    up: migration_20260608_000000_rsvp_confirmation_status.up,
    down: migration_20260608_000000_rsvp_confirmation_status.down,
    name: '20260608_000000_rsvp_confirmation_status'
  },
];

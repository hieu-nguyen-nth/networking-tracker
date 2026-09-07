import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

import { publicEnv } from "@/config/public-env";
import type { Database } from "@/lib/neon/database.types";

export const neonClient = createClient<Database>({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: publicEnv.neonAuthUrl,
  },
  dataApi: {
    url: publicEnv.neonDataApiUrl,
  },
});

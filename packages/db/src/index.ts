import { env } from "@encre/env/server";
import { PrismaPg } from "@prisma/adapter-pg";

import { type Prisma, PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
export type { Prisma };

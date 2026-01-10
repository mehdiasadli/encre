import { z } from "zod";

export const PartnerTypeSchema = z.enum(["spouse", "lover", "unknown"]);

export type PartnerTypeType = `${z.infer<typeof PartnerTypeSchema>}`;

export default PartnerTypeSchema;

import { z } from "zod";

export const GenderSchema = z.enum([
	"male",
	"female",
	"not_specified",
	"other",
]);

export type GenderType = `${z.infer<typeof GenderSchema>}`;

export default GenderSchema;

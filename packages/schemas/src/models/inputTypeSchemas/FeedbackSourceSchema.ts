import { z } from "zod";

export const FeedbackSourceSchema = z.enum(["website"]);

export type FeedbackSourceType = `${z.infer<typeof FeedbackSourceSchema>}`;

export default FeedbackSourceSchema;

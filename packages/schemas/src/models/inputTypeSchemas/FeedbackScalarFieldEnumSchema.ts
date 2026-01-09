import { z } from "zod";

export const FeedbackScalarFieldEnumSchema = z.enum([
	"id",
	"createdAt",
	"updatedAt",
	"status",
	"source",
	"priority",
	"userId",
	"ipAddress",
	"userAgent",
	"name",
	"email",
	"type",
	"subject",
	"content",
	"image",
	"response",
	"responseAt",
	"responseById",
]);

export default FeedbackScalarFieldEnumSchema;

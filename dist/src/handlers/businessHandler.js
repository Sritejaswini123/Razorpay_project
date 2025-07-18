import { sendMarketingTemplate, createWhatsappTemplateService, getWhatsappTemplatesService, getWhatsappTemplateByNameService } from "../service/templateServices";
import { z } from "zod";
//for marketing template - using the created template by meta
const requestSchema = z.object({
    phone: z.string(),
    templateName: z.string(),
    languageCode: z.string(),
    headerImageUrl: z.string().url(),
});
export const sendTemplateHandler = async (c) => {
    try {
        const body = await c.req.json();
        const parsed = requestSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ error: "Invalid request", details: parsed.error.errors }, 400);
        }
        const { phone, templateName, languageCode, headerImageUrl } = parsed.data;
        const result = await sendMarketingTemplate(phone, templateName, languageCode, headerImageUrl);
        return c.json({ message: "Template sent successfully", result });
    }
    catch (error) {
        console.error(error);
        return c.json({ error: "Failed to send template", details: error.message }, 500);
    }
};
// handlers/createWhatsappTemplateHandler.ts
const bodySchema = z.object({
    name: z.string(),
    category: z.string(),
    language: z.string(),
    header: z.string(),
    body: z.string(),
    footer: z.string(),
    button: z.string(),
});
export const createWhatsappTemplateHandler = async (c) => {
    const body = await c.req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: parsed.error.format() }, 400);
    }
    try {
        const data = await createWhatsappTemplateService(parsed.data);
        return c.json({
            message: "WhatsApp template created and stored successfully",
            data,
        }, 201);
    }
    catch (error) {
        console.error(error);
        return c.json({
            error: error.message || "An error occurred while creating WhatsApp template",
        }, 500);
    }
};
//get the templates
export const getWhatsappTemplatesHandler = async (c) => {
    try {
        const templates = await getWhatsappTemplatesService();
        return c.json({ message: "Templates fetched successfully", data: templates });
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        return c.json({ error: error.response?.data || "Error fetching templates" }, 500);
    }
};
//get the template by name 
export const getWhatsappTemplateByNameHandler = async (c) => {
    try {
        const templateName = c.req.param("templateName"); // from /template/:templateName route
        if (!templateName) {
            return c.json({ error: "Template name is required in URL parameter" }, 400);
        }
        const template = await getWhatsappTemplateByNameService(templateName);
        return c.json({
            message: `Template '${templateName}' fetched successfully`,
            data: template,
        });
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        return c.json({ error: error.response?.data || error.message || "Error fetching template" }, 500);
    }
};

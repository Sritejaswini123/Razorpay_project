import axios from "axios";
import { config, Client } from "../config/whatsappConfig";
import db from "../database/db";
import { createTemplate } from "../database/schemas/createTemplate";
//for marketing template - using the created template by meta
export const sendMarketingTemplate = async (to, templateName, languageCode, headerImageUrl) => {
    const url = `${config.FB_GRAPH_URL}/${config.FB_VERSION}/${config.WABA_ID}/messages`;
    const payload = { messaging_product: "whatsapp", to, type: "template",
        template: {
            name: templateName,
            language: {
                code: languageCode,
            },
            components: [
                {
                    type: "header",
                    parameters: [
                        {
                            type: "image",
                            image: {
                                link: headerImageUrl,
                            },
                        },
                    ],
                },
            ],
        },
    };
    const headers = {
        Authorization: `Bearer ${config.AUTH_TOKEN}`,
        "Content-Type": "application/json",
    };
    const response = await axios.post(url, payload, { headers });
    return response.data;
};
const ALLOWED_CATEGORIES = ["MARKETING", "UTILITY", "AUTHENTICATION"];
const ALLOWED_LANGUAGES = ["en_US", "en_GB", "hi", "es", "fr", "de", "it", "pt_BR"];
export const createWhatsappTemplateService = async ({ name, category, language, body, header, footer, button, buttonUrl, }) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const wabaId = process.env.WABA_ID;
    if (!accessToken || !wabaId) {
        throw new Error("Missing META_ACCESS_TOKEN or WABA_ID in environment");
    }
    // Inline formatTemplateName implementation
    const formatTemplateName = (name) => {
        return name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    };
    const formattedName = formatTemplateName(name);
    const upperCategory = category.toUpperCase();
    if (!ALLOWED_CATEGORIES.includes(upperCategory)) {
        throw new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`);
    }
    if (!ALLOWED_LANGUAGES.includes(language)) {
        throw new Error(`Invalid language code. Allowed: ${ALLOWED_LANGUAGES.join(", ")}`);
    }
    if (!body || body.length < 1) {
        throw new Error("Body text is required");
    }
    const components = [
        {
            type: "HEADER",
            format: "TEXT",
            text: header,
        },
        {
            type: "BODY",
            text: body,
        },
        {
            type: "FOOTER",
            text: footer,
        }
    ];
    if (button && buttonUrl) {
        components.push({
            type: "BUTTONS",
            buttons: [
                {
                    type: "URL",
                    text: button,
                    url: buttonUrl,
                }
            ]
        });
    }
    const payload = {
        name: formattedName,
        category: upperCategory,
        language,
        components,
    };
    try {
        const response = await Client.post(`${wabaId}/message_templates?access_token=${accessToken}`, payload);
        const createdTemplate = response.data;
        // Insert into your Drizzle table after successful creation
        await db.insert(createTemplate).values({
            templateName: createdTemplate.name || formattedName,
            template_id: createdTemplate.id || createdTemplate.template_id || crypto.randomUUID(),
            language: createdTemplate.language,
            category: createdTemplate.category,
            status: createdTemplate.status || "PENDING",
            components: createdTemplate.components,
        });
        return createdTemplate;
    }
    catch (error) {
        if (error.response?.data) {
            throw new Error(`Meta API Error: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
};
//get templates
export const getWhatsappTemplatesService = async () => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const wabaId = process.env.WABA_ID;
    if (!accessToken || !wabaId) {
        throw new Error("Missing META_ACCESS_TOKEN or WABA_ID in environment");
    }
    const response = await Client.get(`${wabaId}/message_templates?access_token=${accessToken}`);
    return response.data;
};
// getWhatsappTemplateByNameService.ts
export const getWhatsappTemplateByNameService = async (templateName) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const wabaId = process.env.WABA_ID;
    if (!accessToken || !wabaId) {
        throw new Error("Missing META_ACCESS_TOKEN or WABA_ID in environment");
    }
    const response = await Client.get(`${wabaId}/message_templates?access_token=${accessToken}`);
    const templates = response.data.data;
    const template = templates.find((t) => t.name === templateName);
    if (!template) {
        throw new Error(`Template with name '${templateName}' not found`);
    }
    return template;
};

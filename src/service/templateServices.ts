import axios from "axios";
import { config, Client } from "../config/whatsappConfig";
import db from "../database/db";
import { createTemplate } from "../database/schemas/createTemplate";
//for marketing template - using the created template by meta
export const sendMarketingTemplate = async (
  to: string,
  templateName: string,
  languageCode: string,
  headerImageUrl: string
) => {
  const url = `${config.FB_GRAPH_URL}/${config.FB_VERSION}/${config.WABA_ID}/messages`;
  const payload = {messaging_product: "whatsapp",to,type: "template",
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


//creating the template from the backend  --- template services
interface CreateTemplateParams {
  name: string;
  category: string;
  language: string;
  header?: string;
  body: string;
  footer?: string;
  button?: string;
  buttonUrl?: string;
  buttonType?: string;
}

const ALLOWED_CATEGORIES = ["MARKETING", "UTILITY", "AUTHENTICATION"];
const ALLOWED_LANGUAGES = ["en_US", "en_GB", "hi", "es", "fr", "de", "it", "pt_BR", "en"];

export const createWhatsappTemplateService = async ({
  name,
  category,
  language,
  body,
  header,
  footer,
  button,
  buttonUrl,
}: CreateTemplateParams) => {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const wabaId = process.env.WABA_ID;

  if (!accessToken || !wabaId) {
    throw new Error("Missing META_ACCESS_TOKEN or WABA_ID in environment");
  }

  // Inline formatTemplateName implementation
  const formatTemplateName = (name: string): string => {
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

  // Build components array for Meta API
  const components: any[] = [];

  // Add header if provided
  if (header) {
    components.push({
      type: "HEADER",
      format: "TEXT",
      text: header,
    });
  }

  // Add body (required)
  components.push({
    type: "BODY",
    text: body,
  });

  // Add footer if provided
  if (footer) {
    components.push({
      type: "FOOTER",
      text: footer,
    });
  }

  // Add button if provided
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
    const response = await Client.post(
      `${wabaId}/message_templates?access_token=${accessToken}`,
      payload
    );

    const createdTemplate = response.data;

    // FIXED: Store the actual components from the API response OR the payload components
    // The API might return the same components or modified ones
    const componentsToStore = createdTemplate.components || components;

    // Insert into your Drizzle table after successful creation
    await db.insert(createTemplate).values({
      templateName: createdTemplate.name || formattedName,
      template_id: createdTemplate.id || createdTemplate.template_id || crypto.randomUUID(),
      language: createdTemplate.language || language,
      category: createdTemplate.category || upperCategory,
      status: createdTemplate.status || "PENDING",
      components: componentsToStore, // This should now work correctly
    });

    return createdTemplate;
  } catch (error: any) {
    console.error("Template creation error:", error);
    
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
  const response = await Client.get(
    `${wabaId}/message_templates?access_token=${accessToken}`
  );
  return response.data;
};



// getWhatsappTemplateByNameService.ts
export const getWhatsappTemplateByNameService = async (templateName: string) => {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const wabaId = process.env.WABA_ID;
  if (!accessToken || !wabaId) {
    throw new Error("Missing META_ACCESS_TOKEN or WABA_ID in environment");
  }
  const response = await Client.get(
    `${wabaId}/message_templates?access_token=${accessToken}`
  );
  const templates = response.data.data; 
  const template = templates.find((t: any) => t.name === templateName);
  if (!template) {
    throw new Error(`Template with name '${templateName}' not found`);
  }
  return template;
};









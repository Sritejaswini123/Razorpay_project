// routes/webhooks.ts
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import db from '../database/db';
import { createTemplate } from '../database/schemas/createTemplate';

const webhook = new Hono();

// Meta webhook verification (for initial setup)
webhook.get('/meta', async (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return c.text(challenge || '', 200);
  }
  return c.text('Verification failed', 403);
});


// Receive webhook updates from Meta
webhook.post('/meta', async (c) => {
  const body = await c.req.json();

  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const templateData = changes?.value?.message_template;

    const status = templateData?.status;
    const name = templateData?.name;

    // Only update if relevant status is present
    if (status && name && ['APPROVED', 'REJECTED', 'IN_REVIEW'].includes(status)) {
      await db
        .update(createTemplate)
        .set({ status: status.toLowerCase() })
        .where(eq(createTemplate.templateName, name));

      return c.json({ success: true, updated: name, status }, 200);
    }

    return c.json({ ignored: true }, 200);
  } catch (err) {
    console.error("Webhook error:", err);
    return c.json({ error: 'Invalid webhook format or DB error' }, 500);
  }
});

export default webhook;

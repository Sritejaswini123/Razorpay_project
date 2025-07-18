import { Hono } from "hono";
import {  sendTemplateHandler,  createWhatsappTemplateHandler, getWhatsappTemplatesHandler, getWhatsappTemplateByNameHandler } from "../handlers/businessHandler";

const whatsappRoute = new Hono();
whatsappRoute.post("/send-template", sendTemplateHandler);
whatsappRoute.post("/create-template", createWhatsappTemplateHandler)
whatsappRoute.get("/get-templates", getWhatsappTemplatesHandler)
whatsappRoute.get("/template/:templateName", getWhatsappTemplateByNameHandler);
export default whatsappRoute;

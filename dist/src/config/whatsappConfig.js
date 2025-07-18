import "dotenv/config";
import axios from 'axios';
//for using the template that is created in the web whatsapp api
export const config = {
    FB_GRAPH_URL: process.env.FB_GRAPH_URL,
    FB_VERSION: process.env.FB_VERSION,
    WABA_ID: process.env.WABA_ID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
};
// for creating the template via api
//axios:simplifies making HTTP requests to external APIs like the Meta
export const Client = axios.create({
    baseURL: "https://graph.facebook.com/v22.0/",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, //The HTTP request will timeout if the API does not respond within time
});

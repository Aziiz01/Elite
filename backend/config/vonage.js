import { Vonage } from "@vonage/server-sdk";

const apiKey = process.env.VONAGE_API_KEY;
const apiSecret = process.env.VONAGE_API_SECRET;

const vonage = apiKey && apiSecret ? new Vonage({ apiKey, apiSecret }) : null;

export default vonage;

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { NextApiRequest, NextApiResponse } from 'next';
import { endpoint, azureApiKey } from "../Keys";
import { initialize } from "./chain";
if (!endpoint) {
  throw new Error("Environment variable AZURE_OPENAI_ENDPOINT must be set");
}

if (!azureApiKey) {
  throw new Error("Environment variable AZURE_OPENAI_KEY must be set");
}

export default async function handleChat(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await initialize(query);

    res.json({ message: response });
  } catch (err: any) {
    console.error("Error during RAG request:", err);
    res.status(500).json({ error: `Error during RAG request: ${err.message || err}` });
  }
}

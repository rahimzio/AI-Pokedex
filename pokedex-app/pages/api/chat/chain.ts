import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { globalAiKey, globalInstanceName, globalDeploymentName, globalApiVersion, pineconeIndex, embeddings } from "../Keys";
import { formatDocumentsAsString } from "langchain/util/document";

function formatDocumentsWithMetadata(documents:any) {
  return documents.map((doc: { metadata: { name: any; stats: any; types: any; weight: any; height: any;}; }) => {
    const { name, stats, types, weight, height } = doc.metadata;
    return `
      Name: ${name}
      Stats: ${stats}
      Types: ${types}
      Weight: ${weight}kg
      Height: ${height}m
    `;
  }).join('\n\n');
}

export async function initialize(query: string) {
  const pineVectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
  const retriever = pineVectorStore.asRetriever();
  const contextDocuments = await retriever.invoke(query);
  const context = formatDocumentsWithMetadata(contextDocuments);
  console.log("context:", context);

  const prompt = PromptTemplate.fromTemplate(`
    You are a Pokedex from the Series Pokemon.
    Answer the question only based only on the following contex.
    Context:${context}

    Question: ${query}
  `);

  const model = new ChatOpenAI({
    azureOpenAIApiKey: globalAiKey,
    azureOpenAIApiInstanceName: globalInstanceName,
    azureOpenAIApiDeploymentName: globalDeploymentName,
    azureOpenAIApiVersion: globalApiVersion,
  });

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);
  const result = await chain.invoke(query);
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    const answer = await initialize(query);
    res.status(200).json(answer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}

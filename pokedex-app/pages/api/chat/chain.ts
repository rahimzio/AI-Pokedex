import { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import { PromptTemplate } from "@langchain/core/prompts";
import { PineconeStore } from "@langchain/pinecone";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { globalAiKey, globalInstanceName, globalDeploymentName, globalApiVersion, pineconeIndex, embeddings } from "../Keys";

export async function initialize(query: string) {
  const pineVectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
  const retriever = pineVectorStore.asRetriever();

  const prompt = PromptTemplate.fromTemplate(`
    You are a Pokedex from the Series Pokemon.
    Answer the question based only on the following context:
    {context}

    Question: {question}
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
  return result
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    const Answer = await initialize(query);
    res.status(200).json(Answer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
}

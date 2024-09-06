import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

export const langchainTracing = process.env.LANGCHAIN_TRACING_V2;
export const langchainApiKey = process.env.LANGCHAIN_API_KEY;
export const langchainProject = process.env.LANGCHAIN_PROJECT;
export const globalPineKey = process.env.PINECONE_API_KEY || "";
export const globalAiKey = process.env.AZURE_OPENAI_API_KEY2;
export const globalInstanceName = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
export const globalDeploymentName = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
export const globalApiVersion = process.env.AZURE_OPENAI_API_VERSION;
export const pinecone = new Pinecone({ apiKey: globalPineKey });
export const pineconeIndex = pinecone.index('pokedata');
export const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
export const azureApiKey = process.env.AZURE_OPENAI_API_KEY2;
export const globalEmbedding = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME_TEXT_EMBEDDING_ADA;
export const embeddings = new OpenAIEmbeddings({
  azureOpenAIApiKey: globalAiKey,
  azureOpenAIApiInstanceName: globalInstanceName,
  azureOpenAIApiDeploymentName: globalEmbedding,azureOpenAIApiVersion:globalApiVersion
});
export const pineVectorStore = PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

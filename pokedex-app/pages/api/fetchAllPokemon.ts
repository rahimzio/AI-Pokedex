import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "langchain/document";
import { pineconeIndex, embeddings } from "./Keys";
import { FetchResponse, RecordMetadata } from "@pinecone-database/pinecone";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const KantoPokemonLimit = 151;
  const page = Number(req.query.page) || 1;
  const limit = KantoPokemonLimit;
  const offset = (page - 1) * limit;

  try {
    const pokemonList = await Promise.all(
      Array.from({ length: limit }, (_, i) => i + offset + 1)
        .filter(id => id <= KantoPokemonLimit)
        .map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await response.json();

          return {
            id: data.id,
            name: data.name,
            types: data.types.map((type: any) => type.type.name),
            sprite: data.sprites.front_default,
            stats: data.stats.map((stat: any) => stat.base_stat),
            weight: data.weight,
            height: data.height,
          };
        })
    );

    for (const pokemon of pokemonList) {
      const textContent = `ID: ${pokemon.id}, Name: ${pokemon.name}, Types: ${pokemon.types.join(", ")}, Weight: ${pokemon.weight}, Height: ${pokemon.height}, Sprite: ${pokemon.sprite}, Stats: ${pokemon.stats.join(", ")}`;
      const vectorValuesArray = await embeddings.embedDocuments([textContent]);
      const vectorValues = vectorValuesArray[0];

      const document = new Document({
        pageContent: textContent,
        metadata: {
          name: pokemon.name,
          types: pokemon.types.join(", "),
          weight: pokemon.weight,
          height: pokemon.height,
          sprite: pokemon.sprite,
          stats: pokemon.stats.join(",")
        }
      });

      
      const existingRecord: FetchResponse<RecordMetadata> = await pineconeIndex.fetch([pokemon.id.toString()]);

      if (existingRecord.records[pokemon.id.toString()]) {
        await pineconeIndex.update({
          id: pokemon.id.toString(),
          values: vectorValues, 
          metadata: document.metadata,
        });
        //console.log(`Updated record for Pokémon: ${pokemon.name}`);
    }else{
      await pineconeIndex.upsert([
        {
          id: pokemon.id.toString(),
          values: vectorValues, 
          metadata: document.metadata,
        }
      ]);
      //console.log(`Added new record for Pokémon: ${pokemon.name}`);
    }
  }
    res.status(200).json({
      results: pokemonList,
      next: offset + limit < KantoPokemonLimit ? `/api/fetchAllPokemon?page=${page + 1}` : null,
      previous: page > 1 ? `/api/fetchAllPokemon?page=${page - 1}` : null,
      total: KantoPokemonLimit
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch or upsert Pokémon data' });
  }
}

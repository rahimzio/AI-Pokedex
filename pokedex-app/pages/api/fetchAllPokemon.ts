import { NextApiRequest, NextApiResponse } from "next";

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  stats:number[];
  sprite: string;
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  try {
    const pokemonList = await Promise.all(
      Array.from({ length: limit }, (_, i) => i + offset + 1)
        .filter(id => id <= 1025)
        .map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const data = await response.json();
         
          return {
            id: data.id,
            name: data.name,
            types: data.types.map((type: any) => type.type.name),
            sprite: data.sprites.front_default,
            stats:data.stats.map((stat:any ) => stat.base_stat),
             };
        })
    );

    res.status(200).json({
      results: pokemonList,
      next: offset + limit < 151 ? `/api/fetchAllPokemon?page=${page + 1}` : null,
      previous: page > 1 ? `/api/fetchAllPokemon?page=${page - 1}` : null,
      total: 151
    });
  } catch (error) {
    console.error('Failed to fetch pokemon:', error);
    res.status(500).json({ error: 'Failed to fetch pokemon' });
  }
}
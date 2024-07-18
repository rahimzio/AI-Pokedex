import { NextApiRequest, NextApiResponse } from "next";

//We define a Type to have a better structure for the Data that we get from the API
type PokemonData = {
  name: string;
  url: string;
  spritesUrl:string;
  index: number;
  details?: any;
}[];

//the Function fetches the API Data in atry catch into a JSON and Converts the JSON Data into The Type Data we defined before
export default async (req: NextApiRequest, res: NextApiResponse) => 
{
    try{
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();
        const poke : PokemonData[]= data.results;

        const pokeData: PokemonData[] = await Promise.all(data.results.map(async (pokemon:any, index:number) => {
      const detailsResponse = await fetch(pokemon.url);
      const details = await detailsResponse.json();
      return {
        name: pokemon.name,
        url: pokemon.url,
        index: index + 1,
        details: details
      };
    }));
    
        console.log('recieved pokemon data: ', response);
        res.status(200).json(poke as any);
    }
    catch
    {
        console.log('failed to fetch pokemon');
        
        res.status(500);
    }
}


import React, { useEffect,useState } from 'react';

interface PokemonData{
    name: string,
    url: string,
    spriteUrl:string,
    index: number,
    //details?: any;
  };


const Pokemontable = () => {
//Usestate to uptade The Pokemon Data and to check if PokeData is available
    const [PokeData, setPokeData] = useState<PokemonData[]>([]);
    const [isLoading, setLoading] = useState(true);

//Useeffect to fetch the Data from the API and create a JSON with all the Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('../api/fetchAllPokemon');
                const data = await response.json();
                setPokeData(data)
                console.log('Pokemon Data from Api:', PokeData);

            } catch (error) {
                console.log('Failed to fetch pokemon:', error);
            }
        };

        fetchData();
    }, []);
   
    if (!PokeData) return <p>no PokeData available</p>;


    

    return (

        <div>
            <div>
                <ul>

 
                {PokeData.map((Poke) => ( 
                
                <ul>
                <li key={Poke.index}>{Poke.index}</li> 
                <div>poke picture</div>
                <li key={Poke.name}>{Poke.name}</li> 
                <li key={Poke.url}>{Poke.url}</li> 
               </ul>
                ))
                } 

                

                </ul>
            </div>
        </div>
    );
};

export default Pokemontable;


'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PokemonDetail from './pokemondetails';
import LoadingComponent from '@/components/loading';
import { types } from 'util';


const allTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy'
];

const Pokemontable: React.FC = () => {
  const [pokeData, setPokeData] = useState<PokemonData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
  const [sortOption, setSortOption] = useState<string>('smallest');
  const [filterType, setFilterType] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<PokemonData[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [nextBatch, setNextBatch] = useState<number>(1); 
  const shouldShowLoadMoreButton = pokeData.length < 151;
  const newPokemonData: PokemonData[] = [];

  function getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-300',
      fire: 'bg-red-500 text-white',
      water: 'bg-blue-500 text-white',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500 text-white',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700 text-white',
      poison: 'bg-purple-500 text-white',
      ground: 'bg-yellow-600 text-white',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500 text-white',
      bug: 'bg-green-400',
      rock: 'bg-yellow-700 text-white',
      ghost: 'bg-purple-700 text-white',
      dragon: 'bg-indigo-700 text-white',
      dark: 'bg-gray-700 text-white',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300',
    };
    return colors[type.toLowerCase()] || 'bg-gray-300';
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setLoadingMessage('Loading Pokémon data...');

        const storedData = localStorage.getItem(`pokemonData`);
        if (storedData) {
          setPokeData(JSON.parse(storedData));
        } else {
          await loadMorePokemon(); 
        }

        setLoading(false);
        setLoadingMessage('');
      } catch (error) {
        console.error('Failed to fetch pokemon:', error);
        setLoading(false);
        setLoadingMessage('Failed to fetch Pokémon data');
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    sortAndFilterPokemons();
  }, [sortOption, filterType, pokeData]);

  const handlePokemonClick = (pokemon: PokemonData) => {
    setSelectedPokemon(pokemon);
  };

  const handleBack = () => {
    setSelectedPokemon(null);
  };

  const sortAndFilterPokemons = () => {
    let tempData = [...pokeData];
    if (filterType !== 'all') {
      tempData = tempData.filter(pokemon => pokemon.types.includes(filterType));
    }

    const uniqueData: PokemonData[] = tempData.reduce((acc: PokemonData[], current: PokemonData) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const sortedData = uniqueData.sort((a, b) => {
      if (sortOption === 'smallest') {
        return a.id - b.id;
      } else if (sortOption === 'largest') {
        return b.id - a.id;
      } else if (sortOption === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    setFilteredData(sortedData);
  };

  const loadMorePokemon = async () => {
    try {
      setLoading(true);
      setLoadingMessage('Loading more Pokémon...');
  
      const newPokemonBatch: PokemonData[] = [];
      const batchStart = nextBatch;
      const batchEnd = Math.min(batchStart + 38, 151);
  
      for (let id = batchStart; id <= batchEnd; id++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
  
        newPokemonBatch.push({
          id: data.id,
          name: data.name,
          types: data.types.map((type: any) => type.type.name),
          sprite: data.sprites.front_default,
          stats: data.stats.map((stat: any) => stat.base_stat),
          height: data.height,
          weight: data.weight,
        });
  
        await new Promise(resolve => setTimeout(resolve, 50)); 
      }
  
      setPokeData(prevData => {
        const uniqueData = [...prevData, ...newPokemonBatch].filter(
          (pokemon, index, self) =>
            index === self.findIndex((p) => p.id === pokemon.id)
        );
  
        localStorage.setItem(`pokemonData`, JSON.stringify(uniqueData));
  
        return uniqueData;
      });
  
      setNextBatch(batchEnd + 1);
    } catch (error) {
      console.error('Failed to load more Pokémon:', error);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const UpdateLocalData = async () => {
    localStorage.removeItem('pokemonData');
    window.location.reload();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  if (selectedPokemon) {
    return <PokemonDetail pokemon={selectedPokemon} onBack={handleBack} />;
  }

  if (isLoading) return <LoadingComponent isLoading={isLoading} loadingMessage={loadingMessage} />;
  if (!pokeData.length) return <p className="text-center mt-8">No Pokémon data available</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Kanto Pokédex</h1>
      <div>
        <h3 className="text-2xl font-bold text-center mt-6">Sortieren nach</h3>
        <div className="text-center mb-6 color-b">
          <select id="sortMenu" value={sortOption} onChange={handleChange}>
            <option value="smallest">kleinste Nummer</option>
            <option value="largest">größte Nummer</option>
            <option value="alphabetical">A bis Z</option>
          </select>
        </div>
        <h3 className="text-2xl font-bold text-center mt-6">Filtern nach Typ</h3>
        <div className="text-center mb-6 color-b">
          <select id="filterMenu" value={filterType} onChange={handleTypeChange}>
            <option value="all">Alle Typen</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredData.map((pokemon) => (
          <div key={pokemon.id} onClick={() => handlePokemonClick(pokemon)} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
            <p className="text-gray-500 mt-2">#{pokemon.id.toString().padStart(3, '0')}</p>
            <h2 className="text-xl font-semibold mt-2 capitalize color-b">{pokemon.name}</h2>
            <div className="flex mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${getTypeColor(type)}`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {}
      {pokeData.length < 151 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMorePokemon}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load More Pokémon
          </button>
        </div>
      )}
  
      <div className="updateBnt">
        <button onClick={UpdateLocalData} className='mt-10'>
          <div className="flex items-center">
            <img src="/update.png" alt="Update icon" />
            <p>Update Pokémon Data</p>
          </div>
        </button>
      </div>
    </div>
  );
  
};

export default Pokemontable;

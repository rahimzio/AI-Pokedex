import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

interface ApiResponse {
  results: PokemonData[];
  next: string | null;
  previous: string | null;
  total: number;
}

const Pokemontable: React.FC = () => {
  const [pokeData, setPokeData] = useState<PokemonData[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/fetchAllPokemon?page=${currentPage}`);
        const data: ApiResponse = await response.json();
        setPokeData(data.results);
        setTotalPages(Math.ceil(data.total / 20)); 
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pokemon:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isLoading) return <p className="text-center mt-8">Loading Pokémon data...</p>;
  if (!pokeData.length) return <p className="text-center mt-8">No Pokémon data available</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">Kanto Pokédex</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokeData.map((pokemon) => (
          <div key={pokemon.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <Image
              src={pokemon.sprite}
              alt={pokemon.name}
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
            <p className="text-gray-500 mt-2">#{pokemon.id.toString().padStart(3, '0')}</p>
            <h2 className="text-xl font-semibold mt-2 capitalize">{pokemon.name}</h2>
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
      <div className="flex justify-center mt-8 mb-8">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="mx-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

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

export default Pokemontable;
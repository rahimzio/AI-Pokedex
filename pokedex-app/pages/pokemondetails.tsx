import React, { useEffect } from 'react';
import Image from 'next/image';
import Pokemontable from './pokemontable/poketable';

interface PokemonDetailProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    stats: number[];
    sprite: string;
  };
  onBack: () => void;
}

interface Stats {
    hp: string;
    attack: string;
    defense: string;
    specialAttack: string;
    specialDefense: string;
    speed: string;
  }


const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onBack }) => {
      const weaknesses = getWeaknesses(pokemon.types);

      //const stats = getAllStats(pokemon.stats);
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8 capitalize">{pokemon.name}</h1>
      <p className="text-gray-500 mt-2 aling-center">#{pokemon.id.toString().padStart(3, '0')}</p>
      <div className="flex flex-col items-center">
        <Image
          src={pokemon.sprite}
          alt={pokemon.name}
          width={96}
          height={96}
          className="w-24 h-24 object-contain"
        />
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
        <div className="mt-4">
          <h2 className="text-xl font-bold">Weaknesses</h2>
          <ul className="list-disc list-inside">
            {weaknesses.map((weakness) => (
              <li key={weakness}  className={`text-xs aling-center font-semibold mt-6 px-2.5 py-0.5 rounded ${getTypeColor(weakness)}`}>{weakness}</li>
            ))}
          </ul>
        </div>

    <div>
        <h3 className="text-2xl font-bold text-center my-8 capitalize">Poke Stats</h3>
        <div className='flex-col'>
        <div className='stats-d'>
            <span>HP</span><span>{pokemon.stats[0]}</span>
        </div>

        <div className='stats-d'>
            <span>attack</span><span>{pokemon.stats[1]}</span>
        </div>

        <div className='stats-d'>
            <span>defense</span><span>{pokemon.stats[2]}</span>
        </div>

        <div className='stats-d'>
            <span>sp.Attack</span><span>{pokemon.stats[3]}</span>
        </div>

        <div className='stats-d'>
            <span>sp.Defense</span><span>{pokemon.stats[4]}</span>
        </div>

        <div className='stats-d'>
            <span>speed</span><span>{pokemon.stats[5]}</span>
        </div>
        
        </div>
    </div>
      </div>
      <button
        onClick={onBack}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-8"
      >
        Back
      </button>
    </div>
  );
};
    function getWeaknesses(types: string[]): string[] {
    const typeWeaknesses: { [key: string]: string[] } = {
      normal: ['Fighting'],
      fire: ['Water', 'Rock', 'Fire'],
      water: ['Electric', 'Grass'],
      electric: ['Ground'],
      grass: ['Fire', 'Ice', 'Poison', 'Flying', 'Bug'],
      ice: ['Fire', 'Fighting', 'Rock', 'Steel'],
      fighting: ['Flying', 'Psychic', 'Fairy'],
      poison: ['Ground', 'Psychic'],
      ground: ['Water', 'Grass', 'Ice'],
      flying: ['Electric', 'Ice', 'Rock'],
      psychic: ['Bug', 'Ghost', 'Dark'],
      bug: ['Fire', 'Flying', 'Rock'],
      rock: ['Water', 'Grass', 'Fighting', 'Ground', 'Steel'],
      ghost: ['Ghost', 'Dark'],
      dragon: ['Ice', 'Dragon', 'Fairy'],
      dark: ['Fighting', 'Bug', 'Fairy'],
      steel: ['Fire', 'Fighting', 'Ground'],
      fairy: ['Poison', 'Steel'],
    };

    const weaknessesSet = new Set<string>();
    types.forEach((type) => {
      if (typeWeaknesses[type.toLowerCase()]) {
        typeWeaknesses[type.toLowerCase()].forEach((weakness) => weaknessesSet.add(weakness));
      }
    });
  
    // Convert Set to Array to avoid duplicates and return
    return Array.from(weaknessesSet);
  }

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

function getAllStats(AllStats:string[]){
    return {
        hp: AllStats[0],
        attack: AllStats[1],
        defense: AllStats[2],
        specialAttack: AllStats[3],
        specialDefense: AllStats[4],
        speed: AllStats[5],
    };
}


export default PokemonDetail;

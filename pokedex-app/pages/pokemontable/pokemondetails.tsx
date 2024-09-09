import React, { useEffect } from 'react';
import Image from 'next/image';
import { types } from 'util';
import { getTypeColor } from './poketable';
const statsLabels: { [key: string]: string } = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Attack',
  specialDefense: 'Sp. Defense',
  speed: 'Speed',
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

  return Array.from(weaknessesSet);
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onBack }) => {
      const weaknesses = getWeaknesses(pokemon.types);

      const stats: Stat[] = [
        { name: 'hp', value: pokemon.stats[0] },
        { name: 'attack', value: pokemon.stats[1] },
        { name: 'defense', value: pokemon.stats[2] },
        { name: 'specialAttack', value: pokemon.stats[3] },
        { name: 'specialDefense', value: pokemon.stats[4] },
        { name: 'speed', value: pokemon.stats[5] },
      ];

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
        <div className='Poke-infos'>
        <div className="flex mt-2  justify-center">
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
            {stats.map((stat) => (
              <div key={stat.name} className='stats-d'>
                <span>{statsLabels[stat.name]}</span><span>{stat.value}</span>
              </div>
            ))}
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

export default PokemonDetail;

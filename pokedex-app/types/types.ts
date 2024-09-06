interface PokemonData {
    id: number;
    name: string;
    types: string[];
    stats: number[];
    sprite: string;
    weight: number;
    height: number;
  }

  interface PokemonDetailProps {
    pokemon: {
      id: number;
      name: string;
      types: string[];
      stats: number[];
      weight:number;
      height:number;
      sprite: string;
    };
    onBack: () => void;
  }
  
  interface Stat {
    name: string;
    value: number;
  }

  interface Message {
    role: string;
    content: string;
  }
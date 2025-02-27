'use client';
import Pokemontable from '../pages/pokemontable/poketable';
import Chatbar from "./chat/chatbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [isPokemonTableLoaded, setIsPokemonTableLoaded] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Pokedexchat");

  const loadPokemonTable = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPokemonTableLoaded(true);
  };
  loadPokemonTable();

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        const response = await fetch('/api/fetchAllPokemon');
        if (!response.ok) {
          throw new Error('Failed to load Pokémon data');
        }
       
        console.log('Pokémon data fetched successfully');
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    loadPokemonData();
  }, []);

  function changeView() {
    if (!isChatOpen) {
      setChatOpen(true);
      setButtonMessage('Pokedex');
    } else {
      setChatOpen(false);
      setButtonMessage('Pokedexchat');
    }
  }

  return (
    <section>
      {isPokemonTableLoaded && <button className="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-red-500 duration-300" onClick={changeView}>Switch to {buttonMessage}</button>}
      {!isChatOpen && <Pokemontable />}
      {isPokemonTableLoaded && isChatOpen && <Chatbar />}
    </section>
  );
}

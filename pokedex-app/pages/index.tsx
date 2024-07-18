'use client'
import Image from "next/image";
import { Inter } from "next/font/google";
import Pokemontable  from '../pages/pokemontable/poketable';
import setAllPokemon from '../pages/pokemontable/poketable';

const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
  <section>
    <Pokemontable/> 
  </section>
  );
}

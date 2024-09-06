# Introduction 
This Application is Called AI-Pokedex and is a Pokedex WebApp that Provides the User With Informations About All Kanto Pokemons starting from they name to they stats.
this Application also got an AI integrated Chat in which you can ask it all kind of questions about Pokemons like a real Pokedex and you get additional informations.
This application got created for Pokemon Fans that want to get adittional Information and want to expierience having a real interactive Pokedex

Features: 
- Pokedex that displays Pokemon Data 
- Ai Chatbot that answers all you Pokemon related questions   

Technology Stack:
- NextJS
- Pinecone Database
- Langchain API
- Azure OpenAI API
- PokeAPI

# Usage Instructions
Basic Usage: When the application starts you directly see 42 Pokemon on which you can click to get additional informations, when you click on the next button you see the next 42 Pokemon,you can also filter the pokemon by type or number, when you press on the switch to pokedexchat button you open up to the chat and can ask you questions to the Pokedex-AI.

# File Structure
- Pages: inside pages we got our index.tsx and 3 folder(pokemontable,chat,api)

- pokemontable: inside this folder we got 2 files poketable.tsx inside this file all pokemon get feched and displayed inside of a collum, the seconde file is called pokemondetail.tsx this file is the one which gets displayed if you click on a pokemon to get additional information

- chat: inside this folder is only one file with the name chatbar.tsx this file gets displayed if you open the pokedexchat
 

- api: inside this folder there are 2 files and another folder with the name chat. The file Keys extract all the enviroment variables and make them importable for other files, the FetchAllPokemon file fetches the pokemon data from the pokeAPI and loads the data to the Pinecone Database.

- api/chat: this folder conatains 2 files the chat.ts file sets up an API endpoint to handle chat completions, requiring specific environment variables for configuration and responding to POST requests with generated responses based on user input messages. The Chain.ts file defines an API endpoint that processes POST requests to answer questions based on a Pinecone-stored context, using a LangChain OpenAI model to generate responses as a Pokedex-like character, with specific setup for Azure OpenAI service credentials and Pinecone configuration.

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process:
To set up the AI-Pokedex application on your local machine, follow these steps:
- Clone the Repository
git clone https://github.com/your-username/ai-pokedex.git
Replace your-username with your GitHub username or the appropriate repository owner.

- Install Dependencies
Ensure you have Node.js and npm installed. Then, run the following command to install the necessary packages:
npm install

- Set Up Environment Variables
Create a .env file in the root of the project and add the necessary environment variables:
NEXT_PUBLIC_POKEAPI_URL=https://pokeapi.co/api/v2
PINECONE_API_KEY=your_pinecone_api_key
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
LANGCHAIN_API_URL=your_langchain_api_url

- Start the Application
Once the environment variables are set, start the development server:
npm run dev
The app will be available at http://localhost:3000.

2.	Software dependencies
* Node.js: JavaScript runtime.
* Next.js: React framework for building the web application.
* Pinecone Database: For storing and retrieving Pokémon data.
* Langchain API: For managing AI interactions.
* Azure OpenAI API: For the AI chatbot functionality.

3.	Latest releases: /
4.	API references: /


# Build and Test
To ensure the application functions correctly, you can run the available tests:

1. Unit Tests
This command will run all the unit tests defined in the project.
- npm run test

2. Linting
Ensure your code adheres to the project's style guidelines by running:
- npm run lint

3. Type Checking
Verify TypeScript types with:
- npm run type-check

# Contribute
To make the project better you could upload additional information to the pinecode database to get a better response from the Pokedexchat 

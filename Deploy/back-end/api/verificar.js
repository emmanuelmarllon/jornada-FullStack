// EXECUTE ESTE ARQUIVO PARA VERIFICAR SE TODAS MUSICAS ESTAO NA API

import { MongoClient } from "mongodb";
import fs from "fs";

// Conexão com o banco MongoDB
const URI =
  "mongodb+srv://devMarlon:aKqApRAhbLPeooA6@cluster0.4fkhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(URI);
const db = client.db("SpotfyAula"); // Seu banco de dados
const songCollection = db.collection("songs");

// Função para ler o arquivo JSON de músicas
function getSongsFromFile() {
  try {
    const data = fs.readFileSync("./comparar.json", "utf-8");
    return JSON.parse(data); // Converte o conteúdo JSON em um objeto JavaScript
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON", error);
    return [];
  }
}

// Função para buscar as músicas que restaram no MongoDB
async function getSongsFromMongoDB() {
  try {
    const songsInDB = await songCollection.find({}).toArray();
    return songsInDB;
  } catch (error) {
    console.error("Erro ao buscar músicas do MongoDB", error);
    return [];
  }
}

// Função para comparar as listas e identificar músicas faltando
async function findMissingSongs() {
  const apiSongs = getSongsFromFile(); // Obtém as músicas do arquivo JSON
  const dbSongs = await getSongsFromMongoDB(); // Obtém as músicas do MongoDB após a limpeza

  // Filtrando as músicas do arquivo que não estão no MongoDB (baseado no nome e artista)
  const missingSongs = apiSongs.filter(
    (song) =>
      !dbSongs.some(
        (dbSong) => dbSong.name === song.name && dbSong.artist === song.artist
      )
  );

  console.log("Músicas faltando:", missingSongs);

  if (missingSongs.length > 0) {
    // Se houver músicas faltando, insira-as de volta no MongoDB
    await addMissingSongs(missingSongs);
  }
}

// Função para adicionar as músicas faltantes ao MongoDB
async function addMissingSongs(missingSongs) {
  try {
    const response = await songCollection.insertMany(missingSongs);
    console.log(`${response.insertedCount} músicas adicionadas ao banco.`);
  } catch (error) {
    console.error("Erro ao adicionar músicas", error);
  }
}

// Rodando a função para encontrar e adicionar as músicas faltantes
findMissingSongs();

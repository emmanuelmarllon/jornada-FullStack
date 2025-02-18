// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

const URI =
  "mongodb+srv://devMarlon:aKqApRAhbLPeooA6@cluster0.4fkhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(URI);

export const db = client.db("SpotfyAula");

// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);

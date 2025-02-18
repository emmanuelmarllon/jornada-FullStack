import { MongoClient } from "mongodb"; // Importe o MongoClient

// Conexão com o MongoDB
const URI =
  "mongodb+srv://devMarlon:aKqApRAhbLPeooA6@cluster0.4fkhj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Substitua a URL com a sua URI de conexão
const client = new MongoClient(URI);

async function removeDuplicates() {
  try {
    // Conectar ao MongoDB
    await client.connect();
    const db = client.db("SpotfyAula"); // Nome do seu banco de dados
    const collection = db.collection("songs"); // Nome da coleção (songs)

    // Encontrar as músicas com o mesmo nome (duplicadas)
    const songs = await collection
      .aggregate([
        {
          $group: {
            _id: "$name",
            count: { $sum: 1 },
            songs: { $push: "$_id" },
          },
        },
        { $match: { count: { $gt: 1 } } }, // Selecionar apenas as duplicadas
      ])
      .toArray();

    // Remover as duplicadas
    for (let song of songs) {
      song.songs.shift(); // Remove o primeiro item da lista (o que será mantido)

      // Excluir as duplicatas restantes
      await collection.deleteMany({
        _id: { $in: song.songs }, // Deletar todos os duplicados
      });

      console.log(`Deletados ${song.count - 1} duplicados de "${song._id}"`);
    }

    console.log("Duplicatas removidas!");
  } catch (error) {
    console.error("Erro ao remover duplicatas:", error);
  } finally {
    // Fechar a conexão com o MongoDB
    await client.close();
  }
}

// Rodar a função para remover as duplicatas
removeDuplicates().catch(console.error);

import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Connexion à MongoDB (local ou Atlas)
await mongoose.connect("mongodb://localhost:27017/tournamentDB");

// Schéma des messages
const messageSchema = new mongoose.Schema({
  teamId: String,
  author: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

// Route pour envoyer un message
app.post("/teams/:teamId/messages", async (req, res) => {
  const { teamId } = req.params;
  const { author, content } = req.body;
  const msg = new Message({ teamId, author, content });
  await msg.save();
  res.json(msg);
});

// Route pour récupérer les messages d’une équipe
app.get("/teams/:teamId/messages", async (req, res) => {
  const { teamId } = req.params;
  const msgs = await Message.find({ teamId }).sort({ timestamp: -1 });
  res.json(msgs);
});

app.listen(3000, () =>
  console.log("✅ Serveur démarré sur http://localhost:3000")
);

/*
import express from "express";
import { VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

const app = express();
app.use(express.json());

const docs = await new SimpleDirectoryReader().loadData("data");
const index = await VectorStoreIndex.fromDocuments(docs);
const queryEngine = index.asQueryEngine();

app.post("/query", async (req, res) => {
    const { query } = req.body;
    const result = await queryEngine.query({ query });
    res.json({ answer: result.response });
});

app.listen(3000);
*/

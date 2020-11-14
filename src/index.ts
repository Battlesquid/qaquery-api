import env from "dotenv";
env.config({ path: "../.env" });
import express from "express"

import type { Query } from "./types"
import { search } from "./query"

const categories: string[] = ["VRC", "VEXU", "VIQC", "VAIC-HS", "VAIC-U", "RAD"];

const app: express.Application = express();


const resolveQuery = (searchTerm: any, category: any, page: any, wholeWord: any): Query => {
    return {
        searchTerm,
        category: category === "all" || categories.includes(category) ? category : "VRC",
        page: typeof +page === "number" ? page : 1,
        wholeWord: wholeWord === "true" ? true : false
    }
}

app.get("/api/search", async (req, res) => {

    const { searchTerm, page, category, wholeWord } = req.query;

    const query = resolveQuery(searchTerm, category, page, wholeWord);
    console.log("Query: ", query)
    const data = await search(query)

    res.send(data);
})

app.listen(process.env.PORT, () => console.log("Server Started."))
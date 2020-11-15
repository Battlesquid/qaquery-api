import env from "dotenv";
env.config({ path: "../.env" });
import express from "express"

import type { QaQuery } from "./types"
import { search } from "./query"

const categories: string[] = ["VRC", "VEXU", "VIQC", "VAIC-HS", "VAIC-U", "RAD"];

const app: express.Application = express();

const resolveQuery = (searchTerm: any, category: any, page: any, wholeWord: any): QaQuery => {
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

    if (query.searchTerm.replace(" ", "").length === 0) {
        res.send("Invalid searchTerm")
    } else {
        console.time("Query Time: ")
        console.log("Query: ", query)
        const data = await search(query)

        res.send(data);
        console.timeEnd("Query Time: ")
    }
})

app.listen(8080, () => console.log("Server Started."))
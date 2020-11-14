import type { Query, SeasonEndpointJSON } from "./types"
import fetch from "node-fetch"
import { load } from "cheerio"
import { unleak, unformat } from "./stringutil"

const getYearBound = async (): Promise<number> => {
    const response = await fetch(`https://www.robotevents.com/api/v2/seasons?active=true`, {
        headers: {
            "Authorization": `Bearer ${process.env.ROBOT_EVENTS_KEY}`
        }
    });
    const { data }: SeasonEndpointJSON = await response.json();
    const { years_end } = data.find(program => program.program.code === "VRC") || { years_end: new Date(Date.now()).getFullYear() };
    return years_end;
}

const scrapePage = async (url: string, query: Query) => {

    const urls = [];
    const { wholeWord } = query;

    const response = await fetch(url);
    if (response.status === 200) {
        console.log(`OK on ${url}`)
        const html = unleak((await response.text()));

        const $ = load(html);
        const questions = $('.panel-body').children('h4.title:has(a span)').toArray();

        for (const question of questions) {
            const url = unleak($(question).children('a').attr('href'));
            urls.push(url);
        }

    } else return;

    console.log(`Found ${urls.length} questions: `, urls, "\n")

    const queriedURLs = [];

    for (const url of urls) {
        const response = await fetch(url);
        const html = unleak((await response.text()));
        const $ = load(html);

        const id = url.match(/QA\/(\d+)/)?.[1];
        const title = unleak(unformat($('div.question h4').text()))
        const question = unleak(unformat($('div.question .content-body').text()));
        const answer = unleak(unformat($('div.question .answer.approved .content-body').text()))

        if (wholeWord) {
            const regex = RegExp(`\\b(${query.searchTerm.replace("+", " ")}\\b)`, "i");
            console.log(regex)
            const validMatch = regex.test(title) || regex.test(question) || regex.test(answer);
            if (validMatch)
                queriedURLs.push({ id, url, title });
        } else {
            queriedURLs.push({ id, url, title });
        }
    }

    return queriedURLs;
}


const queryCategory = async (query: Query, bound: number) => {

    const data: { [key: string]: any } = {};
    const { category, page, searchTerm } = query;

    for (let year = 2018; year < bound; year++) {
        const url = unleak(`https://www.robotevents.com/${category}/${year}-${year + 1}/QA?query=${searchTerm}&page=${page}`);
        const results = await scrapePage(url, query);
        data[category] = results;
    }

    return data;
}

export const search = async (query: Query) => {
    const yearBound: number = await getYearBound();
    const result = await queryCategory(query, yearBound);
    return result;
}
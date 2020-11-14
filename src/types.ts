export interface SeasonEndpointJSON {
    data: {
        id: number,
        name: string,
        program: {
            id: number,
            name: string,
            code: string
        },
        start: string,
        end: string,
        years_start: number,
        years_end: number
    }[]
}

export interface Query {
    searchTerm: string,
    category: string,
    page: number,
    wholeWord: boolean
}
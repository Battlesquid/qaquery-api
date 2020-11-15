# qaquery-api

Backend API for qa-query.


## Running


If you don't already have one, you need a [RobotEvents API Key](https://www.robotevents.com/api/v2) to properly retreive season data. Create a `.env` file in the root folder and add the following, replacing `<YOUR-KEY-HERE>` with your API key:

```
ROBOT_EVENTS_KEY=<YOUR-KEY-HERE>
```

Once you've done that you can run `npm start` and the server will start on port `8080`.

## Requesting Data

### Endpoint: `/api/search`
\
`searchTerm`: string
\
The search term you want query the Q&As with.
\
\
`category`: string
\
The category you wish to index, by default this will be `VRC`.
\
\
`page`: number
\
The page you want to query on the Q&A, by default this will be `1`.
\
\
`wholeWord`: boolean
\
Whether whole word matches should be implemented, by default this is `false`.
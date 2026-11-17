# AliExpress Search Scraper: code example

This example starts the AliExpress Search Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows the top three. It then saves all records to `results.json` in the folder of the script.

The search is set in `input.json`. It uses two search words, `led light` and `usb cable`, with 1 page per word and at most 120 results. Change the words, the pages or the number of results to fit your own search. The fields of the input are the same as in the Actor documentation: `queries`, `maxPagesPerQuery` and `maxResults`.

## Run the Python version

1. Put your Apify API token in the environment variable `APIFY_TOKEN`. The file `.env.example` shows the name. Do not write the token in the code.
2. Go to the folder `python`.
3. Install the client with `pip install -r requirements.txt`.
4. Run `python3 main.py`.

## Run the Node.js version

1. Put your Apify API token in the environment variable `APIFY_TOKEN`.
2. Go to the folder `node`.
3. Install the client with `npm install`.
4. Run `node main.mjs`.

## What you see

Both scripts print the number of records, then the position, title, price and currency of three products. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields.

A run reads search results pages and not product pages, and one run reads up to 10 search pages in total. The Actor page lists the limits and the pricing: https://apify.com/avakode/aliexpress-search

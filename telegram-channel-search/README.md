# Telegram Channel Search Scraper: code example

This example starts the Telegram Channel Search Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows three of them. It then saves all records to `results.json` in the folder of the script.

The search is set in `input.json`. It looks for the word `privacy` inside two public channels, with at most 50 posts per channel and at most 100 posts in total. The search runs inside the channels you name, not across all of Telegram. Change the channels, the words or the limits to fit your own search. The fields of the input are the same as in the Actor documentation: `channels`, `keywords`, `maxAgeDays`, `postedSince`, `postedUntil`, `maxPostsPerChannel`, `onlyNew`, `maxResults` and `excludeKeywords`.

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

Both scripts print the number of records, then the channel, the time, the views and the link of three posts. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields.

The channels must be public and have an open web preview. Word matching is decided by the search of Telegram. To get only new posts on later runs, set `onlyNew` to true. The Actor page lists the limits and the pricing: https://apify.com/avakode/telegram-channel-search

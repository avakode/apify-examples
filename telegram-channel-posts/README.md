# Telegram Channel Posts Scraper: code example

This example starts the Telegram Channel Posts Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows three of them. These are the newest posts. It then saves all records to `results.json` in the folder of the script.

The job is set in `input.json`. It reads one public channel, with no age limit, at most 50 posts per channel and at most 100 posts in total. Change the channel list, the number of days or the limits to fit your own job. The fields of the input are the same as in the Actor documentation: `channels`, `maxAgeDays`, `maxPostsPerChannel` and `maxResults`. For scheduled runs the documentation also describes the field `onlyNew`.

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

Both scripts print the number of records, then the time, the views and the link of three posts. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields.

A run reads the public web preview of a channel. Public channels with an open preview work. The Actor page lists the limits and the pricing: https://apify.com/avakode/telegram-channel-posts

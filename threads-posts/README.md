# Threads Posts Scraper: code example

This example starts the Threads Posts Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows three of them. It then saves all records to `results.json` in the folder of the script.

The job is set in `input.json`. It follows one account, with replies kept, up to 10 posts per account and at most 100 results. Change the account, the number of posts or the other fields to fit your own job. The fields of the input are the same as in the Actor documentation, for example `accounts`, `postLinks`, `excludeReplies`, `maxPostsPerAccount`, `onlyNew` and `maxResults`.

Note that Threads shows a visitor without login about 5 latest posts of an account when the Actor runs on Apify servers. The input asks for up to 10 posts, but you should expect about 5 records for one account.

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

Both scripts print the number of records, then the date, the number of likes and the link of three posts. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields.

The Actor page lists the limits and the pricing: https://apify.com/avakode/threads-posts

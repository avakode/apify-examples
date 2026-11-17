# Wellfound Jobs Scraper: code example

This example starts the Wellfound Jobs Scraper Actor from code, waits for the run to end, reads the records, prints how many there are and shows three. It then saves all records to `results.json` in the folder of the script.

The search is set in `input.json`. It looks for `software-engineer` jobs in `london` and on the remote page of the role, with one page per search (about 30-40 jobs per page) and at most 100 results, so both searches fit in the limit. Change the role, the place or the limit. The input fields are the same as in the Actor documentation: `roles`, `locations`, `remote`, `maxPagesPerSearch` and `maxResults`.

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

Both scripts print the number of records, then the title, company and pay text of three jobs. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields.

The result is a sample, not the full list. Wellfound shows a visitor one or two jobs per company on each search page, and company pages are closed to visitors without login. **Maximum results** is a total for all searches: one search can use the limit up before the other is read. The Actor page lists the limits and the pricing: https://apify.com/avakode/wellfound-jobs

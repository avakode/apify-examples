# Xing Jobs Scraper: code example

This example starts the Xing Jobs Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows three of them. It also saves all records to `results.json` in the folder of the script.

The search is set in `input.json`. It uses the keyword `python` and the city `Berlin`, with no age limit, the Only new setting off and at most 100 results. Change the words, cities or number of results to fit your search. The fields of the input are the same as in the Actor documentation: `keywords`, `locations`, `postedWithinDays`, `onlyNew` and `maxResults`. Most job titles on Xing are German, so a German word such as `entwickler` may match more postings.

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

Both scripts print the number of records, then the title, company and city of three postings. A missing value is shown as `None` in Python and `null` in Node.js. The file `results.json` holds every record with all its fields, including the description.

The Actor selects postings from the public sitemap by the words of the job address, so it is not the search of Xing. It makes about 1 request per second, so a large run takes time. The Actor page lists the limits and the pricing: https://apify.com/avakode/xing-jobs

# Dice Jobs Scraper: code example

This example starts the Dice Jobs Scraper Actor from code, waits for the run to end, reads the records of the dataset, prints how many there are and shows three. It then saves all records to `results.json` in the folder of the script.

The search is set in `input.json`. It looks for remote Python jobs posted within the last 7 days, opens each job page for the full description and stops after 20 jobs. Change the search term, the place, the filters or the number of results to fit your own search. The fields of the input are the same as in the Actor documentation, for example `queries`, `locations`, `workplaceType`, `postedDate`, `includeDescription`, `onlyNew` and `maxResults`.

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

Both scripts print the number of records, then the title, company and salary text of three jobs. A missing value is shown as `None` in Python and `null` in Node.js, and many jobs show no salary. The file `results.json` holds every record with all its fields.

With `includeDescription` on, the Actor opens one page per job, so a run takes longer than a run without descriptions. Set `onlyNew` to `true` to skip jobs that an earlier run with the same search already delivered. The Actor page lists the limits and the pricing: https://apify.com/avakode/dice-jobs

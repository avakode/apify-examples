# How to collect public Xing job postings by keyword and city

## Who this is for

You want a list of job postings from Xing for a role in one or several German cities. Maybe you feed a job board, write a report about the German-speaking market, or watch which companies hire for a skill.

The Xing Jobs Scraper Actor reads public job pages of xing.com and returns one record per posting. This guide shows how to run it in Apify Console and from Python, and how to repeat it with the Only new setting.

## How the search works

The Actor is not the search of Xing. It reads the public job sitemap files of xing.com and selects postings by the words of the job address, which holds the city and the title words. It opens just the matching job pages.

So a word that appears in the page title or in the description alone does not match. Most job titles on Xing are German, so German words such as `entwickler` match more often than English ones. Words match as whole words: `java` does not match `javascript`.

## What you get in each record

Each record holds one job posting. A value that is missing is `null`. Dates are ISO 8601 in UTC. These are the fields:

| Field | What it holds |
|---|---|
| `title`, `company` | The job title and the hiring company. |
| `location`, `region`, `postal_code`, `country` | The workplace: city, region, postal code when published, ISO country code. |
| `employment_type`, `industry` | The type as published, for example `FULL_TIME`, and the industry when published. |
| `description_html`, `description_text` | The full description as HTML and as plain text. |
| `posted_at`, `valid_through` | The publication date and the last day the posting is valid. |
| `company_url`, `source`, `source_id`, `url` | The company page on Xing, the value `xing`, the job number and the posting address. |

One record, with some values from the Actor documentation:

```json
{
  "title": "Full Stack Development Engineer (m/w/d)",
  "company": "empit",
  "location": "Berlin",
  "country": "DE",
  "employment_type": "FULL_TIME",
  "posted_at": "2026-06-25T06:15:24.000Z",
  "source_id": "155714859"
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/xing-jobs and click the button that opens the Actor in Console.
2. Open the Input tab. In **Keywords**, write one search per line. All words of a line must occur in the job address, so `data engineer` needs both. An empty field matches any job.
3. In **Cities**, write one city per line, such as `Berlin` or `München`. An empty field means all cities.
4. **Posted within days** keeps postings from the last N days. The value 0 means any age.
5. **Maximum results** stops the run after this many jobs. The default is 100.
6. Start the run. When it is done, open the Output tab of the run. The Overview view shows the main fields as a table.

The example task uses the keyword `python` and the city `Berlin`, with no age limit and at most 100 results. Open it at https://apify.com/avakode/xing-jobs/examples/python-jobs-berlin-xing and change the word or the city. The example is not the search of Xing: it selects by the words of the job address, so the number of postings can be lower than the site search shows.

You can also set **Maximum cost per run**; the tool stops cleanly at that limit. Pricing is listed on the Actor page.

## Run the same search from Python

Install the Apify API client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`. Keep the token out of your code.

The input is the same JSON as in the task above. Save it as `input.json` in the folder of the script:

```json
{ "keywords": ["python"], "locations": ["Berlin"], "postedWithinDays": 0, "onlyNew": false, "maxResults": 100 }
```

Then run this script:

```python
import json
import os
from pathlib import Path

from apify_client import ApifyClient

here = Path(__file__).resolve().parent
run_input = json.loads((here / "input.json").read_text())

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("avakode/xing-jobs").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["title"], item["company"], item["location"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script prints how many records there are, shows three and saves all to `results.json`. A Node.js version is in the code example that comes with this guide. Client libraries: https://docs.apify.com/api/client/python and https://docs.apify.com/api/client/js.

## Repeat the search on a schedule

In Apify Console you can create a schedule that starts the Actor with a saved input at times you choose. How schedules work is described at https://docs.apify.com/platform/schedules. The n8n template that comes with this guide runs the Actor once a day.

The setting **Only new** is meant for repeated runs. When it is on, a run returns jobs that this tool has not delivered before. The rules are strict:

- It does not mean the newest jobs. If **Maximum results** is lower than the number of matching jobs, the next run returns the next jobs not delivered yet.
- The memory of delivered jobs is kept for each combination of keywords, cities and Posted within days.
- Do not start two Only new runs with the same input at the same time. The second one stops with a message.
- A run with Only new still reads all the sitemap files, even when no job is new.
- If a run is killed while it writes a batch, the next Only new run may skip that batch. If a write was still on its way when a run was stopped, at most one batch may be written again.

## Limits to keep in mind

- The speed is about 1 request per second, so large runs take time. Every run also downloads about 11 sitemap files before it opens any job page.
- Selecting by the words of the job address finds fewer postings than the site search. Some postings carry a different city in the address than in the workplace field.
- Postings that were removed or have expired are skipped. Skipped postings are opened again by the next run, so a run with no new jobs still makes requests.
- **Posted within days** skips older postings by the sitemap change date, then checks the date on the page. A run is cheaper but not instant.
- The record has no salary, apply link or recruiter contact. E-mail addresses and phone numbers inside descriptions are replaced with `[email removed]` and `[phone removed]`.
- If Xing refuses access (HTTP 403 or 429, or a check page), the Actor stops and does not try again. Jobs already delivered stay in the dataset.

When a run fails, the message says whether the input needs a fix, the site changed its format or the site blocked access.

## Links

- Actor page: https://apify.com/avakode/xing-jobs
- Example task: https://apify.com/avakode/xing-jobs/examples/python-jobs-berlin-xing
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Apify Console: https://console.apify.com/
- Python client: https://docs.apify.com/api/client/python
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

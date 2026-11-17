# How to find remote Python jobs on Dice posted this week

## Who this is for

You want to see which remote Python jobs Dice lists in the US, who posts them and what they pay. Maybe you run a job board or track demand for a skill.

The Dice Jobs Scraper Actor reads the public Dice search result pages and job pages and returns one record per job. This guide shows how to run it in Apify Console and from Python, and how to repeat it on a schedule with the Only new option.

## What you get in each record

Each record holds one job. A missing value is `null` (`None` in Python), dates are ISO 8601 UTC, and `url` points to the job on Dice. These are the main fields:

| Field | What it holds |
|---|---|
| `source_id` | The job id on Dice. |
| `title` | The job title. |
| `company_name`, `company_url` | The hiring company and its Dice page. |
| `location`, `city`, `state`, `country` | The place of the job. |
| `is_remote`, `workplace_types` | A remote flag, and On-Site, Hybrid or Remote. |
| `employment_types`, `employer_type` | Full-time, Contract and so on; Direct Hire, Recruiter or Other. |
| `salary_text`, `salary_min`, `salary_max`, `salary_currency`, `salary_period` | The salary as shown on Dice and as parsed. |
| `posted_at`, `updated_at`, `valid_through` | The posting, update and expiry dates. |
| `skills`, `description_text`, `description_html` | Taken from the job page. They are filled when the full description is switched on, otherwise `null`. The same is true for `valid_through`. |
| `summary` | The short summary from the search results. |
| `url` | The address of the job on Dice. |

One record, shortened, with values from the Actor documentation:

```json
{
  "source_id": "56bfa0f0-8d70-4033-8bde-f962d9919761",
  "title": "Full-stack Engineer",
  "company_name": "Capital One",
  "location": "McLean, Virginia, USA",
  "employment_types": ["Full-time"],
  "salary_text": "USD 197,300.00 - 225,100.00 per year",
  "salary_min": 197300,
  "salary_max": 225100,
  "posted_at": "2026-10-02T21:02:28.000Z"
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/dice-jobs and click the button that opens the Actor in Console.
2. Open the Input tab. In **Search terms** write one job title or skill per line, for example `python`. Dice search ignores `+`, `#` and `&`.
3. Set **Workplace** to Remote and **Posted within** to Last 7 days. **Locations** can stay empty, which means no place filter. To search a city, state or ZIP code, write it there, for example `Austin, TX`.
4. Leave **Include full description** on to get the description, skills and expiry date. It costs one extra request per job. Switch it off for a list with the short summary.
5. Set **Maximum results**. The run stops after this many jobs in total. The example uses 20.
6. Start the run. When it is done, open the Output tab of the run. The Overview view shows the main fields in a table, and the dataset can be exported, as described at https://docs.apify.com/platform/storage/dataset.

The example task has the same settings: https://apify.com/avakode/dice-jobs/examples/remote-python-jobs-dice

You can also set **Maximum cost per run**. The tool stops cleanly at that limit. Pricing is listed on the Actor page.

## Run the same search from Python

Install the client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`. Keep the token out of your code.

The input is the same JSON as in the task above. Save it as `input.json` in the folder of the script:

```json
{
  "queries": ["python"],
  "locations": [],
  "employmentType": "ANY",
  "workplaceType": "Remote",
  "postedDate": "SEVEN",
  "companies": [],
  "minSalary": 0,
  "includeDescription": true,
  "onlyNew": false,
  "maxResults": 20,
  "maxPagesPerSearch": 50
}
```

Run this script:

```python
import json
import os
from pathlib import Path

from apify_client import ApifyClient

here = Path(__file__).resolve().parent
run_input = json.loads((here / "input.json").read_text())

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("avakode/dice-jobs").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["title"], item["company_name"], item["salary_text"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script waits until the run ends, prints the number of records, shows three and saves everything to `results.json`. A Node.js version is in the code example that comes with this guide.

## Repeat the search and get only new jobs

A single run shows the jobs of one moment. In Apify Console you can create a schedule that starts the Actor with a saved input at times you choose, described at https://docs.apify.com/platform/schedules. The n8n template that comes with this guide runs the Actor once a day and keeps five main fields of each job.

The Actor has an **Only new** option, set with `"onlyNew": true` in the input. With it on, a run skips jobs that an earlier run with the same search terms, places and filters already delivered. Keep these points in mind:

- Only new does not mean the newest. Dice search cannot be sorted by posting date here, so each run walks the result pages again.
- If the limit is lower than the number of matching jobs, the next run returns the next undelivered ones.
- Two Only new runs with the same input cannot run at the same time. The second one stops with a message.
- If a run is killed while it writes a batch and is not resurrected, the next Only new run may skip that batch.
- At most one batch may be written again if a write was still on its way when the run was stopped, so a few jobs can appear twice.

## Limits to keep in mind

- The Actor reads public pages. It does not log in, does not apply to jobs and does not collect recruiter names, e-mails or phone numbers. E-mail addresses and US phone numbers in a posting text are replaced with `[email removed]` and `[phone removed]`.
- Dice shows 20 jobs per search page, and the full description needs one extra request per job. The tool makes about one request per second, so large runs take time. Each search stops after the page limit, `maxPagesPerSearch`, set to 50 pages of 20 jobs in the example.
- Dice may show a different number of results for a search from a different region or at a different time.
- The posting date filter offers 24 hours, 3 days and 7 days.
- The minimum salary filter keeps jobs whose shown upper salary limit is at least the value in USD per year. It drops jobs with no salary shown and pay in other currencies. Hourly pay is compared as hours x 2,080 and monthly pay as x 12; weekly or unstated pay is dropped when this is set.
- If Dice refuses access, with HTTP 403 or 429 or a check page, the tool stops asking at once. Jobs already collected are kept and the run ends with the reason in its status. If nothing was collected, the run fails with that reason. The tool does not bypass protection.

A failed run says which of three things happened: the input needs a fix, the site changed its format, or the site blocked access. For a changed format, open an issue in the Issues tab with the run link.

## Links

- Actor page: https://apify.com/avakode/dice-jobs
- Example task: https://apify.com/avakode/dice-jobs/examples/remote-python-jobs-dice
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Apify Console: https://console.apify.com/
- Python client: https://docs.apify.com/api/client/python
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

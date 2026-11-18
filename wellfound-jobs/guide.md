# How to collect startup jobs with salary and equity from Wellfound

## Who this is for

You want to see which startups hire for a role in a place, and what they offer. Maybe you compare salary and equity ranges or build a list of hiring startups. By hand this means copying details from many pages into a sheet.

The Wellfound Jobs Scraper Actor reads the public Wellfound search pages and returns one record per job. One point up front: it gives a sample, not the full list. Wellfound shows a visitor one or two jobs per company on each search page, and company pages are closed to visitors without login. This guide covers Apify Console, Python and schedules.

## What you get in each record

Each record is one job. A missing value is `null`. The main fields are:

| Field | What it holds |
|---|---|
| `title`, `url`, `source_id` | The job title, its address on Wellfound and its id. |
| `posted_at` | When the job went live. |
| `company_name` | The company. |
| `company_size`, `company_stage` | The size band and the stage badge, such as Early Stage. |
| `job_type`, `primary_role` | The type, such as full-time, and the role group. |
| `remote_kind`, `locations` | The work arrangement and the office places. |
| `compensation` | The pay text as shown on the site. |
| `salary_min`, `salary_max`, `salary_currency` | The salary range as numbers and its currency. |
| `has_equity`, `equity_min`, `equity_max` | Whether equity is offered, and the range in percent. |
| `description` | The full job description as markdown. |

Some fields of one record, from the Actor documentation:

```json
{
  "title": "Software Engineer",
  "posted_at": "2026-10-28T06:42:44.000Z",
  "company_name": "Fuze",
  "company_size": "51-200",
  "company_stage": "Early Stage",
  "salary_min": 40000,
  "salary_max": 100000,
  "salary_currency": "USD",
  "has_equity": true,
  "equity_min": 0.05,
  "equity_max": 0.1,
  "remote": true,
  "locations": ["Dubai", "Bengaluru"]
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/wellfound-jobs and click the button that opens the Actor in Console.
2. Open the Input tab. The field **Roles** takes one role per line, written as in Wellfound addresses, such as `software-engineer`.
3. The field **Places** takes names such as `london` or `new-york`, one per line. Every role is searched in every place.
4. Tick **Also search remote jobs** to add the remote page of each role.
5. Set **Pages per search**. Each page lists about 30-40 jobs. The default is 5. The example below uses one page per search.
6. Set **Maximum results**. The run stops after this many jobs in total. The default is 100.
7. Start the run. When it is done, open the Output tab of the run. The Overview view shows the main fields in a table.

The example task searches `software-engineer` in `london` and on the remote page, one page per search (about 30-40 jobs per page), at most 100 results, so both searches fit in the limit. Open it at https://apify.com/avakode/wellfound-jobs/examples/startup-software-engineer-jobs-london and change the role and the place. **Maximum results** is a total for all searches: one search can use the limit up before the other is read.

Filters are optional: **Keywords**, the salary checkbox (`onlyWithSalary`) and **Posted within days**. **Read each job page** adds the company website, industry and exact currency, with one extra request per job; this is slower.

Pricing is listed on the Actor page.

## Run the same search from Python

Install the client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`.

The input is the same JSON as in the London task above. Save it as `input.json` in the folder of the script:

```json
{ "roles": ["software-engineer"], "locations": ["london"], "remote": true, "maxPagesPerSearch": 1, "maxResults": 100 }
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
run = client.actor("avakode/wellfound-jobs").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["title"], item["company_name"], item["compensation"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script prints how many records there are, shows three and saves them to `results.json`. A Node.js version is in the code example that comes with this guide. The client is described at https://docs.apify.com/api/client/python.

## Repeat the search on a schedule

In Apify Console you can create a schedule that starts the Actor with a saved input, as described at https://docs.apify.com/platform/schedules. The n8n template that comes with this guide runs the Actor once a day and keeps the title, company, pay, remote kind and link of each job.

The field **Only new jobs since the last run** (`onlyNew`) skips jobs that the tool already returned for the same roles, places and filters. Note what it means:

- It returns jobs not delivered before, not the newest ones. Wellfound has no date order.
- If the limit is lower than the number of matching jobs, the next run returns the next undelivered ones.
- The search reads just the pages set in **Pages per search**, so a job that appears deeper is not seen.

## Limits to keep in mind

- The result is a sample. Each company shows one or two of its jobs per search page, so you do not see all the openings of a company.
- Company profile pages, funding data, team data and search by typed text are not covered.
- Skills lists and contact details are not collected. E-mail addresses and phone numbers in descriptions are replaced with `[email removed]` and `[phone removed]`; unusual formats may slip through.
- Pages are ordered by Wellfound, not by date; use **Posted within days** to keep fresh jobs.
- Without **Read each job page**, a "$" salary is reported as USD and the pay period is `null`.
- In "only new" mode, at most one batch may be written again if a write was still on its way when the run was stopped. If a run is killed while it writes a batch and is not resurrected, the next "only new" run may skip that batch.
- Two "only new" runs with the same searches and filters cannot run at the same time.
- The tool reads open pages with no login. If the site refuses anonymous access, the tool stops, keeps the jobs found before and does not bypass any protection.

If a role or place is wrong, the log names it and the tool skips it; when every search is skipped, the run ends with no jobs and a status line that names the search and the reason. A run fails when the problem is on the site's side. If the site changed its format, the tool needs an update. If the site refused anonymous access, the tool does not bypass protection and keeps the results found before.

## Links

- Actor page: https://apify.com/avakode/wellfound-jobs
- Example task, London and remote: https://apify.com/avakode/wellfound-jobs/examples/startup-software-engineer-jobs-london
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Apify Console: https://console.apify.com/
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

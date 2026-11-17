# Remote Python jobs from Dice every day

## Name

Remote Python jobs from Dice every day

## Description

This template starts once a day, runs the Dice Jobs Scraper Actor for remote Python jobs posted within the last 7 days and keeps the main fields of every job: title, company, posting date, salary text and link. The Actor reads the public Dice search result pages and job pages and returns one record per job. The template stops after 20 jobs, because the node waits at most 300 seconds for the call. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Search terms, places, filters and the number of results: edit the JSON body of the node "Run the Actor". The fields are `queries`, `locations`, `employmentType`, `workplaceType`, `postedDate`, `companies`, `minSalary`, `includeDescription`, `onlyNew`, `maxResults` and `maxPagesPerSearch`. The body uses the term `python`, remote jobs, the last 7 days and at most 20 jobs. With `includeDescription` on, the Actor opens one page per job, so a larger input takes longer, and the node waits at most 300 seconds.
- Daily runs: with `onlyNew` off, each day's run returns the same matching jobs again; set `onlyNew` to `true` to avoid that.
- Only new jobs: set `onlyNew` to `true` in the body to skip jobs that an earlier run with the same search already delivered.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". The node keeps `title`, `company_name`, `posted_at`, `salary_text` and `url`. For example, other fields of the record are `source_id`, `company_url`, `location`, `city`, `state`, `country`, `is_remote`, `workplace_types`, `employment_types`, `employer_type`, `salary_min`, `salary_max`, `salary_currency`, `salary_period`, `easy_apply`, `updated_at`, `valid_through`, `skills`, `summary`, `description_text` and `description_html`.
- Pricing is listed on the Actor page: https://apify.com/avakode/dice-jobs

# Wellfound startup jobs every day

## Name

Wellfound startup jobs every day

## Description

This template starts once a day, runs the Wellfound Jobs Scraper Actor for one role and keeps the main fields of every job: title, company, pay text, remote and link. The result is a sample, not the full list, because Wellfound shows a visitor one or two jobs per company on each search page. The template reads one page per search and stops at 80 results, so both searches fit in the limit. Add your own step after the last node to store the rows or send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Role, place, pages and number of results: edit the JSON body of the node "Run the Actor". The fields are `roles`, `locations`, `remote`, `maxPagesPerSearch` and `maxResults`. The body uses `software-engineer`, `london` and the remote page, one page per search (about 30-40 jobs per page) and at most 80 results, so both searches fit in the limit. **Maximum results** is a total for all searches: one search can use the limit up before the other is read. A larger input takes longer, and the node waits at most 300 seconds for the call.
- New jobs: add `"onlyNew": true` to the body. This returns jobs not delivered before, not the newest ones, and from the top pages of each search alone. Two such runs with the same searches cannot work at the same time.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". For example, other fields of the record are `posted_at`, `company_size`, `company_stage`, `salary_min`, `salary_max`, `salary_currency`, `has_equity`, `equity_min`, `equity_max`, `job_type`, `locations` and `description`.
- Pricing is listed on the Actor page: https://apify.com/avakode/wellfound-jobs

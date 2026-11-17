# Xing job postings every day

## Name

Xing job postings every day

## Description

This template starts once a day, runs the Xing Jobs Scraper Actor for one keyword and one city and keeps the main fields of every posting: title, company, location, posting date and link. The Actor reads the public job sitemap of xing.com, selects postings by the words of the job address and opens the matching job pages. The template stops after 20 results, because the node waits at most 300 seconds for the call. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Keywords, cities and the number of results: edit the JSON body of the node "Run the Actor". The fields are `keywords`, `locations`, `postedWithinDays`, `onlyNew` and `maxResults`. The body uses the word `python`, the city `Berlin` and at most 20 results. The Actor makes about 1 request per second, so a larger input takes longer, and the node waits at most 300 seconds. If the call takes longer, lower `maxResults`. Most job titles on Xing are German, so a German word may match more postings. The Actor is not the search of Xing, so the number of postings can be lower than the site search shows.
- Only new: with `onlyNew` off, each run returns the same matches. Set `onlyNew` to `true` to get jobs this tool has not delivered before (it is not the newest jobs). Do not start two runs with the same input at the same time: the second one stops with a message. If a run is killed while it writes a batch, the next run may skip that batch. If a write was still on its way when a run was stopped, at most one batch may be written again.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". For example, other fields of the record are `region`, `postal_code`, `country`, `employment_type`, `industry`, `description_text`, `valid_through`, `company_url`, `source` and `source_id`.
- Pricing is listed on the Actor page: https://apify.com/avakode/xing-jobs

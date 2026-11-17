# AliExpress search results every day

## Name

AliExpress search results every day

## Description

This template starts once a day, runs the AliExpress Search Scraper Actor for one search word and keeps the main fields of every product: title, price, currency, orders sold and link. The Actor reads the public AliExpress search results pages and returns one record per product, with the place of the product in the results. The template stops after one page of results, because the node waits at most 300 seconds for the call. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Search words, pages and the number of results: edit the JSON body of the node "Run the Actor". The fields are `queries`, `maxPagesPerQuery` and `maxResults`. The body uses one word, `led light`, one page and at most 60 results. A larger input takes longer, and the node waits at most 300 seconds.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". Other fields of the record are `query`, `page`, `position`, `source_id`, `image_url`, `original_price`, `discount_percent`, `sold_text`, `rating`, `store_name`, `ships_from`, `is_ad` and `is_gift`.
- Pricing is listed on the Actor page: https://apify.com/avakode/aliexpress-search

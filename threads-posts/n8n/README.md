# Threads account posts every day

## Name

Threads account posts every day

## Description

This template starts once a day, runs the Threads Posts Scraper Actor for one account and keeps the main fields of every post: author, text, date, likes and link. The Actor reads public Threads pages as a visitor without login sees them, so on Apify servers it returns about 5 latest posts of the account, not the full history. The template asks for at most 5 posts and 20 results, because the node waits at most 300 seconds for the call. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Account, number of posts and results: edit the JSON body of the node "Run the Actor". The body follows one account. The page shows about 5 posts to a visitor on Apify servers, so asking for more does not return more. To collect just the posts that no earlier run delivered, set `onlyNew` to `true` and keep the same accounts in every run.
- Schedule: edit the node "Every day". An account that writes more than about 5 posts between two runs loses the older ones, so do not make the interval too long.
- Fields to keep: edit the node "Keep main fields". Other fields of the record are `source_id`, `author_name`, `author_verified`, `language`, `hashtags`, `mentions`, `reply_count`, `repost_count`, `quote_count`, `media_type`, `media_urls`, `link_url`, `link_title`, `quoted_url`, `is_reply`, `reply_to_username`, `depth` and `source`.
- Pricing is listed on the Actor page: https://apify.com/avakode/threads-posts

# Telegram posts by keyword every day

## Name

Telegram posts by keyword every day

## Description

This template starts once a day, runs the Telegram Channel Search Scraper Actor for one word in the channels you name and keeps the main fields of every post: channel, time, word, views and link. The Actor searches inside the public channels on your list, not across all of Telegram, and returns one record per post. The template asks for at most 20 posts per channel and 40 in total, because the node waits at most 300 seconds for the call. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Channels, words and limits: edit the JSON body of the node "Run the Actor". The fields are `channels`, `keywords`, `maxAgeDays`, `maxPostsPerChannel`, `onlyNew`, `maxResults` and `excludeKeywords`. A larger input takes longer.
- New posts on each day: set `onlyNew` to true in the JSON body. The Actor then returns posts that earlier runs for the same channels and words did not return. This mode has limits, for example two such runs with the same channels cannot work at the same time, a run killed while it writes a batch may make the next run skip that batch, and one batch may be written again if a run was stopped during a write; see the limits on the Actor page.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". Other fields of the record are `channel_title`, `channel_subscribers`, `post_id`, `text`, `is_edited`, `reactions_total`, `reactions`, `is_forwarded`, `forwarded_from`, `post_author`, `media`, `links`, `hashtags`, `reply_to_post_id`, `link_preview`, `poll_question` and `source_id`.
- Pricing is listed on the Actor page: https://apify.com/avakode/telegram-channel-search

# Telegram channel posts every day

## Name

Telegram channel posts every day

## Description

This template starts once a day, runs the Telegram Channel Posts Scraper Actor for one public channel and keeps the main fields of every post: channel, time, text, views and link. The Actor reads the open web preview of the channel and returns one record per post, newest at the top. The template reads at most 20 posts, because the node waits at most 300 seconds for the call. It does not use the `onlyNew` field, so each day it returns the latest posts again. Add your own step after the last node to store the rows in a sheet or a database, or to send them to a chat.

## Setup

1. Import `n8n-workflow.json` into n8n.
2. Create a credential of type Header Auth. Set the name to `Authorization` and the value to `Bearer <token>`, where `<token>` is your Apify API token. Choose this credential in the node "Run the Actor".
3. Run the workflow once by hand and check the output of the last node.

The workflow file has no credentials in it, so you must add your own.

## What to change

- Channels and limits: edit the JSON body of the node "Run the Actor". The fields are `channels`, `maxAgeDays`, `maxPostsPerChannel` and `maxResults`. The body uses one channel and at most 20 posts. A larger input takes longer, and the node waits at most 300 seconds. Public channels with an open web preview work.
- Schedule: edit the node "Every day".
- Fields to keep: edit the node "Keep main fields". For example, other fields of the record are `channel_title`, `channel_subscribers`, `post_id`, `source_id`, `is_edited`, `reactions_total`, `reactions`, `is_forwarded`, `forwarded_from`, `post_author`, `media`, `links`, `hashtags`, `reply_to_post_id`, `link_preview` and `poll_question`.
- Pricing is listed on the Actor page: https://apify.com/avakode/telegram-channel-posts

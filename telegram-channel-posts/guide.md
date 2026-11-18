# How to export the latest posts of a public Telegram channel

## Who this is for

You follow a public Telegram channel for news, for a niche or for a competitor, and you want its posts in a table. Copying posts by hand is slow.

The Telegram Channel Posts Scraper Actor reads the open web preview that Telegram publishes for public channels and returns one record per post. No account or API key of Telegram is needed. This guide shows how to run it in Apify Console and from Python, and how to repeat it on a schedule.

## What you get in each record

Each record holds one post. A value that is missing is `null`, dates are ISO 8601 in UTC, and `url` is the address of the post on t.me. These are the main fields:

| Field | What it holds |
|---|---|
| `channel`, `channel_title`, `channel_subscribers` | The channel name, its display name and the subscriber count. |
| `post_id`, `source_id`, `url` | The post number, `channel/post_id` and the post address. |
| `text`, `posted_at` | The post text and the time it was published. |
| `views` | The view count shown under the post. |
| `reactions_total`, `reactions` | The sum of reaction counts and the list, when the channel shows them. |
| `is_forwarded`, `forwarded_from` | Whether the post is forwarded and the source name, when shown. |
| `media`, `links`, `hashtags` | Media addresses, web links and hashtags of the post. |
| `link_preview`, `poll_question` | The link card and the question of a poll post. |

Here are some fields of one record, with values from the Actor documentation:

```json
{
  "post_id": 445,
  "posted_at": "2026-05-14T16:09:50.000Z",
  "views": 3120000,
  "reactions_total": null,
  "is_forwarded": false,
  "reply_to_post_id": null
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/telegram-channel-posts and click the button that opens the Actor in Console.
2. Open the Input tab. The field **Channels** takes one entry per line. Write a channel name, a name with `@`, or a link to the channel on t.me. Public channels with an open web preview work. Groups, invite links and private channels are not supported.
3. Set **Maximum posts per channel** (the newest posts are taken, 0 means no limit) and **Maximum posts in total** (the limit for the whole run). Both default to 100.
4. For recent posts, set the field for posts from the last N days (0 means no age limit), or fill **Posted since (date)** and **Posted until (date)** with a date such as `2026-11-01`. A plain date is a whole day in UTC. With the age limit, the later start applies. A window far in the past costs more requests, because the tool reads from the newest post backwards.
5. Start the run. When it ends, open the Output tab of the run.

The example task reads one channel and takes the latest 50 posts. Open it at https://apify.com/avakode/telegram-channel-posts/examples/track-latest-posts-telegram-channel and put your own channel in the list.

You can set **Maximum cost per run**; the tool stops cleanly at that limit. Pricing is listed on the Actor page.

## Run the same job from Python

Install the Apify API client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`.

The input is the same JSON as in the example task. Save it as `input.json` in the folder of the script:

```json
{ "channels": ["telegram"], "maxAgeDays": 0, "maxPostsPerChannel": 50, "maxResults": 100 }
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
run = client.actor("avakode/telegram-channel-posts").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["posted_at"], item["views"], item["url"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script prints the number of records and three of the newest posts, then saves everything to `results.json`. A Node.js version of the same script is in the code example that comes with this guide. The client libraries are described at https://docs.apify.com/api/client/python and https://docs.apify.com/api/client/js.

## Repeat the job on a schedule

A single run shows the channel at one moment. To follow a channel, run the same input again and again. In Apify Console you can create a schedule that starts the Actor with a saved input at times you choose. How schedules work is described at https://docs.apify.com/platform/schedules.

For scheduled runs, switch on the `onlyNew` checkbox, the one for posts not returned by earlier runs. The tool then remembers the posts it has already returned for this list of channels, and the next run gives the posts that are new since then. The Actor documentation lists three cautions:

- Two runs with `onlyNew` and the same channels cannot work at the same time. The second one stops with a message before it reads anything.
- At most one batch of posts may be written again if a write was still on its way when a run was stopped.
- If a run is killed while it writes a batch and is not resurrected, the next run with `onlyNew` may skip that batch.

The n8n template that comes with this guide runs the Actor once a day. It does not use `onlyNew`, so each day it returns the latest posts again.

## Limits to keep in mind

- Public channels whose web preview is open work. A channel that is private, does not exist or has the preview switched off is skipped with a clear message, and the other channels are still read. If no channel can be read, the run still ends as succeeded with zero posts, and the status line names the skipped channel and the reason. This is different from a refusal by Telegram, described below.
- The tool reads from the newest post backwards, about 20 posts per request, until it reaches your post limit, your age limit or the start of the channel. It makes at most one request per second, so large runs take time.
- The preview shows what Telegram shows to an anonymous visitor. Posts of age-restricted or restricted channels may be missing, reactions appear where the channel shows them, and view counts are rounded the way Telegram rounds them, for example 1.67M.
- The `media` field holds photos, videos, round videos and voice messages. Documents, stickers and poll options are not included; a poll shows just its question in `poll_question`. The media fields hold addresses of files on Telegram servers, and some video links are temporary. Files are not downloaded.
- If Telegram refuses anonymous access, asks the tool to slow down or does not answer, the tool does not bypass protection. The address is closed for the rest of the run, so the run stops at that channel and does not try the others. If posts were already written, the run ends normally; if there are none, it fails.

If the page format changes, open an issue in the Issues tab of the Actor page with the run link.

## Links

- Actor page: https://apify.com/avakode/telegram-channel-posts
- Example task: https://apify.com/avakode/telegram-channel-posts/examples/track-latest-posts-telegram-channel
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Apify Console: https://console.apify.com/
- Python client: https://docs.apify.com/api/client/python
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

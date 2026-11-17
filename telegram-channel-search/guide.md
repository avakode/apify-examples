# How to find Telegram posts by keyword in public channels

## Who this is for

You follow some public Telegram channels and want to know where a word, a product name or a topic appears in them. Doing this by hand takes a long time.

The Telegram Channel Search Scraper Actor looks for your words inside the public channels that you name and returns one record per post. It is not a search across all of Telegram: it never looks outside your list.

## What you get in each record

Each record is one post. A missing value is `null` in the JSON data, and dates are ISO 8601 in UTC. These are the main fields:

| Field | What it holds |
|---|---|
| `channel`, `channel_title` | The channel name and its display name. |
| `post_id`, `url` | The post number and the post address on t.me. |
| `matched_keyword` | The search word that found the post. |
| `text` | The post text as plain text. |
| `posted_at` | The time the post was published. |
| `views` | The view count shown under the post. Telegram rounds large counts. |
| `reactions_total` | The sum of the reaction counts, when the channel shows them. |
| `media` | Photos, videos, round videos and voice messages, each with a type and an address. |
| `links`, `hashtags` | The links and hashtags written in the text. |

There are more fields, such as `is_forwarded`, `link_preview` and `poll_question`. Here is a shortened record, with values from the Actor documentation:

```json
{
  "channel": "telegram",
  "channel_title": "Telegram News",
  "matched_keyword": "update",
  "text": "For all the features from this update…",
  "posted_at": "2026-05-14T16:09:50.000Z",
  "views": 3120000,
  "reactions_total": null,
  "post_id": 445
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/telegram-channel-search and click the button that opens the Actor in Console.
2. Open the Input tab. The field **Channels** takes one entry per line: a channel name, a name with `@`, or a link on t.me. The search runs inside each of them.
3. Fill in **Words to search**, one word or phrase per line.
4. Set **Maximum posts per channel**. The newest matches come at the top, and 0 means no limit. The default is 100.
5. Set **Maximum posts in total**, the limit across all channels. The default is 100.
6. Optionally set the dates **Posted since (date)** and **Posted until (date)**, or **Exclude words**.
7. Start the run. When it is done, open the Output tab of the run. The Overview view shows the main fields, and the records can be exported.

The example task searches two public channels for the word `privacy`, with at most 50 posts per channel and 100 in total, so the total limit does not cut either channel. Open it at https://apify.com/avakode/telegram-channel-search/examples/find-privacy-posts-telegram-channels and change the channels and the word to your own.

You can also set **Maximum cost per run**, and the tool stops cleanly at that limit. Pricing is listed on the Actor page.

## Run the same search from Python

Install the Apify API client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`. Keep the token out of your code.

The input is the same as in the task above, without the empty date fields. Save it as `input.json` in the folder of the script:

```json
{ "channels": ["telegram", "durov"], "keywords": ["privacy"], "maxAgeDays": 0, "maxPostsPerChannel": 50, "onlyNew": false, "maxResults": 100, "excludeKeywords": [] }
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
run = client.actor("avakode/telegram-channel-search").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["channel"], item["posted_at"], item["views"], item["url"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script prints the record count, shows three and saves everything to `results.json`. A Node.js version of the same script is in the code example that comes with this guide.

## Repeat the search on a schedule and keep the new posts

For every channel and word, the tool uses the search of the channel's web preview and reads the matches from the newest backwards, about 20 posts per request, until it reaches your limit, your age limit or the last match.

In Apify Console you can create a schedule that starts the Actor with a saved input at times you choose. How schedules work is described at https://docs.apify.com/platform/schedules. The n8n template that comes with this guide runs the Actor once a day.

For a scheduled run, switch on the checkbox `onlyNew`, the one about posts not returned by earlier runs. The Actor remembers the posts it already returned for this list of channels and gives only new ones on the next run. Note:

- Two runs in this mode with the same channels cannot work at the same time: the second one stops with a message.
- If a run is killed in the middle of saving results and is not started again (resurrected), the next run in this mode may skip that batch, a group of records written together.
- At most one batch may be written again if a write was still on its way when the run was stopped.

## Limits to keep in mind

- The search runs inside the channels you name. There is no search across all of Telegram.
- How words match is decided by the search of Telegram, not by this tool. It works on whole words, so a fragment of a word may not match. Results are as complete as the preview search is, no more, and the tool does not filter the text again.
- The channels must be public and have an open web preview. A channel without one is skipped with a message, and the other channels are still read. Groups, private accounts and invite links are not supported, and no profiles of people are collected.
- The preview shows what Telegram shows an anonymous visitor. View counts are rounded the way Telegram rounds them. Posts of age-restricted or restricted channels may be missing.
- The `media` field holds addresses of photos, videos, round videos and voice messages. Documents, stickers and poll options are not included. Some video links are temporary. Files are not downloaded.
- A window of dates far in the past costs more requests.
- The tool makes at most one request per second, so large runs take time.
- If Telegram refuses access, the tool does not get around any protection. The address is closed for the rest of the run, so the run stops at that channel and does not try the others. If posts were already written, the run ends normally and the status line names the reason and the number of posts. If none were written, the run fails with that message.

When a run fails, the message says whether the input needs a fix, the site changed its format, or the site blocked access. For a changed format, open an issue in the Issues tab with the run link.

## Links

- Actor page: https://apify.com/avakode/telegram-channel-search
- Example task: https://apify.com/avakode/telegram-channel-search/examples/find-privacy-posts-telegram-channels
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Python client: https://docs.apify.com/api/client/python
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

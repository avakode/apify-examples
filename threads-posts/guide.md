# How to track the latest public posts of a Threads account

## Who this is for

You want to follow what a brand or a newsroom posts on Threads, and how the posts perform, without copying numbers by hand.

The Threads Posts Scraper Actor reads public Threads pages the way a visitor without login sees them and returns one record per post. The limit comes up front: on Apify servers Threads shows a visitor about 5 latest posts of an account, and no more. This guide is about the latest posts, not the full history.

## What you get in each record

Each record holds one post. A missing value is `null`, and dates are ISO 8601 in UTC. These are the fields:

| Field | What it holds |
|---|---|
| `url`, `source_id` | The address of the post and its short code. |
| `author_username`, `author_name`, `author_verified` | The author of the post. |
| `text`, `language` | The post text and the language Threads detected. |
| `created_at` | When the post was written. |
| `like_count`, `reply_count`, `repost_count`, `quote_count` | The counts at the time of the run. |
| `media_type`, `media_urls` | `text`, `image`, `video` or `carousel`, and temporary media links: download the files soon. |
| `hashtags`, `mentions`, `link_url`, `link_title`, `quoted_url` | Tags and usernames in the text, the link card with its title and the quoted post. |
| `is_reply`, `reply_to_username`, `depth`, `source` | Whether the post answers another post and whom, its level (always 0 for account posts) and the input entry that produced it. |

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open https://apify.com/avakode/threads-posts and click the button that opens the Actor in Console.
2. In the Input tab, the field **Accounts** takes one entry per line: a username with or without `@`, or a profile link.
3. Set **Skip replies** to leave out posts that answer another post, including the author continuing their own thread.
4. Set **Posts per account**, from 1 to 25. The default is 10, and so is the example. Threads shows about 5 posts to a visitor on Apify servers, so expect about 5 records per account even when you ask for 10 or more.
5. Set **Maximum results**, the total number of records after which the run stops. The default is 100.
6. The fields **Posted since (date)**, **Posted until (date)** and **Replies per linked post** narrow the dates and the replies of a linked post.
7. Start the run, then open the Output tab of the run. The Overview view shows the main fields, and the records can be exported.

The example task has one account, 10 posts per account and a maximum of 100 results. Open it at https://apify.com/avakode/threads-posts/examples/track-latest-threads-account-posts and change the account to your own. Pricing is listed on the Actor page.

## Run the same job from Python

Install the client with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`, not in your code.

The input is the same JSON as in the task above. Save it as `input.json` in the folder of the script:

```json
{
  "accounts": ["zuck"],
  "postLinks": [],
  "postedSince": null,
  "postedUntil": null,
  "excludeReplies": false,
  "maxPostsPerAccount": 10,
  "maxRepliesPerPost": 50,
  "onlyNew": false,
  "maxResults": 100
}
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
run = client.actor("avakode/threads-posts").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["created_at"], item["like_count"], item["url"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script prints how many records there are, shows three of them and saves all to `results.json`. Expect about 5 records for one account, not 10. A Node.js version is in the code example that comes with this guide. The client is described at https://docs.apify.com/api/client/python.

The field `postLinks` takes links to single posts. Each returns the post, the author's own continuation and a handful of top-level replies. The example leaves it empty.

## Repeat the job on a schedule

To follow an account, run the same input again on a schedule. Apify Console can start the Actor with a saved input at set times, as described at https://docs.apify.com/platform/schedules. The n8n template that comes with this guide runs the Actor once a day and keeps the author, text, date, likes and link of each post.

The mode **Only new since the last run** returns the posts that no earlier run with the same accounts and links delivered. Do not start two such runs at the same time: the second one stops with a message before it reads anything.

A repeat run still opens each page once and can return nothing. Because the page shows about 5 posts, an account that writes more than that between two runs loses the older ones: the Actor cannot return what the page does not show. For a busy account, run often.

If a run is killed while it writes a batch and is not resurrected, the next "only new" run may skip that batch. At most one batch may be written again if a write was still on its way when the run was stopped.

## Limits to keep in mind

- Without login, Threads shows about 5 latest posts of an account on Apify servers. From a home network the page can show more, but the result of an Apify run is what you get. Older posts are not available.
- So **Posts per account** can promise more than the site gives. The example task asks for up to 10 posts, and you should expect about 5.
- A post link returns a few top-level replies, not the whole tree.
- Search by keyword or hashtag is not available. Follower lists and profile biographies are not read.
- Private, deleted or restricted accounts and posts return nothing.
- The page layout can change, and the Actor then needs an update.
- The terms of Threads and its robots.txt restrict automated access, and you are responsible for using the data in line with them.
- An account for which Threads shows a login prompt and nothing else, or sends the visitor to its login page, is reported as not found or hidden, and the run goes on. Two such pages in a row count as access closed, and the run stops.
- If Threads answers with a verification page or an error such as 401, 403 or 429, the Actor does not get around it: the run stops at that target and does not try the rest.
- A wrong entry, such as a username or link that does not look right, is named in the log and the run goes on with the next one.

If the site changed its format, open an issue from the Actor page.

## Links

- Actor page: https://apify.com/avakode/threads-posts
- Example task: https://apify.com/avakode/threads-posts/examples/track-latest-threads-account-posts
- Apify Console: https://console.apify.com/
- Schedules: https://docs.apify.com/platform/schedules

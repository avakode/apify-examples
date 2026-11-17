# How to compare AliExpress prices and orders sold by search word

## Who this is for

You want to see which products AliExpress shows for a search word, and what they cost. Maybe you compare prices for several keywords, or you watch how the order of products changes from day to day. Doing this by hand means opening many pages and copying numbers into a sheet.

The AliExpress Search Scraper Actor reads the public search results pages for you and returns one record per product. This guide shows how to run it in Apify Console, how to run the same search from Python, and how to repeat it on a schedule.

## What you get in each record

Each record holds one product for one search word. A value that is missing is `null`. These are the fields:

| Field | What it holds |
|---|---|
| `query` | The search word the product was found with. |
| `page` | The results page the product was on. |
| `position` | The place in the results for the word. A page has 60 places, and sponsored places are counted. |
| `source_id` | The AliExpress product id. |
| `title` | The product title. |
| `url` | The product page address. |
| `image_url` | The main image of the results card. |
| `price`, `currency` | The price shown on the card and its currency code. |
| `original_price` | The price before the discount, when the card shows one. |
| `discount_percent` | The discount in percent, when shown. |
| `sold_count` | Orders sold as a number. For "10K+ sold" this is the lower bound, 10000. |
| `sold_text` | Orders sold as written on the card. |
| `rating` | The average star rating, when shown. |
| `store_name` | The store name, when the card carries it. |
| `ships_from` | The country code the item ships from, when the card carries it. |
| `is_ad` | True for a sponsored place. |
| `is_gift` | True for a gift card. Such a card has no price of its own. |

Here are some of the fields of one record, with the values from the Actor documentation:

```json
{
  "query": "led light",
  "page": 1,
  "position": 1,
  "source_id": "3256812686755829",
  "price": 1.09,
  "currency": "USD",
  "original_price": 30.44,
  "discount_percent": 96,
  "sold_count": 253,
  "sold_text": "253 sold",
  "rating": 4.9,
  "is_ad": false
}
```

## Run it in Apify Console

1. Sign in to [Apify Console](https://console.apify.com/), open the Actor page at https://apify.com/avakode/aliexpress-search and click the button that opens the Actor in Console.
2. Open the Input tab. The field **Search words or search page links** takes one entry per line. Write a search word such as `led light`, or paste a link to an AliExpress search results page. A link can end with `?page=3` to start at page 3. Links to product pages are refused.
3. Set **Pages per search word**. It is a number from 1 to 10, and the default is 5. Each page holds about 60 products.
4. Set **Maximum results**. The run stops after this many products in total. The default is 100.
5. Start the run. When it is done, open the Output tab of the run. The Overview view shows the main fields in a table, and the records can be exported.

The example task uses two search words, `led light` and `usb cable`, with 1 page per word and a maximum of 120 results, so both words fit into one run. You can open it on the Actor page at https://apify.com/avakode/aliexpress-search/examples/compare-led-light-prices-orders-aliexpress and change the words to your own.

You can also set **Maximum cost per run**. The tool stops cleanly when that limit is reached. Pricing is listed on the Actor page.

## Run the same search from Python

You can start the Actor from code with the Apify API client. Install it with `pip install apify-client` and put your Apify API token in the environment variable `APIFY_TOKEN`. Keep the token out of your code and out of version control.

The input is the same JSON as in the task above. Save it as `input.json` in the folder of the script:

```json
{ "queries": ["led light", "usb cable"], "maxPagesPerQuery": 1, "maxResults": 120 }
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
run = client.actor("avakode/aliexpress-search").call(run_input=run_input)
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())

print(f"{len(items)} records")
for item in items[:3]:
    print(item["position"], item["title"], item["price"], item["currency"])

(here / "results.json").write_text(json.dumps(items, indent=2))
```

The script waits until the run ends, reads all records of the dataset, prints how many there are and shows the top three. Then it saves everything to `results.json`. A Node.js version of the same script is in the code example that comes with this guide. The client libraries are described at https://docs.apify.com/api/client/python and https://docs.apify.com/api/client/js.

## Repeat the search on a schedule

A single run shows the results of one moment. To see how prices and places change, run the same input again on another day and compare the two files. The `query`, `source_id` and `position` fields help you match the same product between runs.

In Apify Console you can create a schedule that starts the Actor with a saved input at times you choose. How schedules work is described at https://docs.apify.com/platform/schedules. You can also start the run from an automation tool. The n8n template that comes with this guide runs the Actor once a day and keeps the title, price, currency, orders sold and link of each product.

This Actor has no mode that returns just the new products. Every run returns the products that the search pages show at that time, so compare the runs yourself.

## Limits to keep in mind

- The tool reads search results pages. It does not open product pages, so variants, specifications, descriptions and reviews are not returned. AliExpress shows a verification page to automated visits of product pages, and the tool does not try to get past it.
- One run reads up to 10 search pages in total, which is about 500 products. Pages per search word is counted within that total. The tool makes one request per second.
- The review count is not on the results card, so it is not returned.
- Prices, currency, delivery and order depend on the country the request comes from. AliExpress sends some networks to a regional site, such as aliexpress.ru. The tool does not read that site and reports it as a block.
- A card without a price, such as a gift card (`is_gift` is true), has `price` set to `null`. The store name and the ships-from country are present where the card carries them.
- "Orders sold" is rounded by the site for large numbers, for example "10K+".
- If AliExpress answers with a verification page, a login wall or a redirect to another regional site, the tool stops and keeps the products it has already collected. It does not log in, use cookies or proxies, or get around any protection.

When a run fails, the message tells you which of three things happened: the input needs a fix, the site changed its format, or the site blocked access. For a changed format, open an issue in the Issues tab of the Actor page with the run link.

## Links

- Actor page: https://apify.com/avakode/aliexpress-search
- Example task: https://apify.com/avakode/aliexpress-search/examples/compare-led-light-prices-orders-aliexpress
- Code example and n8n template: [python/](python/), [node/](node/), [n8n/](n8n/)
- Apify Console: https://console.apify.com/
- Python client: https://docs.apify.com/api/client/python
- JavaScript client: https://docs.apify.com/api/client/js
- Schedules: https://docs.apify.com/platform/schedules

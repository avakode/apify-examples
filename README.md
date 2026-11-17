# Apify Actor examples by Avakode

Code examples and n8n workflow templates for the Actors that Avakode publishes in the Apify Store. Each folder belongs to one Actor and shows the same small run three ways: from Python, from Node.js and from n8n.

## Examples

| Folder | Actor | What the example does |
|---|---|---|
| [aliexpress-search](aliexpress-search/) | [AliExpress Search Scraper](https://apify.com/avakode/aliexpress-search) | Reads the search results for two search words and saves title, price and orders sold of each product. |
| [dice-jobs](dice-jobs/) | [Dice Jobs Scraper](https://apify.com/avakode/dice-jobs) | Collects remote jobs for one search word, posted in the last seven days. |
| [telegram-channel-posts](telegram-channel-posts/) | [Telegram Channel Posts Scraper](https://apify.com/avakode/telegram-channel-posts) | Exports the latest posts of a public channel. |
| [telegram-channel-search](telegram-channel-search/) | [Telegram Channel Search Scraper](https://apify.com/avakode/telegram-channel-search) | Finds the posts with a keyword in two public channels. |
| [wellfound-jobs](wellfound-jobs/) | [Wellfound Jobs Scraper](https://apify.com/avakode/wellfound-jobs) | Collects startup jobs for one role, in one city and remote, with salary and equity. |
| [xing-jobs](xing-jobs/) | [Xing Jobs Scraper](https://apify.com/avakode/xing-jobs) | Collects job postings for one keyword and one city. |

## What is in a folder

- `README.md`: what the example does and how to run it.
- `input.json`: the input of the run. The Actor page describes the fields.
- `python/` and `node/`: the same run from Python and from Node.js. The script starts the Actor, waits for the run to end, prints a short summary and saves the records to `results.json`.
- `n8n/`: a workflow template for n8n (`n8n-workflow.json`) and a `README.md` with the setup steps.

## What you need

- An Apify account and its API token. The scripts read the token from the environment variable `APIFY_TOKEN`. Do not write the token in the code and do not commit it.
- Python 3 with `pip`, or Node.js with `npm`.
- n8n, if you want to use the workflow templates.

The runs are started in your own Apify account. Each Actor page lists the limits of the Actor and its pricing.

## Questions and problems

Open an issue on the page of the Actor in the Apify Store and add the input you used.

## License

The examples are published under the MIT License, see [LICENSE](LICENSE).

import { readFile, writeFile } from 'node:fs/promises';
import { ApifyClient } from 'apify-client';

const input = JSON.parse(await readFile(new URL('../input.json', import.meta.url), 'utf8'));

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('avakode/threads-posts').call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`${items.length} records`);
for (const item of items.slice(0, 3)) {
  console.log(item.created_at, item.like_count, item.url);
}

await writeFile(new URL('./results.json', import.meta.url), JSON.stringify(items, null, 2));

# Scraping tool

This is a scraping tool for FilCrate using `request` and `cheerio` packages. It will scrape data from https://www.filstop.com/ which is a famous online retailer for Filipino products. The data consists of products with their name, image, price, weight, category, and sku. All ratings will be set to 0.

## Prerequisites

Please make sure that the backend has the latest migrations and a Postgres database is running. The tool will fill data to the `Products` table in `filcrate_dev` database.

## How to run

Open a terminal and run these commands.

1. `cd scraper`
2. `npm install`
3. `node scrape.js`

## Dependencies

1. Request
2. Cheerio
3. Sequelize

---

All of the data we scraped belongs to https://www.filstop.com/. The data is used purely for educational purposes only.
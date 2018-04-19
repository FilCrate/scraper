const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const Product = require('./models').Products;

// Categories
const url_bottle_canned = "https://www.filstop.com/bottled-canned/?sort=bestseller&objects_per_page=48";
const bottle_canned = "Bottled/Canned"
generateModel(url_bottle_canned, bottle_canned);

const url_rice = "https://www.filstop.com/rice/?sort=bestseller&objects_per_page=48";
const rice = "Rice";
generateModel(url_rice, rice);

const url_noodles = "https://www.filstop.com/noodles/?sort=bestseller&objects_per_page=48";
const noodles = "Noodles";
generateModel(url_noodles, noodles);

const url_flavorings = "https://www.filstop.com/condiment-spreads/?sort=bestseller&objects_per_page=48";
const flavorings = "Condiments";
generateModel(url_flavorings, flavorings);

const url_soup = "https://www.filstop.com/filipino-instant-soup/?sort=bestseller&objects_per_page=48";
const soup = "Soup";
generateModel(url_soup, soup);

const url_snacks = "https://www.filstop.com/filipino-snacks/?sort=bestseller&objects_per_page=48";
const snacks = "Snacks";
generateModel(url_snacks, snacks);

const url_drinks = "https://www.filstop.com/drinks/?sort=bestseller&objects_per_page=48";
const drinks = "Drinks";
generateModel(url_drinks, drinks);

const url_frozen = "https://www.filstop.com/filipino-frozen-goods/?sort=bestseller&objects_per_page=48";
const frozen = "Frozen";
generateModel(url_frozen, frozen);

const url_health = "https://www.filstop.com/filipino-health-products/?sort=bestseller&objects_per_page=48";
const health = "Health";
generateModel(url_health, health);

const url_misc = "https://www.filstop.com/miscellaneous/?sort=bestseller&objects_per_page=48";
const misc = "Miscellaneous";
generateModel(url_misc, misc);


function generateModel (url, category) {
	return new Promise((resolve, reject) => {
		request(url, (err,resp, body) => {
			if(err) {return reject(err);}
			let $ = cheerio.load(body);
			const image_arr = [];
	        const image_parent = '.product-cell-right';
            const image_child = '.top';
	        $(image_child, image_parent).each(
            	function() {
					if (this) {
						let img_urls = ("https://www.filstop.com" + this.children[0].next.attribs.href);
						image_arr.push(img_urls);
						console.log(img_urls);
					}
					resolve({image_arr: image_arr});
            	}
            )
	    });
	})
	.then((result) => {
		Promise.all(result.image_arr.map((url) => {
			return new Promise((resolve,reject) => {
				request(url, (err,resp, body) => {
					if(err) {return reject(err);}
					let $ = cheerio.load(body);
					const image_parent = '.image';
                    const image_child = '.image-box';
			        $(image_child, image_parent).each (
			            function() {
			                if (this) {
                                img_url = (this.children[0].next.attribs.src);
                                console.log(img_url);
								resolve(img_url);
			                }
						}
					);
				})
			})
		}))
		.then((res) => {
			console.log(`Category: ${category}`);
			request(url, function(error, response, html) {
				if (!error && response.statusCode == 200) {
					// Load the html we want to scrape
					const $ = cheerio.load(html);

					// Get all stock and store them in an array
					const stock_arr = [];
					const stock_parent = '.product-cell-left';
					const stock_child = '.stock';
					$(stock_child, stock_parent).each (
					    function() {
					        if (this) {
					            const stock = this.children[0].data.replace(/\D/g,'');
					            stock_arr.push(stock);
					        }
					    }
					)
			
					// // Get all weights and store them in an array
					const weight_arr = [];
					const weight_parent = '.product-cell-left';
					const weight_child = '.text-smallest';
					$(weight_child, weight_parent).each (
					    function() {
					        if (this) {
					            const weight = this.children[0].data.replace(/[^\d.-]/g,'');
					            weight_arr.push(weight);
					        }
					    }
					)

					// Final products seed for the database
					for (i = 0; i < $("script[type='application/ld+json']").length; i++) {
					    const products = {};
					    const item = JSON.parse($("script[type='application/ld+json']").get()[i].children[0].data);
					    products.name = item.name;
					    products.image = res[i]
					    products.price = item.offers.price;
					    products.rating = 0;
					    ((stock_arr[i] === "") ? products.stock = 0 : products.stock = stock_arr[i]);
					    products.category = category;
					    products.weight = weight_arr[i];
					    products.sku = item.sku;
						Product.create(products)
						console.log(products);
                    };
                    console.log("Done");
				}
            })
        });
        console.log("Done fetching product links. Now getting images");
	}).catch((err) => {
		console.log("AHHHHHHHH SOMETHING BROKE!");
	})
}


// Object model from filstop
// { '@context': 'http://schema.org',
//   '@type': 'Product',
//   name: 'Tome Sardines Tomato Sauce  Olive Oil 4.7oz ',
//   sku: '0650882217043',
//   image: 'https://www.filstop.com/images/T/0650882217043_tn.jpg',
//   brand: 'TOME',
//   offers:
//    { '@type': 'Offer',
//      availability: 'http://schema.org/InStock',
//      price: '2.29',
//      priceCurrency: 'USD' } }
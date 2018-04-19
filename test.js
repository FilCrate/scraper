const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const url_bottle_canned = "https://www.filstop.com/bottled-canned/?sort=bestseller&objects_per_page=48";
const bottle_canned = "Bottled/Canned"
test(url_bottle_canned, bottle_canned);

const url_rice = "https://www.filstop.com/rice/?sort=bestseller&objects_per_page=48";
const rice = "Rice";


function test (url, category) {
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
								console.log("3")
			                    img_url = (this.children[0].next.attribs.src);
								resolve(img_url);
			                }
						}
					);
				})
			})
		}))
		.then((res) => {
			console.log(category)
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
						// Product.create(products)
						console.log(products);
					};
				}
			})
		});
	}).catch((err) => {
		console.log("AHHHHHHHH SOMETHING BROKE!");
	})
}
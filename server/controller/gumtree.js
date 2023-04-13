import fetch from 'node-fetch';
import * as cheerio from "cheerio";


// web crawling class
class ScrapeGumtree {

    // function to scrape the house
    static async getSearchedLocationBasedOnPostalCode(req, res) {
        try {

            const { postalCode } = req.params;

            const url = `https://www.gumtree.com/search?featured_filter=false&q=&search_category=property-to-rent&urgent_filter=false&sort=date&search_scope=false&photos_filter=false&search_location=Edinburgh&tl=&distance=0.0001/${postalCode}` // website URL

            const response = await fetch(url); // return url response
            const html = await response.text();
            const $ = cheerio.load(html);
            const listings = []; // 
        
            // looping through the HTML code structure
            $('.grid-col-12 > .list-listing-maxi > .natural').each((i, el) => {
              const listing = {};
              listing.title = $(el).find('.listing-content .listing-title').text().trim(); // getting the title text
              listing.address = $(el).find('.listing-location .truncate-line').text().trim(); // getting the address text
              listing.description = $(el).find('.listing-description').text().trim(); // getting the description text
              listing.agent = $(el).find('.listing-attributes li span:nth-child(2)').text().trim(); // getting the full information about the room.
              listing.rooms = $(el).find('.listing-attributes li span:last').text(); // getting the number of rooms text
              listing.link = $(el).find('.listing-link').attr().href; // getting the link to view a room
              listing.price = $(el).find('.listing-price-posted-container .listing-price').text().trim(); // getting the price text
              listing.thumbnail = $(el).find('.listing-link .listing-side .listing-thumbnail img').attr("data-src") //getting the image
        
              listings.push(listing);
            });

            if(listings.length > 0) {
                return res.json({
                    data: listings
                })
            }
            else {
                return res.json({
                    data: []
                })
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }
}

export default ScrapeGumtree;

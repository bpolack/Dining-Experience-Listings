# React-Experiences-Listings
Load React based experience/business listings via this Wordpress Plugin. Uses the Wordpress REST API as a backend, with configurable post-type and meta fields.

## Description
The function of this project is to create a React frontend widget to display experience listings or business listings on client websites. The main goal is to be able to easily and quickly integrate this frontend widget with a client's **existing** custom post types and custom fields within Wordpress.

## Roadmap / Modules

1. Wordpress plugin creation & configuration, with PHP backend responsible for loading the shortcode and passing user created attributes to React.
2. Create the React template app to accept and pass user attributes from PHP as props.
3. Design the JavaScript components responsible for fetching data from Wordpress API, based on user attributes.
4. Configure the listing view "Grid" state to display data from the API.
5. Configure the listing view "Single" state to display a single listing from API, with full details.
6. Configure the listing view "Map" state to display listings as map pins using the Google Maps API.
7. Design and implement a Filters & Categories component, to display additional filtering options to the user.

## Prerequisites

* A properly configured Wordpress installation with REST API
* A custom post type for your Listings, ex: "business_listing"
* Custom fields to contain your listing meta (Advanced Custom Fields)
* (Optional) Custom taxonomies or categories to organize your listings

## Quick Setup
Prior to installation, you may want to modify webpack configuration, or other default settings within the plugin. If you choose to do so, you will need to rebuild the project using the following command. (You will need to have node installed on your device)

```
\> npm run-script build
```

Once the project is built, or if you are using the plugin as is, you may activate the Wordpress plugin, and proceed to the setting configuration to match your needs under **Settings > Experience Listings** in the Wordpress Admin Panel. 

Your listing configuration settings may vary, but in general you will require your Wordpress API URL, custom post type slug, custom taxonomy slugs, and any ACF field names you wish to include. Sample configuration:

```
API URL: https://your-wordpress-site.com/wp-json
Listing Post Type: listing
Custom Taxonomy: listing_category
Custom Taxonomy Region: region
ACF Phone Field: phone
ACF Website Field: website
ACF Address Field: address
ACF Map Field: location
```

Once configured, you can include the module anywhere in Wordpress, using the following shortcode: 

```
[react_experiences view="grid" initial_category="0" exclude_categories="10,5,7" ]
```

Optional Shortcode attributes (with default values):

```javascript
view='grid'
perpage='6'
initial_category='0'
exclude_categories=''
initial_region=''
exclude_regions=''
```

## Built With

* ReactJS
* Node-WPAPI
* Redux (currently not using, but may switch to Redux)
* PHP

## Authors

* **[Braighton Polack](https://github.com/bpolack/)** - Dev

See also the list of [contributors](https://github.com/bpolack/React-Experiences-Listings/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* TBD

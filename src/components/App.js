const { Component } = wp.element;
import WPAPI from 'wpapi/browser/wpapi.min';
import { v3 as uuidv3 } from 'uuid';
import Loader from 'react-loader-spinner';
import { initGA } from '../helpers/relTracker';
import './App.css';

// Import Components
import RelHeader from './layout/header/RelHeader';
import RelFooter from './layout/footer/RelFooter';
import RelListingGrid from './views/ListingGrid/RelListingGrid';
import RelListingRows from './views/ListingRows/RelListingRows';
import RelListingMap from './views/ListingMap/RelListingMap';
import RelListingSingle from './views/ListingSingle/RelListingSingle';
import RelModal from './layout/modules/RelModal/RelModal';

export class App extends Component {

    constructor(props) {
        super(props);

        // Set the initial state
        this.state = {
            view: props.args.view,
            loading: true,
            modalOpened: false,
            modalListing: false,
            page: 1,
            currentCategory: props.args.initialCategory,
            currentTag: props.args.initialTag,
            currentRegion: props.args.initialRegion,
            categories: [],
            tags: [],
            regions: [],
            listings: []
        };

        // Configure WPAPI handlers
        this.relWP = new WPAPI({ endpoint: props.globals.apiLocation });
        this.relWP.relListings = this.relWP.registerRoute('wp/v2', '/' + props.globals.postType + '/(?P<id>\\d+)');
        this.relWP.relCategories = this.relWP.registerRoute('wp/v2', '/' + props.globals.categoryName + '/');
        this.relWP.relTags = this.relWP.registerRoute('wp/v2', '/' + props.globals.tagName + '/');
        this.relWP.relRegions = this.relWP.registerRoute('wp/v2', '/' + props.globals.regionName + '/');

        // Bind callback methods to class
        this.changeView = this.changeView.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.changeTag = this.changeTag.bind(this);
        this.changeRegion = this.changeRegion.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentDidMount() {
        // Initialize GA tracking
        if (this.props.globals.trackingID) {
            initGA(this.props.globals.trackingID);
        }

        if (this.state.view !== 'single') {
            this.fetchCategories(this.state.currentCategory);
            this.fetchTags(this.state.currentTag);
            this.fetchRegions(this.state.currentRegion);
            this.fetchNextListings();
        }
        else {
            this.fetchSingleListing(this.props.args.singleListing);
        }
    }

    // Method to change the active view
    changeView(view) {
        // If we are leaving map view, flush the listings and reset currentCategory
        if (this.state.view === "map") {
            this.setState({
                view: view,
                page: 1,
                listings: [],
                loading: true
            }, () => {
                this.fetchNextListings();
            })
        }
        else {
            this.setState({
                view: view
            })
        }
    }

    // Method to change the active category
    changeCategory(category) {
        this.setState({
            currentCategory: category,
            page: 1,
            listings: [],
            loading: true
        }, () => {
            this.fetchCategories(category); // configure fetch for subcats
            this.fetchNextListings();
        })
    }

    // Method to change the active tag
    changeTag(tag) {
        if (tag == this.state.currentTag) {
            // Toggle tag filtering off
            this.setState({
                currentTag: this.props.args.initialTag,
                page: 1,
                listings: [],
                loading: true
            }, () => {
                this.fetchNextListings();
            })
        }
        else {
            this.setState({
                currentTag: tag,
                page: 1,
                listings: [],
                loading: true
            }, () => {
                this.fetchNextListings();
            })
        }
    }

    // Method to change the active region
    changeRegion(region) {
        if (region == this.state.currentRegion) {
            // Toggle region filtering off
            this.setState({
                currentRegion: this.props.args.initialRegion,
                page: 1,
                listings: [],
                loading: true
            }, () => {
                this.fetchNextListings();
            })
        }
        else {
            this.setState({
                currentRegion: region,
                page: 1,
                listings: [],
                loading: true
            }, () => {
                this.fetchNextListings();
            })
        }
    }

    // Method to load more listings
    loadMore(callback) {
        const currentPage = this.state.page;
        
        if (typeof this.state.totalPages !== 'undefined') {
            // Check that currentPage is less than totalPages
            if (currentPage < this.state.totalPages) {
                this.setState({
                    page: currentPage + 1,
                    loading: true
                }, () => {
                    this.fetchNextListings();
                    if (typeof callback === 'function') {
                        callback(true); // If a callback is set, param true if there may be more to load
                    }
                })
            }
            else {
                if (typeof callback === 'function') {
                    callback(false); // Or false if there is not more to load
                }
            }
        }
        else {
            // Callback early if totalPages state has not yet been set
            if (typeof callback === 'function') {
                callback(true); 
            }
        }

    }

    // Method to fetch a single listing, given the listing ID
    fetchSingleListing(singleListingId) {
        if (singleListingId != false) {
            this.relWP.relListings()
                .id(parseInt(singleListingId))
                .param('_embed', "1")
                .then((data) => {
                    if (data) {
                        this.setState({
                            modalListing: data,
                            loading: false
                        })
                    }
                    else {
                        console.error("No listing found with provided ID");
                    }
                })
                .catch((err) => {
                    console.error("WP API Fetch Error - Are you requesting a page that doesn't exist?");
                    this.setState({
                        loading: false
                    })
                });
        }
        else {
            console.error("Must provide a shortcode argument single_listing for single view");
        }

    }

    // Method to fetch the next set of listings from the API
    fetchNextListings() {

        // Destruct required props and states
        const { categoryName, tagName, regionName } = this.props.globals;
        const { perpage, excludeCategories, initialCategory } = this.props.args;
        const { currentCategory, currentTag, currentRegion, page } = this.state;

        this.relWP.relListings()
            .param(categoryName, (currentCategory != false) ? currentCategory.trim().split(',') : [])
            .param(categoryName + '_exclude', (excludeCategories != false && currentCategory == initialCategory) ? excludeCategories.trim().split(',') : [])
            .param(regionName, (currentRegion != false) ? currentRegion.trim().split(',') : [])
            .param(tagName, (currentTag != false) ? currentTag.trim().split(',') : [])
            .param('_embed', "1")
            .order('asc')
            .orderby('title')
            .page(page)
            .perPage(perpage)
            .then((data) => {
                if (data.length > 0) {
                    // Hash static keys to every listing
                    data.forEach(listing => listing.key = uuidv3(JSON.stringify(listing), uuidv3.URL));

                    this.setState({
                        listings: this.state.listings.concat(data),
                        totalPages: data._paging.totalPages,
                        loading: false
                    })
                }
                else {
                    this.setState({
                        totalPages: 0,
                        loading: false
                    })
                }
            })
            .catch((err) => {
                console.error("WP API Fetch Error - Are you requesting a page that doesn't exist?");
                this.setState({
                    loading: false
                })
            });
    }

    // Recursive function to re-create a categories state array with potential subcategories
    fetchSubcategories(currentArray, parentCategory, data) {

        let parentFound = false;

        currentArray.find((category, index) => {  // * This should be replaced with forEach

            // If the parentCategory ID is found then return from find
            if (category.id === parentCategory) {
                parentFound = true;
                if (category.ignoreSubcategories) {
                    return true;
                }
                else {
                    currentArray[index].subcategories = data;
                    return true;
                }
            }
            // If the category contains subcategories then recurse
            if (typeof category.subcategories !== 'undefined' && category.subcategories.length > 0) {
                parentFound = this.fetchSubcategories(currentArray[index].subcategories, parentCategory, data);
                if (parentFound) {
                    return true;
                }
            }
        })

        // For early exit, return true if the parent ID has been found within recursion
        if (parentFound) {
            return true;
        }
        else {
            return false;
        }
    }

    // Method to fetch a set of subcategory terms, given a parent term ID 
    fetchCategories(parentCategory) {

        // Destruct required props and states
        const { excludeCategories } = this.props.args;
        const { categories } = this.state;

        this.relWP.relCategories()
            .param('parent', (parentCategory != false) ? parentCategory : 0)
            .param('exclude', (excludeCategories != false) ? excludeCategories.trim().split(',') : [])
            .perPage(20)
            .param('hide_empty', true)
            .then((data) => {
                if (data.length > 0) {
                    // Add the parent category to the front of the array
                    data.unshift({
                        id: (parentCategory != false) ? parseInt(parentCategory) : 0,
                        name: 'All',
                        ignoreSubcategories: true
                    });

                    // Hash static keys to every region
                    data.forEach(category => category.key = uuidv3(JSON.stringify(category), uuidv3.URL));

                    // If top level categories state has already been set
                    if (categories.length > 0) {
                        this.fetchSubcategories(categories, parseInt(parentCategory), data);
                        this.setState({
                            categories: this.state.categories
                        })
                    }
                    else {
                        this.setState({
                            categories: data
                        })
                    }
                }
            })
            .catch((err) => {
                console.error("WP API Get Error: " + err);
            });

    }

    // Method to fetch a set of tag terms, given a parent term ID 
    fetchTags(parentTag) {

        // Destruct required props and states
        const { excludeTags } = this.props.args;

        this.relWP.relTags()
            .param('parent', (parentTag != false) ? parentTag : 0)
            .param('exclude', (excludeTags != false) ? excludeTags.trim().split(',') : [])
            .perPage(50)
            .param('hide_empty', true)
            .then((data) => {
                if (data.length > 0) {
                    // Hash static keys to every tag
                    data.forEach(tag => tag.key = uuidv3(JSON.stringify(tag), uuidv3.URL));

                    this.setState({
                        tags: data
                    })
                }
            })
            .catch((err) => {
                console.error("WP API Get Error: " + err);
            });

    }

    // Method to fetch a set of category terms, given a parent term ID 
    fetchRegions(parentRegion) {

        // Destruct required props and states
        const { excludeRegions } = this.props.args;

        this.relWP.relRegions()
            .param('parent', (parentRegion != false) ? parentRegion : 0)
            .param('exclude', (excludeRegions != false) ? excludeRegions.trim().split(',') : [])
            .perPage(50)
            .param('hide_empty', true)
            .then((data) => {
                if (data.length > 0) {
                    // Hash static keys to every region
                    data.forEach(region => region.key = uuidv3(JSON.stringify(region), uuidv3.URL));

                    this.setState({
                        regions: data
                    })
                }
            })
            .catch((err) => {
                console.error("WP API Get Error: " + err);
            });

    }

    toggleModal(event, forceClose, listing) {
        if (listing != false) {
            this.setState({
                modalOpened: true,
                modalListing: listing
            });
        }
        else if (event.target === event.currentTarget || forceClose) {
            this.setState({
                modalOpened: false,
                modalListing: false
            });
        }
    }

    renderModal() {
        if (this.state.modalOpened && this.state.modalListing != false) {
            return (
                <RelModal
                    modalListing={this.state.modalListing}
                    toggleModal={this.toggleModal}
                    globals={this.props.globals}
                />
            )
        }
    }

    renderLoader() {
        if ((this.state.view == 'grid' || this.state.view == 'list' || this.state.view == 'single') && this.state.loading) {
            return (
                <div className="rel-loader-container">
                    <Loader
                        type="ThreeDots"
                        color="#85cba5"
                        height={100}
                        width={100}
                        timeout={2800}
                    />
                </div>
            )
        }
    }

    renderView() {
        switch (this.state.view) {
            case 'list':
                return (
                    <RelListingRows
                        listings={this.state.listings}
                        globals={this.props.globals}
                        toggleModal={this.toggleModal}
                    />
                )
            case 'map':
                return (
                    <RelListingMap
                        listings={this.state.listings}
                        globals={this.props.globals}
                        toggleModal={this.toggleModal}
                        page={this.state.page}
                        totalPages={this.state.totalPages}
                        loadMore={this.loadMore}
                    />
                )
            case 'single':
                return (
                    <RelListingSingle
                        singleListing={this.state.modalListing}
                        globals={this.props.globals}
                    />
                )
            default:
                return (
                    <RelListingGrid
                        listings={this.state.listings}
                        globals={this.props.globals}
                        toggleModal={this.toggleModal}
                    />
                )
        }
    }

    render() {
        return (
            <div className="rel-wrapper" >
                <RelHeader
                    currentView={this.state.view}
                    changeView={this.changeView}
                    categories={this.state.categories}
                    currentCategory={this.state.currentCategory}
                    changeCategory={this.changeCategory}
                    tags={this.state.tags}
                    currentTag={this.state.currentTag}
                    changeTag={this.changeTag}
                    regions={this.state.regions}
                    currentRegion={this.state.currentRegion}
                    changeRegion={this.changeRegion}
                    regionColourField={this.props.globals.regionColourField}
                />
                {this.renderView()}
                {this.renderLoader()}
                <RelFooter
                    currentView={this.state.view}
                    page={this.state.page}
                    totalPages={this.state.totalPages}
                    pagingType={this.props.args.pagingType} 
                    loadMore={this.loadMore}
                />
                {this.renderModal()}
            </div>
        )
    }
}

export default App

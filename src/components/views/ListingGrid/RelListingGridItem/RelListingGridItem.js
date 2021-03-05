const { Component } = wp.element;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import { getTermObject } from '../../../../helpers/wpapiHelpers';
import { renderTermIcon } from '../../../../helpers/relHelpers';
import { relEvent } from "../../../../helpers/relTracker";
import './RelListingGridItem.css';

export class RelListingGridItem extends Component {

    componentDidMount() {
        const {listing} = this.props;
        relEvent("LISTING", "Listing Viewed", entities.decode(listing.title.rendered));
    }

    renderLogo(listing, logoField) {
        if (typeof listing.rel_fields[logoField] !== 'undefined' && listing.rel_fields[logoField] != false) {
            return (
                <div className="rel-listing-logo">
                    <img src={listing.rel_fields[logoField]} />
                </div>
            )
        }
    }

    // Render all the tags associated with the listing
    renderTagIcons(listing, tagName, categoryIconField) {
        
        // Only continue if there is actually an icon field name set
        if (categoryIconField != false && listing[tagName].length > 0){
            // Create an object of all terms assigned to listing
            const terms = getTermObject(listing);

            return (
                <div className="rel-tag-icons">
                    {listing[tagName].map(tagId => {
                        return renderTermIcon(terms[tagId], categoryIconField);
                    })}
                </div>
            )
        }
    }

    render() {

        // Destruct required props and globals
        const {listing} = this.props;
        const {logoField, tagName, categoryIconField, placeholderImage} = this.props.globals;

        // Check for a featured image if it exists
        let thumbSrc = placeholderImage;
        let thumbAlt = '';
        if (listing._embedded['wp:featuredmedia']) {
            thumbSrc = listing._embedded['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
            thumbAlt = listing._embedded['wp:featuredmedia'][0].alt_text;
        }
        
        return (
            <div className="rel-listing-grid-item" onClick={(e) => this.props.toggleModal(e, false, listing)}>
                <div className="rel-listing-image">
                    <img src={thumbSrc} alt={thumbAlt} />
                    {this.renderLogo(listing, logoField)}
                </div>
                <div className="rel-listing-grid-title">
                    <h4>{entities.decode(listing.title.rendered)}</h4>
                </div>
                <div className="rel-listing-grid-details">
                    {this.renderTagIcons(listing, tagName, categoryIconField)}
                </div>
            </div>
        )
    }
}

export default RelListingGridItem

const { Component } = wp.element;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import { getTermObject } from '../../../../helpers/wpapiHelpers';
import { renderTermButton } from '../../../../helpers/relHelpers';
import './RelModal.css';

// Fontawesome Icons
import { faTimesCircle, faLink, faMapMarkerAlt, faPhoneAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export class RelModal extends Component {

    renderAddress(listing, addressField, mapField) {
        if (listing.rel_fields[addressField] != false && listing.rel_fields[mapField] != false) {
            
            const mapsLink = "http://maps.google.com/maps?q=" + listing.rel_fields[mapField].lat + "," + listing.rel_fields[mapField].lng;

            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-address">
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> <a href={mapsLink} target="_blank">{entities.decode(listing.rel_fields[addressField])}</a>
                    </div>
                </div>
            )
        }
        else if (listing.rel_fields[addressField] != false) {
            return (
                <div className="rel-modal-field">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> <div className="rel-modal-address">{entities.decode(listing.rel_fields[addressField])}</div>
                </div>
            )
        }
    }
    renderPhone(listing, phoneField) {
        if (listing.rel_fields[phoneField] != false) {
            return (
                <div className="rel-modal-field">
                    <FontAwesomeIcon icon={faPhoneAlt} /> <div className="rel-modal-phone">{entities.decode(listing.rel_fields[phoneField])}</div>
                </div>
            )
        }
    }
    renderWebsite(listing, websiteField) {
        if (listing.rel_fields[websiteField] != false) {
            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-website">
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> <a href={listing.rel_fields[websiteField]} target="_blank">{listing.rel_fields[websiteField]}</a>
                    </div>
                </div>
            )
        }
    }
    renderLink(internalLink) {
        if (internalLink != false) {
            return (
                <a href={internalLink}><FontAwesomeIcon className="rel-modal-link" icon={faLink} /></a>
            )
        }
    }
    renderLogo(listing, logoField) {
        if (typeof listing.rel_fields[logoField] !== 'undefined' && listing.rel_fields[logoField] != false) {
            return (
                <div className="rel-modal-logo">
                    <img src={listing.rel_fields[logoField]} />
                </div>
            )
        }
    }

    // Render all the categories associated with a listing
    renderCategories(listing, categoryName) {
        
        // Only continue if there is actually an icon field name set
        if (listing[categoryName].length > 0){
            // Create an object of all terms assigned to listing
            const terms = getTermObject(listing);

            return (
                <div className="rel-category-buttons">
                    {listing[categoryName].map(termId => {
                        return renderTermButton(terms[termId]);
                    })}
                </div>
            )
        }
    }

    render() {

        // Destruct required props and globals
        const listing = this.props.modalListing;
        const {phoneField, addressField, logoField, mapField, websiteField, placeholderImage, categoryName} = this.props.globals;

        // Check for a featured image if it exists
        let thumbSrc = placeholderImage;
        let thumbAlt = '';
        if (listing._embedded['wp:featuredmedia']) {
            thumbSrc = listing._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
            thumbAlt = listing._embedded['wp:featuredmedia'][0].alt_text;
        }

        return (
            <div className="rel-modal-background" onClick={ (e) => this.props.toggleModal(e, false, false) }>
                <div className="rel-modal-container">
                    <div className="rel-modal-image">
                        <img src={thumbSrc} alt={thumbAlt} />
                        {this.renderLogo(listing, logoField)}
                    </div>
                    <div className="rel-modal-details">
                        <div className="rel-modal-title">
                            <h4>{entities.decode(listing.title.rendered)} {this.renderLink(listing.link)}</h4>
                            {this.renderCategories(listing, categoryName)}
                        </div>
                        <div className="rel-modal-field-container">
                            {this.renderAddress(listing, addressField, mapField)}
                            {this.renderPhone(listing, phoneField)}
                            {this.renderWebsite(listing, websiteField)}
                        </div>
                        <div className="rel-modal-text">
                            <div className="rel-modal-content" 
                                dangerouslySetInnerHTML={{ __html: entities.decode(listing.content.rendered) }} 
                            />
                        </div>
                        
                        <div className="rel-modal-close-container" onClick={ (e) => this.props.toggleModal(e, true, false) }>
                            <FontAwesomeIcon className="rel-modal-close" icon={faTimesCircle} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RelModal

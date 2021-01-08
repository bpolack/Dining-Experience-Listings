const { Component } = wp.element;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import './RelModal.css';

// Close Icon
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export class RelModal extends Component {

    renderRegion(listing, regionColourField) {

        // Get the Region name & colour if it exists
        let regionName = false;
        let dotStyle = {
            backgroundColor: '#c7c7c7'
        }
        if ((typeof listing._embedded['wp:term'][2] !== 'undefined') && (listing._embedded['wp:term'][2].length > 0)) {
            if (typeof listing._embedded['wp:term'][2][0].rel_fields[regionColourField] !== 'undefined') {
                dotStyle.backgroundColor = listing._embedded['wp:term'][2][0].rel_fields[regionColourField];
            }
            regionName = entities.decode(listing._embedded['wp:term'][2][0].name);
        }

        if (regionName) {
            return (
                <div className="rel-modal-region-container">
                    <div className="rel-modal-region-dot" style={dotStyle} ></div>
                    <div className="rel-modal-region">{regionName}</div>
                </div>
            )
        }
    }

    renderAddress(listing, addressField, mapField) {

        if (listing.rel_fields[addressField] != false && listing.rel_fields[mapField] != false) {
            
            const mapsLink = "http://maps.google.com/maps?q=" + listing.rel_fields[mapField].lat + "," + listing.rel_fields[mapField].lng;

            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-region-dot empty"></div>
                    <div className="rel-modal-address">
                        <a href={mapsLink} target="_blank">{entities.decode(listing.rel_fields[addressField])}</a>
                    </div>
                </div>
            )
        }
        else if (listing.rel_fields[addressField] != false) {
            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-region-dot empty"></div>
                    <div className="rel-modal-address">{entities.decode(listing.rel_fields[addressField])}</div>
                </div>
            )
        }
    }
    renderPhone(listing, phoneField) {

        if (listing.rel_fields[phoneField] != false) {
            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-region-dot empty"></div>
                    <div className="rel-modal-phone">{entities.decode(listing.rel_fields[phoneField])}</div>
                </div>
            )
        }
    }
    renderWebsite(listing, websiteField) {

        if (listing.rel_fields[websiteField] != false) {
            return (
                <div className="rel-modal-field">
                    <div className="rel-modal-region-dot empty"></div>
                    <div className="rel-modal-website">
                        <a href={listing.rel_fields[websiteField]} target="_blank">{listing.rel_fields[websiteField]}</a>
                    </div>
                </div>
            )
        }
    }

    render() {

        // Destruct required props and globals
        const listing = this.props.modalListing;
        const {phoneField, addressField, mapField, websiteField, regionColourField, placeholderImage} = this.props.globals;

        // Check for a featured image if it exists
        let thumbSrc = placeholderImage;
        let thumbAlt = '';
        if (listing._embedded['wp:featuredmedia']) {
            thumbSrc = listing._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
            thumbAlt = listing._embedded['wp:featuredmedia'][0].alt_text;
        }

        return (
            <div className="rel-modal-background" onClick={ (e) => this.props.toggleModal(e, false, false) }>
                <div className="rel-modal-container">
                    <div className="rel-modal-image">
                        <img src={thumbSrc} alt={thumbAlt} />
                    </div>
                    <div className="rel-modal-details">
                        <div className="rel-modal-text">
                            <h4>{entities.decode(listing.title.rendered)}</h4>
                            <div className="rel-modal-content" 
                                dangerouslySetInnerHTML={{ __html: entities.decode(listing.content.rendered) }} >
                            </div>
                        </div>
                        {this.renderRegion(listing, regionColourField)}
                        <div className="rel-modal-field-container">
                            {this.renderAddress(listing, addressField, mapField)}
                            {this.renderPhone(listing, phoneField)}
                            {this.renderWebsite(listing, websiteField)}
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

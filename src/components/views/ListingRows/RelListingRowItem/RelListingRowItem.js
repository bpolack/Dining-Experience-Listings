const { Component } = wp.element;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import { getTermObject } from '../../../../helpers/wpapiHelpers';
import { renderTermIcon } from '../../../../helpers/relHelpers';
import './RelListingRowItem.css';

export class RelListingRowItem extends Component {

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
        const {tagName, categoryIconField} = this.props.globals;
        
        return (
            <div className="rel-listing-row-item" onClick={(e) => this.props.toggleModal(e, false, listing)}>
                <div className="rel-listing-row-details">
                    <div className="rel-listing-row-text">
                        <h4>{entities.decode(listing.title.rendered)}</h4>
                        {this.renderTagIcons(listing, tagName, categoryIconField)}
                    </div>
                    <div className="rel-listing-row-arrow-container">
                        <div className="rel-listing-row-arrow"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RelListingRowItem

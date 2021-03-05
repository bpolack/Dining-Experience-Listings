const { Component } = wp.element;
import { relEvent } from "../../../helpers/relTracker";
import './RelListingRows.css';

// Import Components
import RelListingRowItem from './RelListingRowItem/RelListingRowItem';

export class RelListingRows extends Component {

    componentDidMount() {
        relEvent("DISPLAY", "Experiences view changed", "Rows");
    }

    render() {
        return (
            <div className="rel-listings-rows">
                {this.props.listings.map((listing, index) => {
                    return (
                        <RelListingRowItem 
                            key={listing.key} 
                            listing={listing} 
                            globals={this.props.globals} 
                            toggleModal={this.props.toggleModal}
                        />
                    )
                })}
            </div>
        )
    }
}

export default RelListingRows

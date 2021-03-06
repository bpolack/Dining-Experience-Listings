const { Component } = wp.element;
import {SlideDown} from 'react-slidedown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RelRegions.css';
import 'react-slidedown/lib/slidedown.css';

// Fontawesome Icons
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Import Components
import RelRegionButton from './RelRegionButton/RelRegionButton';

export class RelRegions extends Component {

    constructor(props) {
        super(props);

        // Set the initial state
        this.state = {
            dropdownClosed: true
        };

        // Bind callback methods to class
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }


    toggleDropdown() {
        this.setState({
            dropdownClosed: !this.state.dropdownClosed
        })
    }

    renderDropdownTrigger() {
        let classList = "rel-dropdown-trigger ";
        if (!this.state.dropdownClosed) {
            classList += "active";
        }

        return (
            <div className={classList} onClick={this.toggleDropdown}>
                <span>Neighbourhood</span>
                <FontAwesomeIcon className="rel-dropdown-trigger-icon" icon={faCaretDown} />
            </div>
        )
    }

    render() {
        return (
            <div className="rel-header-region-wrapper">
                {this.renderDropdownTrigger()}
                <SlideDown className="rel-category-dropdown" closed={this.state.dropdownClosed}>
                    <div className="rel-header-item">
                        <div className="rel-header-regions">
                            {this.props.regions.map((region, index) => {
                                return (
                                    <RelRegionButton key={region.key} region={region} currentRegion={this.props.currentRegion} changeRegion={this.props.changeRegion} regionColourField={this.props.regionColourField} />
                                )
                            })}
                        </div>
                    </div>
                </SlideDown>
            </div>
        )
    }
}

export default RelRegions

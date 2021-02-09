const { Component } = wp.element;
import {SlideDown} from 'react-slidedown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RelTags.css';
import 'react-slidedown/lib/slidedown.css';

// Fontawesome Icons
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Import Components
import RelTagButton from './RelTagButton/RelTagButton';

export class RelTags extends Component {

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
                <span>Price Point</span>
                <FontAwesomeIcon className="rel-dropdown-trigger-icon" icon={faCaretDown} />
            </div>
        )
    }

    render() {
        return (
            <div className="rel-header-tag-wrapper">
                {this.renderDropdownTrigger()}
                <SlideDown className="rel-category-dropdown" closed={this.state.dropdownClosed}>
                    <div className="rel-header-item">
                        <div className="rel-header-tags">
                            {this.props.tags.map((tag, index) => {
                                return (
                                    <RelTagButton key={tag.key} tag={tag} currentTag={this.props.currentTag} changeTag={this.props.changeTag} />
                                )
                            })}
                        </div>
                    </div>
                </SlideDown>
            </div>
        )
    }
}

export default RelTags

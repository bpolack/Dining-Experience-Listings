const { Component } = wp.element;
import { SlideDown } from 'react-slidedown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './RelCategories.css';
import 'react-slidedown/lib/slidedown.css';


// Fontawesome Icons
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

// Import Components
import RelCategoryButton from './RelCategoryButton/RelCategoryButton';

export class RelCategories extends Component {

    constructor(props) {
        super(props);

        // Set the initial state
        this.state = {
            activeBranch: [parseInt(this.props.currentCategory)],
            activeLink: '',
            dropdownClosed: true
        };

        // Bind callback methods to class
        this.changeBranch = this.changeBranch.bind(this);
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
                <span>Cuisine</span>
                <FontAwesomeIcon className="rel-dropdown-trigger-icon" icon={faCaretDown} />
            </div>
        )
    }

    // Method to update the active category branch 
    // *** used for displaying category levels and updating the category link icon
    changeBranch(childCategory, parentCategory, childCategoryLink) {

        let newBranch;

        if (typeof parentCategory !== 'undefined') {
            // Grab the index of the parent category from the array 
            const parentIndex = this.state.activeBranch.findIndex(category => category === parentCategory);

            if (parentIndex !== -1) {
                newBranch = this.state.activeBranch.slice(0, parentIndex).concat([parentCategory, childCategory]);
            }
            else {
                newBranch = [parentCategory, childCategory];
            }
        }
        else {
            // Special case for "All" category links
            const childIndex = this.state.activeBranch.findIndex(category => category === childCategory);

            if (childIndex !== -1) {
                newBranch = this.state.activeBranch.slice(0, childIndex + 1);
            }
            else {
                newBranch = [childCategory];
            }

        }

        this.setState({
            activeBranch: newBranch,
            activeLink: childCategoryLink
        })
    }

    renderCategories(categories) {
        return (
            categories.map((category, index) => {
                if (typeof category.subcategories !== 'undefined' && category.subcategories.length > 0 && this.state.activeBranch.includes(category.id)) {
                    // Category contains subcategories
                    return (
                        <div className="rel-header-category-item">
                            <RelCategoryButton
                                key={category.key}
                                category={category}
                                currentCategory={this.props.currentCategory}
                                changeCategory={this.props.changeCategory}
                                activeBranch={this.state.activeBranch}
                                changeBranch={this.changeBranch}
                            />
                            <div className="rel-header-category-children">
                                {this.renderCategories(category.subcategories)}
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <RelCategoryButton
                            key={category.key}
                            category={category}
                            currentCategory={this.props.currentCategory}
                            changeCategory={this.props.changeCategory}
                            activeBranch={this.state.activeBranch}
                            changeBranch={this.changeBranch}
                        />
                    )
                }
            })
        )
    }

    // Renders a quick link to category taxonomy page when a category is selected
    renderLink() {
        if (this.state.activeLink != false && typeof this.state.activeLink !== 'undefined') {
            return (
                <a href={this.state.activeLink}><FontAwesomeIcon className="rel-header-category-link" icon={faLink} /></a>
            )
        }
    }

    render() {
        return (
            <div className="rel-header-category-wrapper">
                {this.renderDropdownTrigger()}
                <SlideDown className="rel-category-dropdown" closed={this.state.dropdownClosed}>
                    <div className="rel-header-item">
                        <div className="rel-header-categories">
                            {this.renderCategories(this.props.categories)}
                        </div>
                    </div>
                </SlideDown>
                {this.renderLink()}
            </div>
        )
    }
}

export default RelCategories

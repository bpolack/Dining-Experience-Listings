const { Component } = wp.element;
import './RelHeader.css';

// Import Components
import RelViews from './RelViews/RelViews';
import RelCategories from './RelCategories/RelCategories';
import RelTags from './RelTags/RelTags';
import RelRegions from './RelRegions/RelRegions';

export class RelHeader extends Component {

    renderViewMenu() {
        switch (this.props.currentView) {
            case 'single':
                return;
            default:
                return (
                    <div className="rel-header-options">
                        <RelViews
                            currentView={this.props.currentView}
                            changeView={this.props.changeView}
                        />
                    </div>
                )
        }
    }

    renderCategories() {
        switch (this.props.currentView) {
            case 'map':
                return;
            case 'single':
                return;
            default:
                return (
                    <div className="rel-header-filter-columns">
                        <RelCategories
                            categories={this.props.categories}
                            currentCategory={this.props.currentCategory}
                            changeCategory={this.props.changeCategory}
                        />
                        <RelTags
                            tags={this.props.tags}
                            currentTag={this.props.currentTag}
                            changeTag={this.props.changeTag}
                        />
                        <RelRegions
                            regions={this.props.regions}
                            currentRegion={this.props.currentRegion}
                            changeRegion={this.props.changeRegion}
                            regionColourField={this.props.regionColourField}
                        />
                    </div>
                )
        }
    }

    render() {
        return (
            <div className="rel-header">
                {this.renderViewMenu()}
                {this.renderCategories()}
            </div>
        )
    }
}

export default RelHeader

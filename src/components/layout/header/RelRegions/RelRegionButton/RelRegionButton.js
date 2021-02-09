const { Component } = wp.element;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import './RelRegionButton.css';

export class RelRegionButton extends Component {

    renderDot() {
        if (typeof this.props.regionColourField !== 'undefined' && this.props.regionColourField != false) {
            // Get the Region dot colour if it exists
            let dotStyle = {
                backgroundColor: '#c7c7c7'
            }
            if (typeof this.props.region.rel_fields[this.props.regionColourField] !== 'undefined' && this.props.region.rel_fields[this.props.regionColourField] != false) {
                dotStyle.backgroundColor = this.props.region.rel_fields[this.props.regionColourField];
            }
            return (
                <span className="region-dot" style={dotStyle}></span>
            )
        }
    }

    render() {

        let buttonClass = "rel-region-button";
        if (this.props.currentRegion == this.props.region.id) {
            buttonClass += " active";
        }
        
        return (
            <div className={buttonClass} onClick={() => this.props.changeRegion(this.props.region.id.toString())}>
                {this.renderDot()} 
                {entities.decode(this.props.region.name)}
            </div>
        )
    }
}

export default RelRegionButton

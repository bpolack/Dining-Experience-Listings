const { Component } = wp.element;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import './RelTagButton.css';

export class RelTagButton extends Component {

    render() {

        let buttonClass = "rel-tag-button";
        if (this.props.currentTag == this.props.tag.id) {
            buttonClass += " active";
        }
        
        return (
            <div className={buttonClass} onClick={() => this.props.changeTag(this.props.tag.id.toString())}>
                {entities.decode(this.props.tag.name)}
            </div>
        )
    }
}

export default RelTagButton

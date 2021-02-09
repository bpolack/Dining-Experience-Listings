const { Component } = wp.element;
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import { Marker } from '@react-google-maps/api';
import './RelMapMarker.css';

export class RelMapMarker extends Component {

    constructor(props) {
        super(props);

        // Set the initial state
        this.state = {
            isHovered: false
        };

        // Bind callback methods to class
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver(event) {
        this.setState({
            isHovered: true
        })
    }
    handleMouseOut(event) {
        this.setState({
            isHovered: false
        })
    }

    render() {

        let markerLabel = {
            text: " "
        }
        let markerSVG = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#85cba5" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>';
        if (this.state.isHovered) {
            markerLabel = {
                text: entities.decode(this.props.listing.title.rendered),
                className: "rel-map-marker-label",
                color: "#ffffff",
                fontFamily: "inherit",
                fontSize: "16px",
                fontWeight: "bold"
            }
            markerSVG = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="#3d6955" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>';
        }


        return (
            <Marker
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                icon={{
                    url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markerSVG),
                    size: new window.google.maps.Size(32, 32),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 32),
                    labelOrigin: new window.google.maps.Point(16, -15)
                }}
                position={this.props.listingPosition}
                clusterer={this.props.clusterer}
                label={markerLabel}
                onClick={(e) => this.props.toggleModal(e, false, this.props.listing)}
            />
        )
    }
}

export default RelMapMarker

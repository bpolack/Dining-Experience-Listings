const { useState, useCallback } = wp.element;
import { relEvent } from "../../../helpers/relTracker";
import { GoogleMap, useJsApiLoader, MarkerClusterer } from '@react-google-maps/api';
import './RelListingMap.css';

// Import Components
import RelMapMarker from './RelMapMarker/RelMapMarker';

const containerStyle = {
    width: '100%',
    height: '600px',
    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.2)"
};
const center = {
    lat: 49.258049, 
    lng: -122.978895
};
const zoom = 13;

const mapStyle = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
];

const iconSVG = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" class="svg-inline--fa fa-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="rgba(61, 105, 85, 0.75)" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path></svg>';
const clusterStyles = [
    { textColor: 'white', height: 40, width: 40, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) },
    { textColor: 'white', height: 50, width: 50, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) },
    { textColor: 'white', height: 60, width: 60, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) },
    { textColor: 'white', height: 68, width: 68, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) },
    { textColor: 'white', height: 76, width: 76, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) },
    { textColor: 'white', height: 85, width: 85, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(iconSVG) }
];

function RelListingMap(props) {

    // Destruct required props and globals
    const { listings } = props;
    const { mapField } = props.globals;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: props.globals.apiKey,
        preventGoogleFontsLoading: true
    })

    const [map, setMap] = useState(null);

    function triggerMapLoadMore(toggle) {
        if (toggle) {
            props.loadMore(moreToLoad => {
                if (moreToLoad) {
                    setTimeout(
                        () => triggerMapLoadMore(true),
                        800
                    );
                }
            });
        }
    }

    const onLoad = useCallback(function callback(map) {

        // Trigger an event to show view has changed
        relEvent("DISPLAY", "Experiences view changed", "Map");

        triggerMapLoadMore(true);
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            options={{ styles: mapStyle, mapTypeControl: false }}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <MarkerClusterer styles={clusterStyles}>
                {(clusterer) =>
                    listings.map((listing, index) => {
                        if (typeof listing.rel_fields[mapField] !== 'undefined' && listing.rel_fields[mapField] != false && typeof listing.rel_fields[mapField].lat === 'number' && typeof listing.rel_fields[mapField].lng === 'number') {
                            const listingPosition = {
                                lat: listing.rel_fields[mapField].lat,
                                lng: listing.rel_fields[mapField].lng
                            }
                            return (
                                <RelMapMarker
                                    key={listing.key}
                                    listing={listing}
                                    listingPosition={listingPosition}
                                    clusterer={clusterer}
                                    toggleModal={props.toggleModal}
                                />
                            )
                        }
                    })
                }
            </MarkerClusterer>
        </GoogleMap>
    ) : <></>
}

export default RelListingMap
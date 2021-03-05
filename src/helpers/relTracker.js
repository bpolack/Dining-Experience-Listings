import ReactGA from "react-ga"

/**
 * initGA - Initialize Google Analytics Tracking
 * @param {string} trackingID 
 */
export const initGA = (trackingID) => {
    ReactGA.initialize(trackingID, {
        debug: false
    });
}

/**
 * relEvent - Trigger a custom tracking event
 * @param {string} category 
 * @param {string} action 
 * @param {string} label 
 */
export const relEvent = (category, action, label) => {
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
};
// Function returns an object of listing terms keyed by term ID
export function getTermObject(post) {
    if (post._embedded['wp:term'] && post._embedded['wp:term'].length > 0) {
        
        let terms = {};
        
        post._embedded['wp:term'].forEach(termArray => {
            if (termArray.length > 0) {
                termArray.forEach(term => {
                    terms[term.id] = term;
                });
            }
        });
        
        // return the terms object, if it is not empty
        if (Object.keys(terms).length !== 0) {
            return terms;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
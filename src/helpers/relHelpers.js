// Function to render a listing term as icon (if it has an icon)
export function renderTermIcon(term, categoryIconField) {
    if (typeof term.rel_fields[categoryIconField] !== 'undefined' && term.rel_fields[categoryIconField] != false) {
        return(
            <div className="rel-tag-icon">
                <div 
                    className="rel-svg-icon" 
                    title={term.name} 
                    dangerouslySetInnerHTML={{ __html: term.rel_fields[categoryIconField] }} 
                />
            </div>
        )
    }
}
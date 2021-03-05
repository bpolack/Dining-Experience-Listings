const { Component } = wp.element;
import debounce from "lodash.debounce";
import './RelFooter.css';

export class RelFooter extends Component {

    constructor(props) {
        super(props);

        // Bind callback methods to class
        this.isInViewport = this.isInViewport.bind(this);
        this.infiniteLoadMore = this.infiniteLoadMore.bind(this);
        this.infiniteLoadMoreDebounced = debounce(this.infiniteLoadMore, 50);
    }

    componentWillUnmount() {
        // Destroy the scroll event listener
        if (this.props.pagingType === 'infinite') {
            document.removeEventListener("scroll", this.infiniteLoadMoreDebounced);
        }
    }

    // Function to check whether the current element is contained in the viewport
    isInViewport(offset = 0) {
        if (!this.relFooterElement) 
            return false;
        const top = this.relFooterElement.getBoundingClientRect().top;
        return (top - offset) <= window.innerHeight;
    }

    // Function to trigger a loadmore if the current viewport contains the footer
    infiniteLoadMore() {
        if (this.isInViewport()) {
            this.props.loadMore(moreToLoad => {
                if (!moreToLoad) {
                    // Destroy the scroll event listener
                    document.removeEventListener("scroll", this.infiniteLoadMoreDebounced);
                }
            });
        }
    }

    renderLoadMore() {
        if (this.props.currentView === 'grid' || this.props.currentView === 'list') {
            
            if (this.props.page < this.props.totalPages) {
                if (this.props.pagingType !== 'infinite') {
                    return (
                        <button className="rel-load-more-button" onClick={() => this.props.loadMore()}>
                            Load More
                        </button>
                    )
                }
                else {
                    document.addEventListener("scroll", this.infiniteLoadMoreDebounced);
                }
            }
            else {
                return (
                    <div className="rel-end-of-posts" >
                        ~ no more restaurants to load ~
                    </div>
                )
            }
        }
    }

    render() {

        return (
            <div className="rel-footer" ref={(el) => this.relFooterElement = el}>
                {this.renderLoadMore()}
            </div>
        )
    }
}

export default RelFooter

<?php
// This file enqueues plugin shortcode

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );


function create_rel_app( $atts ) {

    wp_enqueue_script('rel-plugin-frontend');
    wp_enqueue_style('rel-plugin-style');

    $default_atts = array( 
        'view' => 'grid',
        'perpage' => '8',
        'initial_category' => '',
        'exclude_categories' => '',
        'initial_tag' => '',
        'exclude_tags' => '',
        'initial_region' => '',
        'exclude_regions' => '',
        'single_listing' => '',
    );
    $args = shortcode_atts( $default_atts, $atts );
    $sc_id = uniqid('rel');

    $globals = get_option( 'rel_plugin_options' );

    ob_start();
    ?>

    <script>
        window.relGlobals = window.relGlobals || {};
        window.relGlobals = {
            "apiLocation": "<?php echo $globals["api_loc"]; ?>",
            "postType": "<?php echo $globals["post_type"]; ?>",
            "phoneField": "<?php echo $globals["phone"]; ?>",
            "websiteField": "<?php echo $globals["website"]; ?>",
            "addressField": "<?php echo $globals["address"]; ?>",
            "logoField": "<?php echo $globals["logo"]; ?>",
            "mapField": "<?php echo $globals["map_pin"]; ?>",
            "categoryName": "<?php echo $globals["category"]; ?>",
            "categoryIconField": "<?php echo $globals["category_icon"]; ?>",
            "tagName": "<?php echo $globals["tag"]; ?>",
            "regionName": "<?php echo $globals["region"]; ?>",
            "regionColourField": "<?php echo $globals["region_colour"]; ?>",
            "placeholderImage": "<?php echo $globals["placeholder"]; ?>",
            "apiKey": "<?php echo $globals["apikey"]; ?>"
        };
        window.relSettings = window.relSettings || {};
        window.relSettings["<?php echo $sc_id; ?>"] = {
            "view": "<?php echo $args["view"]; ?>",
            "perpage": "<?php echo $args["perpage"]; ?>",
            "initialCategory": "<?php echo $args["initial_category"]; ?>",
            "excludeCategories": "<?php echo $args["exclude_categories"]; ?>",
            "initialTag": "<?php echo $args["initial_tag"]; ?>",
            "excludeTags": "<?php echo $args["exclude_tags"]; ?>",
            "initialRegion": "<?php echo $args["initial_region"]; ?>",
            "excludeRegions": "<?php echo $args["exclude_regions"]; ?>",
            "singleListing": "<?php echo $args["single_listing"]; ?>"
        };
    </script>
    <div class="rel-root" data-id="<?php echo $sc_id; ?>"></div>

    <?php
    return ob_get_clean();
}
add_shortcode( 'dining_experiences', 'create_rel_app');
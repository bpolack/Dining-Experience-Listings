<?php
/**
 * @wordpress-plugin
 * Plugin Name:       Dining Experience Listings
 * Plugin URI:        https://github.com/bpolack/Dining-Experience-Listings
 * Description:       Load React based dining listings via this Wordpress Plugin. Uses the Wordpress REST API as a backend.
 * Version:           1.0.1
 * Author:            Braighton Polack
 */

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );

// Define Backend Constants
define( 'REL_APP_URL', plugin_dir_url( __FILE__ ) );
define( 'REL_APP_PATH', plugin_dir_path( __FILE__ ) . '/app' );
//define( 'REL_ASSET_MANIFEST', REL_APP_PATH . '/build/asset-manifest.json' );
define( 'REL_INCLUDES', plugin_dir_path( __FILE__ ) . '/includes' );

require_once( REL_INCLUDES . '/settings.php' );
require_once( REL_INCLUDES . '/enqueue.php' );
require_once( REL_INCLUDES . '/shortcodes.php' );

$rel_options = get_option( 'rel_plugin_options' );

// Expose all ACF fields to the REST API
function rel_acf_to_rest_api($response, $post, $request) {
    if (!function_exists('get_fields')) return $response;

    if (isset($post)) {
        $acf = get_fields($post->id);
        $response->data['rel_fields'] = $acf;
    }
    return $response;
}
add_filter('rest_prepare_post', 'rel_acf_to_rest_api', 10, 3);
add_filter('rest_prepare_' . $rel_options['post_type'], 'rel_acf_to_rest_api', 10, 3);

// Expose all ACF fields to the REST API
function rel_acf_to_rest_api_taxonomy($response, $item, $request) {
    if (!function_exists('get_fields')) return $response;

    if (isset($item)) {
        $acf = get_fields('term_' . $item->term_id);
        $response->data['rel_fields'] = $acf;
    }
    return $response;
}
add_filter('rest_prepare_' . $rel_options['category'], 'rel_acf_to_rest_api_taxonomy', 10, 3);
add_filter('rest_prepare_' . $rel_options['tag'], 'rel_acf_to_rest_api_taxonomy', 10, 3);
add_filter('rest_prepare_' . $rel_options['region'], 'rel_acf_to_rest_api_taxonomy', 10, 3);
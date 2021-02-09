<?php
// This file enqueues plugin settings config

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );

function rel_add_settings_page() {
    add_options_page( 'Dining Experience Listings', 'Experience Listings', 'manage_options', 'react-experiences-listings', 'rel_render_plugin_settings_page' );
}
add_action( 'admin_menu', 'rel_add_settings_page' );

function rel_render_plugin_settings_page() {
    ?>
    <h2>Listing Configurations</h2>
    <form action="options.php" method="post">
        <?php 
        settings_fields( 'rel_plugin_options' );
        do_settings_sections( 'react-experiences-listings' ); ?>
        <input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e( 'Save' ); ?>" />
    </form>
    <?php
}

function rel_register_settings() {
    register_setting( 'rel_plugin_options', 'rel_plugin_options', 'rel_plugin_options_validate' );
    add_settings_section( 'post_type_settings', 'Post Type Settings', 'rel_plugin_section_text', 'react-experiences-listings' );
    
    add_settings_field( 'rel_plugin_setting_api_loc', 'API URL (with trailing slash)', 'rel_plugin_setting_api_loc', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_post_type', 'Listing Post Type Slug', 'rel_plugin_setting_post_type', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_phone', 'ACF Phone Field', 'rel_plugin_setting_phone', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_website', 'ACF Website Field', 'rel_plugin_setting_website', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_address', 'ACF Address Field', 'rel_plugin_setting_address', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_logo', 'ACF Logo Field', 'rel_plugin_setting_logo', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_map_pin', 'ACF Map Field', 'rel_plugin_setting_map_pin', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_category', 'Category Custom Taxonomy (optional)', 'rel_plugin_setting_category', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_category_icon', 'Category Icon Field', 'rel_plugin_setting_category_icon', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_tag', 'Tag Custom Taxonomy (optional)', 'rel_plugin_setting_tag', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_region', 'Region Custom Taxonomy (optional)', 'rel_plugin_setting_region', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_region_colour', 'Region Colour Field', 'rel_plugin_setting_region_colour', 'react-experiences-listings', 'post_type_settings' );

    add_settings_field( 'rel_plugin_setting_placeholder', 'Placeholder Image URL', 'rel_plugin_setting_placeholder', 'react-experiences-listings', 'post_type_settings' );
    add_settings_field( 'rel_plugin_setting_apikey', 'Google Maps API Key', 'rel_plugin_setting_apikey', 'react-experiences-listings', 'post_type_settings' );
}
add_action( 'admin_init', 'rel_register_settings' );

function rel_plugin_section_text() {
    echo '<p>Listing post type and post field settings.</p>';
}

function rel_plugin_setting_api_loc() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_api_loc" name="rel_plugin_options[api_loc]" type="text" value="'.esc_attr( $options['api_loc'] ).'" />';
}
function rel_plugin_setting_post_type() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_post_type" name="rel_plugin_options[post_type]" type="text" value="'.esc_attr( $options['post_type'] ).'" />';
}
function rel_plugin_setting_phone() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_phone" name="rel_plugin_options[phone]" type="text" value="'.esc_attr( $options['phone'] ).'" />';
}
function rel_plugin_setting_website() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_website" name="rel_plugin_options[website]" type="text" value="'.esc_attr( $options['website'] ).'" />';
}
function rel_plugin_setting_address() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_address" name="rel_plugin_options[address]" type="text" value="'.esc_attr( $options['address'] ).'" />';
}
function rel_plugin_setting_logo() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_logo" name="rel_plugin_options[logo]" type="text" value="'.esc_attr( $options['logo'] ).'" />';
}
function rel_plugin_setting_map_pin() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_map_pin" name="rel_plugin_options[map_pin]" type="text" value="'.esc_attr( $options['map_pin'] ).'" />';
}
function rel_plugin_setting_category() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_category" name="rel_plugin_options[category]" type="text" value="'.esc_attr( $options['category'] ).'" />';
}
function rel_plugin_setting_category_icon() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_category_icon" name="rel_plugin_options[category_icon]" type="text" value="'.esc_attr( $options['category_icon'] ).'" />';
}
function rel_plugin_setting_tag() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_tag" name="rel_plugin_options[tag]" type="text" value="'.esc_attr( $options['tag'] ).'" />';
}
function rel_plugin_setting_region() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_region" name="rel_plugin_options[region]" type="text" value="'.esc_attr( $options['region'] ).'" />';
}
function rel_plugin_setting_region_colour() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_region_colour" name="rel_plugin_options[region_colour]" type="text" value="'.esc_attr( $options['region_colour'] ).'" />';
}
function rel_plugin_setting_placeholder() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_placeholder" name="rel_plugin_options[placeholder]" type="text" value="'.esc_attr( $options['placeholder'] ).'" />';
}
function rel_plugin_setting_apikey() {
    $options = get_option( 'rel_plugin_options' );
    echo '<input id="rel_plugin_setting_apikey" name="rel_plugin_options[apikey]" type="text" value="'.esc_attr( $options['apikey'] ).'" />';
}
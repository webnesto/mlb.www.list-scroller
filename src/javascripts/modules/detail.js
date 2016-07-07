/**
 * Game Details Module
 * - Handles rendering
 * - Up/Down key controlled scroll
 * - Visual Effects
 */

var $ = require( 'jquery' );
require( 'jquery-ui/core' );
require( 'jquery-ui/effect' );
require( 'jquery-ui/effect-drop.js' );
var detailTpl = require( 'nunjucks!../../html/views/detail.html' );

import Abstract from './abstract';

/** constants **/
const SCROLL_DISTANCE = 200;

/*************************
 * private class utility methods
 */

/**
 * Iterates raw game data for all strings to display demo details
 * @param  {JSON} raw service provided data
 * @return {Object}     Details for rendering.
 */
function parseGameDetails( raw ) {
  var ret = {};
  for ( var prop in raw ) {
    if ( raw.hasOwnProperty( prop ) && typeof raw[ prop ] == "string" ) {
      ret[ prettyString( prop ) ] = raw[ prop ];
    }
  }
  return ret;
}

/**
 * Clean up data string (replace underscores with spaces)
 * @param  {String} str
 * @return {String}     str with all "_" as " "
 */
function prettyString( str ) {
  return str.replace( /_/g, " " );
}

export default class Detail extends Abstract {
  /**
   * Instantiator
   *  binds async functions to instance method
   *  sets initial property state
   * @return {Object}    instance of Detail
   */
  constructor( initData, caller ) {
    super();

    this._ui_postRender = this.bind( this.ui_postRender );

    this._caller = caller;
    this.game = initData;
    this.lastScroll = 0;

  }

  /*************************
   * Event Handlers
   */

  handleDown( e ) {
    this.ui_scroll( "up" );
  }

  handleUp( e ) {
    this.ui_scroll( "down" );
  }

  handleLeft( e ) {
    this.ui_hide();
    this._caller.active = true;
  }

  /*************************
   * Property Getter/Setters
   */

  set game( gameData ) {
    this._game = parseGameDetails( gameData.raw );
    this.ui_render();
  }

  get game(){
    return this._game;
  }

  /*************************
   * UI Methods
   */

  ui_render() {
    if ( !this.$el ) {
      this.$el = $( '<div class="detail" style="display: none;" />' ); //create static container
    }
    detailTpl.render( { details: this._game }, this._ui_postRender );
  }

  ui_postRender() {
    super.ui_postRender.apply( this, arguments );
    this.ui_show();
  }

  ui_show() {
    var that = this;
    this.$el.fadeIn().find( ".content" ).show( "drop", "easeInCirc", 750 );
  }

  ui_hide() {
    var that = this;
    this.$el.find( ".content" ).hide( "drop", "easeOutCirc", 250, function () {
      that.$el.hide();
    } );
  }

  ui_scroll( dir ) {
    var $content = this.$el.find( ".content" );
    var top = this.lastScroll ? this.lastScroll : $content.scrollTop();
    var target = top + ( dir == "up" ? SCROLL_DISTANCE : SCROLL_DISTANCE * -1 );
    this.lastScroll = target;
    $content.finish().animate( { scrollTop: target } );
  }
}

/**
 * Game Thumbnail Sub Module
 * Not and Abstract extension - does not ever take active
 * control.  Exists entirely for ui Render (in a larger app,
 * would probably be kept distinct from modules given that
 * all Abstract extensions fill both View and Controller
 * roles)
 */

var $ = require( 'jquery' );
var gameTpl = require( 'nunjucks!../../html/views/game.html' );

/** constants **/
const CSS_SELECTED = "js-selected";
const PATH_PLACEHOLDER = "/images/placeholder.jpg";

export default class Game {
  /**
   * Instantiator
   *  binds async functions to instance method
   *  sets initial property state
   * @return {Object}    instance of Game
   */
  constructor( initData, isSelected ) {
    this._data = initData;
    this.selected = isSelected;
    this.ui_render();
  }

  /*************************
   * Property Getter/Setters
   */

  /**
   * details data Model
   * Note: data stored here for convenience - perhaps should be 
   * retained in /data/list Model, with lookup key
   * @return {Object} data for rendering details
   */
  get data() {
    return this._data;
  }

  /**
   * Getter / Setter for selected state.  This is distinct from
   * the active property found full Modules, as Game is not
   * extended from Abstract.
   * @param  {[type]} bool [description]
   * @return {[type]}      [description]
   */
  set selected( bool ) {
    this._selected = bool;
    this.ui_updateSelected();
  }

  get selected(){
    return this._selected;
  }

  /*************************
   * UI Methods
   */

  /**
   * Updates image source to placeholder when error on loading provided path.
   * Implemented on 6/6 as 5 images provided in apparently otherwise valid
   * game data were returning 404s.
   * @param  {Event} e jQuery event
   * @return {null}
   */
  ui_handleImageEl404( e ) {
    // "this" is image - ui_handleImageEl404 not bound
    // to Game instance
    this.src = PATH_PLACEHOLDER;
  }

  /**
   * Instantiates view container, sets Module type class. Sets intial
   * selected style (if selected known at render )
   * Calls to nunjucks template async render.  No postRender necessary
   * @return {null}
   */
  ui_render() {
    if ( !this.$el ) {
      this.$el = $( '<div class="game' + ( this._selected ? ' ' + CSS_SELECTED : '' ) + '" />' ); //create static container
    }
    this.$el.html( gameTpl.render( this._data ) );
    this.ui_checkImages();
  }

  /**
   * Bind handler to image load error
   * @return {[type]} [description]
   */
  ui_checkImages(){
    this.$el.find( ".thumbnail" ).bind( { error: this.ui_handleImageEl404 } );
  }

  /**
   * Sets selected display state based on model selected state.
   * @return {null}
   */
  ui_updateSelected() {
    if ( this.$el ) { this.$el.toggleClass( CSS_SELECTED, this._selected ); }
  }
}

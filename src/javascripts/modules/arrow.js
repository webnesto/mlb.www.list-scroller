/**
 * Up / Down : Previous Day / Next Day Module
 * Renders Arrows html & maintains UI state
 */

var $ = require( 'jquery' );
var arrowTpl = require( 'nunjucks!../../html/views/arrow.html' );

import Abstract from './abstract';
import listModel from './../data/list';
import dateModel from './../data/date';

/** constants **/
const CSS_PREV = "prev"; /** CSS classname **/
const CSS_NEXT = "next"; /** CSS classname **/
const CSS_SELECTED = "selected"; /** css classname **/
const CSS_UNSELECTABLE = "unselectable"; /** css classname **/
const TYPE_UP = "up"; /** Module component state **/
const TYPE_DN = "down"; /** Module component state **/

/**
 * [STATES description]
 * @type {Object}
 */
export var STATES = {
  UP: TYPE_UP,
  DOWN: TYPE_DN
};

export default class Arrow extends Abstract {
  /**
   * Instantiator
   *  binds async functions to instance method
   *  sets initial property state
   * @return {Object}    instance of Arrow
   */
  constructor( direction, parentModule ) {
    super();
    this.parentModule = parentModule;
    this.direction = direction;
    this.active = false;
    this._selectable = false;

    this._ui_postRender = this.bind( this.ui_postRender );
    this._ui_updateStyles = this.bind( this.ui_updateStyles );

    dateModel.on( dateModel.EVENTS.DATA_CHANGE, this._ui_updateStyles );

    this.ui_render();
  }

  /*************************
   * Event Handlers
   */

  /**
   * Down Arrow handler, returns focus to parent
   *  module if this is an UP arrow
   * @param  {Event} e jQuery event object
   * @return {null}
   */
  handleDown( e ) {
    this.parentModule.active = this.direction == TYPE_UP;
  }

  /**
   * Up Arrow handler, returns focus to parent
   *  module if this is an DOWN arrow
   * @param  {Event} e jQuery event object
   * @return {null}
   */
  handleUp( e ) {
    this.parentModule.active = this.direction == TYPE_DN;
  }

  /**
   * Enter key handler, initiates listModel to load
   * previous (up) or next (down) day data
   * @param  {Event} e jQuery event object
   * @return {null}
   */
  handleEnter( e ) {
    listModel.load( this.direction == TYPE_UP ? listModel.ACTIONS.PREVIOUS_DAY : listModel.ACTIONS.NEXT_DAY );
  }

  /*************************
   * Property Getter/Setters
   */

  /**
   * Extends Abstract.active Getter/Setter
   * Only allows true state
   * when Module is selectable
   * @param  {Boolean} bool Desired active state
   * @return {null}
   */
  set active( bool ) {
    if ( !bool || ( bool && this.selectable ) ) {
      super.active = bool;
    }
    this.ui_updateStyles();
  }

  get active() {
    return super.active;
  }

  /**
   * Checks dateModel for validity of next day data load
   * and returns false otherwise
   * @return {Bool} Module selectability
   */
  get selectable() {
    return !( this.direction == TYPE_DN && !dateModel.can( dateModel.DIRECTIONS.NEXT ) );
  }

  /*************************
   * UI methods
   */

  /**
   * Instantiates view container, sets Module type class
   * Calls to nunjucks template async render, and passes off bound
   * postRender call
   * @return {null}
   */
  ui_render() {
    if ( !this.$el ) {
      this.$el = $( '<div class="arrow" />' ); //create static container
    }
    this.$el.addClass( this.direction == TYPE_UP ? CSS_PREV : CSS_NEXT );
    arrowTpl.render( {
      direction: this.direction,
      UP: TYPE_UP,
      DOWN: TYPE_DN
    }, this._ui_postRender );
    this.ui_updateStyles();
  }

  /**
   * Updates UI selected state based on active
   * @return {null}
   */
  ui_updateStyles() {
    if ( !this.$el ) {
      return;
    }
    this.$el.show();
    this.$el.toggleClass( CSS_SELECTED, this.active );
    this.$el.toggleClass( CSS_UNSELECTABLE, !this.selectable );
  }
}

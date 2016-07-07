/*************************
 * Dependencies
 */
var $ = require( 'jquery' );
require( 'jquery-ui/core' );
require( 'jquery-ui/effect' );
var listTpl = require( 'nunjucks!../../html/views/list.html' );

import Abstract from './abstract';
import Game from './game';
import Detail from './detail';
import Arrow, { STATES as ARROWSTATES } from './arrow';

import listModel from './../data/list';
import dateModel from './../data/date';

/** constants **/
const RENDER_DELAY = 500; /** Milliseconds - forced delay between re-render **/
const CSS_UNFOCUSED = "js-unfocused"; /** CSS classname **/

/** local **/
var children = [];
var _selected;

export default class List extends Abstract {
  /**
   * Instantiator
   *  binds async functions to instance method
   *  sets initial property state
   * @return {Object}    instance of Abstract
   */
  constructor( el ) {
    super();

    this.$el = $( el );
    this._ui_lastRender = 0;

    // create instance methods for any that will lose scope
    this._ui_render = this.bind( this.ui_render );
    this._ui_postRender = this.bind( this.ui_postRender );
    this._ui_update = this.bind( this.ui_update );

    listModel.on( listModel.EVENTS.DATA_CHANGE, this.bind( this.handleDataChange ) );
    listModel.on( listModel.EVENTS.STATE_CHANGE, this.bind( this.handleStateChange ) );

    //render default
    this.active = true;
    this.ui_render();

    //load model
    listModel.load();

  }

  /*************************
   * Event Handlers
   */

  handleDataChange( e ) {
    this.active = true;
    this.selected = 0;
    this.ui_update();
  }

  handleStateChange( e ) {
    this.ui_loading = true;
    this.ui_setLoader();
  }

  handleLeft( e ) {
    this.prevGame();
  }

  handleRight( e ) {
    this.nextGame();
  }

  handleUp( e ) {
    this.prevDayModule.active = true;
  }

  handleDown( e ) {
    this.nextDayModule.active = true;
  }

  handleEnter( e ) {
    var detail;
    var gameData = this.selected.data;
    if ( !this.detail ) {
      detail = new Detail( gameData, this );
      this.detail = detail;
    } else {
      this.detail.game = gameData;
    }
    this.ui_attachDetail();
    this.detail.active = true;
  }

  /*************************
   * Property Getter/Setters
   */
  set ui_loading( bool ) {
    if ( bool ) { this._ui_lastRender = 0; }
    // TODO: set a timer ensuring load complete in 
    // reasonable time or
    // useful error messaging displayed
  }

  get ui_loading() {
    return listModel.state == listModel.STATES.LOADING;
  }

  get selected() {
    return children[ _selected ];
  }

  set selected( index ) {
    var current = this.selected;
    var nextVid;
    _selected = index;
    nextVid = this.selected;
    if ( current ) {
      current.selected = false;
    }
    if ( nextVid ) {
      nextVid.selected = true;
    }
    this.ui_updatePosition();
  }

  set active( bool ) {
    super.active = bool;
    this.ui_updateFocus();
  }

  get active() {
    return super.active;
  }

  populateChildren() {
    var collection = listModel.collection;
    this.ui_teardownChildren();
    children = []; //reset children
    if ( listModel.state == listModel.STATES.LOADED ) {
      for ( var i = 0, l = collection.length, game, init; i < l; i++ ) {
        game = new Game( collection[ i ], i === _selected );
        children.push( game );
      }
      this.ui_renderChildren();
      this.prevDayModule = this.prevDayModule || new Arrow( ARROWSTATES.UP, this );
      this.nextDayModule = this.nextDayModule || new Arrow( ARROWSTATES.DOWN, this );
      this.ui_attachArrows();
    }
  }

  nextGame() {
    this.selected = _selected + 1;
  }

  prevGame() {
    this.selected = _selected - 1;
  }

  /*************************
   * UI Methods
   */

  ui_setLoader() {
    if ( this.ui_loading ) {
      this.ui_render();
    }
    //else do nothing
  }

  ui_render() {
    listTpl.render( {
      month: dateModel.month,
      day: dateModel.day,
      year: dateModel.year,
      state: listModel.state,
      STATES: listModel.STATES
    }, this._ui_postRender );
    this._ui_lastRender = Date.now();
  }

  ui_postRender() {
    super.ui_postRender.apply( this, arguments );
    this.$el.find( ">" ).first().fadeIn();
    this.populateChildren();
  }

  ui_teardownChildren() {
    for ( var i = 0, l = children.length, child; i < l; i++ ) {
      child = children[ i ];
      child.$el.remove();
    }
  }

  ui_renderChildren() {
    var $container = this.$el.find( '[data-module="games"]' );
    for ( var i = 0, l = children.length, game; i < l; i++ ) {
      game = children[ i ];
      $container.append( game.$el );
    }
  }

  ui_attachArrows() {
    this.prevDayModule.ui_parent = this.$el;
    this.nextDayModule.ui_parent = this.$el;
  }

  ui_updatePosition() {
    if ( !children.length ) {
      return;
    }
    var $container = this.$el.find( ".list-scroller" );
    var $item = $container.find( ">" );
    var width = $item.outerWidth() + parseInt( $item.css( "margin-right" ), 10 );
    var tooleft = _selected < 0;
    var tooright = _selected > children.length - 1;
    if ( !tooleft && !tooright && _selected !== 0 && _selected < children.length - 1 ) {
      //move animation to end
      $container.finish();
    }
    $container.animate( {
      left: ( width * _selected ) * -1 + ( this.$el.width() * 0.2 ) //$container.position().left + offset
    }, "easeInOutExpo" );
    if ( tooleft ) {
      this.selected = 0;
    } else if ( tooright ) {
      this.selected = children.length - 1;
    }
    //else do nothing
  }

  ui_attachDetail() {
    this.detail.ui_parent = this.$el;
  }

  ui_update() {
    // Don't update the UI so fast that it causes a jerky user experience
    if ( Date.now() - RENDER_DELAY > this._ui_lastRender ) {
      this.$el.find( ">" ).fadeOut( this._ui_render );
    } else {
      clearTimeout( this.timeout );
      this.timeout = setTimeout( this._ui_update, RENDER_DELAY );
    }
  }

  ui_updateFocus() {
    this.$el.toggleClass( CSS_UNFOCUSED, !this.active );
  }
}

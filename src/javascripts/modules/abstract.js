/**
 * Abstract Module
 * - Handles key binding
 * - Active module handling
 * - Utility methods
 */

var $ = require( 'jquery' );

/** @type {jQuery Object} DOM body element cast as jQuery */
var $body = $( document.body );

/**
 * class holder for focused UI element
 * TODO: should probably be managed via app controller or
 * rethink "Abstract" possibly to "Master" or some other
 * clearer indication of role
 */
var current;

export default class Abstract {
  /**
   * Instantiator
   *  binds async functions to instance method
   *  sets initial property state
   * @return {Object}    instance of Abstract
   */
  constructor() {
    this._handleKey = this.bind( this.handleKey );

    this._active = false;
  }

  /*************************
   * Event Handlers
   */

  /**
   * Captures all keystrokes (when bound) and
   * differentiates key type, calling key specific
   * handlers as necessary
   * Supported Keys:
   *  - Enter
   *  - Left Arrow
   *  - Right Arrow
   *  - Up Arrow
   *  - Down Arrow
   * @param  {Event} e jQuery event object
   * @return {null}
   */
  handleKey( e ) {
    switch ( e.keyCode ) {
      case 13: //Enter
        this.handleEnter( e );
        break;
      case 37: //Left Arrow
        this.handleLeft( e );
        break;
      case 38: //Up Arrow
        this.handleUp( e );
        break;
      case 39://Right Arrow
        this.handleRight( e );
        break;
      case 40://Down Arrow
        this.handleDown( e );
        break;
      default:
        //do nothing
    }
  }

  /**
   * Empty handlers for key registration. 
   * Should be overridden by subclasses
   * as needed
   */

  handleLeft( e ) {}
  handleRight( e ) {}
  handleUp( e ) {}
  handleDown( e ) {}
  handleEnter( e ) {}

  /*************************
   * Property Getter/Setters
   */

  /**
   * Boolean that indicates whether or not this element is currently
   * active
   * @return {Boolean}
   */
  get active() {
    return this._active;
  }

  /**
   * Setter for active module
   * - deactivates any other modules
   * - binds keyboard listeners to handlers
   * - sets current to this module
   * @param  {Boolean} bool
   * @return {null}
   */
  set active( bool ) {
    if ( bool && !current ){ current = this; }
    if ( this._active === bool ) { //no change
      return;
    }
    if( bool && current != this ){
      current.active = false;
      current = this;
    }
    //else
    this._active = bool;
    if ( bool ) {
      this.ui_makeActive();
    } else {
      this.ui_makeInactive();
    }
  }

  /**
   * Getter/Setters for ui parent
   * on set - appends this.$el{Jquery Object} to
   * argument $el
   * @param  {jQuery Object} $el jQuery object wrapper for parent DOM element
   * @return {jQuery Object}     The parent node of instance DOM element
   */
  set ui_parent( $el ){
    if( !this.ui_parent.length ){
      $el.append( this.$el );
    }
  }

  get ui_parent(){
    return this.$el.parent();
  }

  /*************************
   * UI Methods
   */

  /**
   * Asynchronous callback from nunjucks-loader after rendering template
   * @param  {String} err  Error messaging provided by nunjucks
   * @param  {String} html Output of template rendering
   * @return {null}
   */
  ui_postRender( err, html ) {
    if ( err ) {
      throw err; //TODO: handling for this
    }
    this.$el.html( html );
  }

  /**
   * binds all keystrokes to instance-bound handler
   * @return {null}
   */
  ui_makeActive() {
    $body.on( "keydown", this._handleKey );
  }

  /**
   * unbinds instance-bound-handler
   * @return {[type]} [description]
   */
  ui_makeInactive() {
    $body.off( "keydown", this._handleKey );
  }

  /**
   * Utility method to bind function to instance
   * ensuring proper "this" scope.  Useful for asynch
   * methods
   * @param  {Function} fn method to be bound
   * @return {Function}      bound function
   */
  bind( fn ) {
    var that = this;
    return function () {
      fn.apply( that, arguments );
    };
  }
}

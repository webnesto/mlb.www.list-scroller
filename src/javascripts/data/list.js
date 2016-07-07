/**
 * List Model
 */

//IDEA: cache previous day data for faster loading

var $ = require( 'jquery' );
import mlb from './mlb';
import date from './date';
import Game from './game';

/** constants **/
const STATE_LOADING = "LOADING";
const STATE_LOADED = "LOADED";
const TODAY = "TODAY";
const NEXT_DAY = "NEXT_DAY";
const PREVIOUS_DAY = "PREVIOUS_DAY";
const collection = "collection";
const state = "state";

/** local **/
var _collection = {};
var _state = STATE_LOADING;
var _listeners = {};

/*************************
 * Private methods
 */
function getListeners( change ) {
  if ( !_listeners.hasOwnProperty( change ) ) {
    _listeners[ change ] = [];
  }
  return _listeners[ change ];
}

function removeListener( change, callback ) {
  var listeners = getListeners( change );
  for ( var i = 0, l = listeners.length; i < l; i++ ) {
    if ( listeners[ i ] == callback ) {
      listeners.splice( i, 1 );
    }
  }
}

function announce( change ) {
  var listeners = getListeners( change );
  for ( var i = 0, l = listeners.length; i < l; i++ ) {
    listeners[ i ]( change, this );
  }
}

function handleLoadSuccess( response ) {
  // console.log( "data/list handleLoadSuccess", response )
  var games = response.data.games.game;
  var results = [];
  for ( var i = 0, l = games.length, game; i < l; i++ ) {
    game = new Game( games[ i ], i );
    if( !game.invalid ){
      results.push( game );
    }
  }
  this.state = STATE_LOADED;
  this.collection = results;
}

export default { // singleton for this app
  get collection() {
    return _collection;
  },
  set collection( value ) {
    _collection = value;
    //announce
    announce.call( this, collection );
    //chain
    return this;
  },
  get state() {
    return _state;
  },
  set state( value ) {
    if ( _state == this.STATES[ value ] ) {
      return this; //no change
    }
    //TODO: ensure valid state or make state setter private
    _state = this.STATES[ value ];
    //announce
    announce( state );
  },
  load( day = TODAY ) {
    this.state = STATE_LOADING;

    switch ( day ) {
      case TODAY:
        date.reset();
        break;
      case NEXT_DAY:
        date.next();
        break;
      case PREVIOUS_DAY:
        date.prev();
        break;
    }

    mlb.load( {
      context: this,
      success: handleLoadSuccess,
      error: function ( data ) {
        console.error( "error retrieving data", data );
      }
    } );

  },
  on( change, callback ) {
    getListeners( change ).push( callback );
  },
  off( change, callback ) {
    removeListener( change, callback );
  },
  EVENTS: {
    DATA_CHANGE: collection,
    STATE_CHANGE: state,
  },
  STATES: {
    LOADING: STATE_LOADING,
    LOADED: STATE_LOADED
  },
  ACTIONS: {
    TODAY, NEXT_DAY, PREVIOUS_DAY
  }
};

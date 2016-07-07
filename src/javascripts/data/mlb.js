var $ = require( 'jquery' );
import date from './date';

var _cache = {};

function getCache( keys, data=false ) {
  var [ year, month, day ] = keys;
  if ( !_cache.hasOwnProperty( year ) ) {
    _cache[ year ] = {};
  }
  if ( !_cache[ year ].hasOwnProperty( month ) ) {
    _cache[ year ][ month ] = {};
  }
  if ( !_cache[ year ][ month ].hasOwnProperty( day ) || _cache[ year ][ month ][ day ] === false ) {
    _cache[ year ][ month ][ day ] = data;
  }
  return _cache[ year ][ month ][ day ];
}

function wrap( cacheKeys, props ) {
  var _success = props.success;
  return $.extend( props, {
    success: function ( data ) {
      getCache( cacheKeys, data );
      _success.call( props.context, data );
    }
  } );
}

function cacheKeys(){
  return [ date.year, date.month, date.day ];
}

export default {
  load( props ) {
    var keys = cacheKeys();
    var cache = getCache( keys );
    if ( !cache ) {
      $.ajax( "http://gdx.mlb.com/components/game/mlb/year_" + date.year + "/month_" + date.month + "/day_" + date.day + "/master_scoreboard.json", wrap( keys, props ) );
    } else {
      props.success.call( props.context, cache );
    }
  }
};

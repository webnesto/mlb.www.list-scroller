var _date;
var _year;
var _month;
var _day;
var listeners = [];

const today = new Date();
const EVENT_DATA_CHANGE = "EVENT_DATA_CHANGE";
const DIRECTION_NEXT= "next";
const DIRECTION_PREV= "prev";

function setStartOfDay( date ) {
  date.setHours( 0 );
  date.setMinutes( 0 );
  date.setSeconds( 0 );
  date.setMilliseconds( 0 );
}

function resetDate() {
  _date = new Date();
  setStartOfDay( _date );
}

function updateDateBits() {
  _year = _date.getFullYear();
  _month = ( "0" + _date.getMonth() ).slice( -2 );
  _day = ( "0" + _date.getDate() ).slice( -2 );
  announce();
}

function announce() {
  for ( var i = 0, l = listeners.length; i < l; i++ ) {
    listeners[ i ]( this );
  }
}

//set defaults
setStartOfDay( today );
resetDate();
updateDateBits();

export default { // singleton - maintains current date
  get current() {
    return {
      day: this.day,
      month: this.month,
      year: this.year
    };
  },
  get day() {
    return _day;
  },
  set day( val ) {
    _day = val;
  },
  get month() {
    return _month;
  },
  set month( val ) {
    _month = val;
  },
  get year() {
    return _year;
  },
  set year( val ) {
    _year = val;
  },
  reset() {
    resetDate();
  },
  [DIRECTION_NEXT]() {
    var target = this.can( DIRECTION_NEXT );
    if ( target !== false ) {
      _date.setDate( _date.getDate() + target );
      updateDateBits();
    } else {
      return false;
    }
  },
  [DIRECTION_PREV]() {
    var target = this.can( DIRECTION_PREV );
    if ( target !== false ) {
      _date.setDate( _date.getDate() + target );
      updateDateBits();
    } else {
      return false;
    }
  },
  can( dir ) {
    var mod = dir == DIRECTION_NEXT ? 1 : -1;
    var testDate = new Date( _date.getTime() ); //create a new date object with our current date value
    testDate.setDate( testDate.getDate() + mod ); //modify the day (lets the Date object handle the month/year calcs)
    if ( testDate.getTime() <= today.getTime() ) {
      return mod;
    }
    //else
    return false;
  },
  on( type, callback ) {
    if ( type == "change" ) {
      listeners.push( callback );
    }
  },
  off( type, callback ) {
    if ( type == "change" ) {
      for ( var i = 0, l = listeners.length; i < l; i++ ) {
        if ( listeners[ i ] == callback ) {
          listeners.splice( i, 1 );
        }
      }
    }
  },
  EVENTS: {
    DATA_CHANGE: EVENT_DATA_CHANGE
  },
  DIRECTIONS: {
    NEXT: DIRECTION_NEXT,
    PREVIOUS: DIRECTION_PREV
  }
};
//TODO: add validation to all setters

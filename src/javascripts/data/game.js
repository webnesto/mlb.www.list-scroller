var _data = {};

function getThumbnail( game ) {
  if( !game.video_thumbnails || !game.video_thumbnails.thumbnail ){
    return false; //TODO: use a placeholder graphic for these games?
  }
  var thumbs = game.video_thumbnails.thumbnail;
  for ( let i = 0, l = thumbs.length, thumb = thumbs[ i ]; i < l; i++ ) {
    if ( thumb.scenario == "7" ) {
      return thumb;
    }
  }
  //error
  throw ( "data/game getThumbnail no thumb found for game" ); //TODO: handling for this
}

export default class Game {
  constructor( data, index ) {
    this.index = index;
    this._raw = data;
    this.parseRaw();
    return this;
  }
  get raw() {
    return this._raw;
  }
  parseRaw() {
    var game = this._raw;
    var thumb = getThumbnail( game );
    if(!thumb){
      this.invalid = true;
      return;
    }
    this.src = thumb.content;
    this.height = thumb.height;
    this.width = thumb.width;
    this.$el = "";
    this.venue = game.venue;
    this.away_team_name = game.away_team_name;
    this.away_team_city = game.away_team_city;
    this.home_team_name = game.home_team_name;
    this.location = game.location;
  }
}

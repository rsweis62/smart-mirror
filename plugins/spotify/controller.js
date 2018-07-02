/* eslint-disable indent */
function SPOTIFY($scope, $http, $interval) {

  getSongData();

  $interval(getSongData, config.spotify.refreshInterval * 1000 || 60000)

  function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function getSongData() {
    $http.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {'Authorization': 'Bearer ' + config.spotify.spotifyToken}
    }).catch(function (e) {
      console.log("No response for spotify: "+ e);
      // getToken();
      return "";
    })
      .then(function successCallback(response) {
          if (response !== "") {
            let item = response.data.item;
            $scope.music = {
              song: item.name,
              artists: item.artists.map(e => e.name).join(','),
              albumImage: item.album.images[2].url,
              time: millisToMinutesAndSeconds(response.data.progress_ms)
            }
          }
        }
      )
  }

}

angular.module('SmartMirror')
  .controller('SPOTIFY', SPOTIFY);
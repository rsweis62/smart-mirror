/* eslint-disable indent */
function SPOTIFY($scope, $http, $interval) {

  getSongData();

  $interval(getSongData, config.spotify.refreshInterval * 1000 || 60000)

  function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  // function getToken() {
  //   $http.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded',
  //       'Authorization': 'Basic ' + btoa('40b985d4a8834d25b4949272d6a41e2a' + ':' + '56cc840ec78649faba6bd0ba8232382a')
  //     }
  //   }).catch(function (e) {
  //     console.log("No response for spotify: " + e);
  //     return "";
  //   })
  //     .then(function successCallback(response) {
  //       localStorage.setItem('spotifyToken', response.data.access_token)
  //   });
  // }

  function getToken() {
    //redirect_uri=https%3A%2F%2Fdeveloper.spotify.com%2Fcallback
    $http.get('https://accounts.spotify.com/authorize?client_id=40b985d4a8834d25b4949272d6a41e2a&redirect_uri=http:%2F%localhost:8080&scope=user-read-currently-playing&response_type=token&state=123')
      .catch(function (e) {
      console.log("No response for spotify: " + e);
      return "";
    })
      .then(function successCallback(response) {
        localStorage.setItem('spotifyToken', response.data.access_token)
      });
  }


  function getSongData() {
    $http.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('spotifyToken')}
    }).catch(function (e) {
      console.log("No response for spotify: "+ e);
      getToken();
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
/* eslint-disable indent */
function SPOTIFY($scope, $http, $interval) {

  getTokenByCode();

  $interval(getSongData, config.spotify.refreshInterval * 1000 || 60000)

  function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function getTokenByCode() {
    let spotifyToken = localStorage.getItem('spotifyToken');
    let refToken = localStorage.getItem('spotifyRefreshToken');
    if(refToken === null || refToken === '') {
      let params = 'grant_type=authorization_code&redirect_uri=' + config.spotify.redirectUrl + '&code=' + config.spotify.spotifyCode;
      let req = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token?' + params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(config.spotify.clientId + ':' + config.spotify.clientSecret)
        },
        data: params
      }
      $http(req).catch(function (e) {
        console.log("Token error: " + e);
        return "";
      })
        .then(function successCallback(response) {
          if (response !== "") {
            $scope.spotifyToken = response.data.access_token;
            $scope.spotifyRefreshToken = response.data.refresh_token;
            localStorage.setItem('spotifyToken', $scope.spotifyToken)
            localStorage.setItem('spotifyRefreshToken', $scope.spotifyRefreshToken)
            getSongData();
          }
        });
    } else {
      $scope.spotifyToken = spotifyToken;
      $scope.spotifyRefreshToken = refToken;
      getSongData();
    }
  }

  function getTokenByRefresh() {
    let params = 'grant_type=refresh_token&refresh_token=' + $scope.spotifyRefreshToken;
    let req = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token?' + params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(config.spotify.clientId + ':' + config.spotify.clientSecret)
      },
      data: params
    }
    $http(req).catch(function (e) {
      console.log("Token error: " + e);
      return "";
    })
      .then(function successCallback(response) {
        if (response !== "") {
          $scope.spotifyToken = response.data.access_token;
          $scope.spotifyRefreshToken = response.data.refresh_token;
        }
      });
  }

  function getSongData() {
    let config = { headers: { 'Authorization': 'Bearer ' + $scope.spotifyToken } };
    $http.get('https://api.spotify.com/v1/me/player/currently-playing', config)
    .catch(function (e) {
      console.log("No response for spotify: "+ e);
      getTokenByRefresh();
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
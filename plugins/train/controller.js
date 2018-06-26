/* eslint-disable indent */
function TRAIN($scope, $http, $interval) {

  getStopData()
  $interval(getStopData, config.train.refreshInterval * 1000 || 60000)

  function getStopData() {
    $scope.stops = [];

    // for each show in config, create http request
    angular.forEach(config.train.stops, function (stopId) {
      $http.get('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=5523d11434674c9bb30d41fd84416da6&outputType=JSON&max=5&mapid=' + stopId)
        .catch(function () { // if no response for a show add blank response, log error
          console.log("No response for train: " + stopId);
          return "";
        })
        .then(function (response) {
          if (response !== "") {
            const stopTimes = response.data.ctatt.eta;
            if (!stopTimes.length) {
              $scope.noTimes = true;
              $scope.nopredictionmessage = 'No times available...';
            } else {
              $scope.noTimes = false;
              for (let i = 0; i < stopTimes.length; i++) {
                const time = stopTimes[i];
                const date = new Date(time.arrT);
                const currentDate = new Date(time.prdt);
                const minutes = ((date-currentDate)/1000/60).toFixed();
                const mappedData = {
                  stopId: time.staId,
                  stopName: time.staNm,
                  stopDirection: time.destNm,
                  stopLine: time.rt,
                  isLive: time.isSch === '0',
                  arrivalTime: minutes < 2 ? 'Due' : minutes.toString() + ' minutes'
                }
                $scope.stops.push(mappedData);
              }
            }
          }
        })
    });
  }
}

angular.module('SmartMirror')
  .controller('TRAIN', TRAIN);
/* eslint-disable indent */
function CTA($scope, $http, $interval) {

  getStopData()
  $interval(getStopData, config.cta.refreshInterval * 1000 || 60000)

  function getStopData() {
    $scope.stops = [];

    // for each show in config, create http request
    angular.forEach(config.cta.stops, function (stopId) {
      $http.get('http://www.ctabustracker.com/bustime/api/v2/getpredictions?key=t5nqVPAR8gT6aKnj9ekksZ8Cu&format=json&stpid=' + stopId)
        .catch(function () { // if no response for a show add blank response, log error
          console.log("No response for cta: " + stopId);
          return "";
        })
        .then(function (response) {
          if (response !== "") {
            const busData = response.data['bustime-response'];
            if (busData.error) {
              $scope.noTimes = true;
              $scope.nopredictionmessage = 'No times available...';
            } else {
              $scope.noTimes = false;
              const stopTimes = busData.prd
              for (let i = 0; i < stopTimes.length; i++) {
                const time = stopTimes[i];
                const minutes = time.prdctdn;
                const mappedData = {
                  stopId: time.stpid,
                  stopName: time.rt + " - " + time.stpnm + " " + time.rtdir,
                  stopLine: time.rt,
                  arrivalTime: minutes === 'DUE' ? minutes : minutes + ' minutes'
                }

                if($scope.stops[mappedData.stopId]) {
                  $scope.stops[mappedData.stopId].push(mappedData);
								} else {
                  $scope.stops[mappedData.stopId] = [mappedData];
                }
              }
              $scope.stops = $scope.stops.filter(value => Object.keys(value).length !== 0);
            }
          }
        })
    });
  }
}

angular.module('SmartMirror')
  .controller('CTA', CTA);
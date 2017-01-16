function CTA($scope, $http, $interval, ngXml2json) {

    getStopData()
    $interval(getStopData, config.cta.refreshInterval * 60000 || 7200000)

    function getStopData() {
        $scope.stops = [];

        // for each show in config, create http request
        angular.forEach(config.cta.stops, function (stopId) {
            $http.get('http://www.ctabustracker.com/bustime/eta/getStopPredictionsETA.jsp?route=all&stop=' + stopId)
                .catch(function () { // if no response for a show add blank response, log error
                    console.log("No response for show: " + stopId);
                    return "";
                })
                .then(function (response) {
                    if (response != "") {
                        var times = ngXml2json.parser(response.data).stop.pre;
                        if(times.length){
                            for( i=0; i < times.length; i++ ) {
                                var time = times[i];
                                if(time.pu == 'APPROACHING'){
                                    time.pt = '';
                                }
                                $scope.stops.push(time);
                            }
                        } else {
                            if(times.pu == 'APPROACHING'){
                                times.pt = '';
                            }
                            $scope.stops.push(times);
                        }
                    }
                })
        });
    }
}

angular.module('SmartMirror')
    .controller('CTA', CTA);
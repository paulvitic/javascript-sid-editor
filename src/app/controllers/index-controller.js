define([], function() {

'use strict';

return function(ngModule){
  ngModule.controller('indexCtrl', ['$scope', '$routeParams', 'domService',
    function ($scope, $routeParams, domService) {

    console.log('$routeParams', $routeParams);

    $scope.name = 'results page';
    $scope.value = 10;
    $scope.params = $routeParams;

    $scope.model = undefined;

    var doc = undefined;
    $scope.serializedModel = undefined;

    function serialize(){
      if ($scope.model){
        if (!doc){
          doc = domService.getRoot();
        }

        if ($scope.model.type || $scope.model.version){

          var identifierList;
          if (doc.getElementsByTagName('identification').length === 0 ){
            var identification = doc.createElementNS(sensormlNs, 'identification');
            doc.getElementsByTagName("System")[0].appendChild(identification);
            identifierList = doc.createElementNS(sensormlNs, 'IdentifierList');
            identification.appendChild(identifierList);
          } else {
            identifierList = doc.getElementsByTagName('IdentifierList')[0];
          }

          if ($scope.model.type && $scope.model.type !== '_______'){
            var typeTerms = doc.querySelectorAll('Term[definition="urn:vektor:def:identifier:vmp:deviceType"]');
            var typeValue;
            if (typeTerms.length === 0){
              var typeTerm = doc.createElementNS(sensormlNs, 'Term');
              typeTerm.setAttribute('definition', 'urn:vektor:def:identifier:vmp:deviceType');
              identifierList.appendChild(typeTerm);
              typeValue = doc.createElementNS(sensormlNs, 'value');
              typeTerm.appendChild(typeValue);
            } else {
              typeValue = typeTerms[0].firstChild;
            }
            typeValue.textContent=$scope.model.type;
          }

          if ($scope.model.version && $scope.model.version !== '_______'){
            var versionTerms = doc.querySelectorAll('Term[definition="urn:vektor:def:identifier:vmp:deviceVersion"]');
            var versionValue;
            if (versionTerms.length === 0){
              var versionTerm = doc.createElementNS(sensormlNs, 'Term');
              versionTerm.setAttribute('definition', 'urn:vektor:def:identifier:vmp:deviceVersion');
              identifierList.appendChild(versionTerm);
              versionValue = doc.createElementNS(sensormlNs, 'value');
              versionTerm.appendChild(versionValue);
            } else {
              versionValue = versionTerms[0].firstChild;
            }
            versionValue.textContent=$scope.model.version;
          }
        }

        var serializer = new XMLSerializer();
        $scope.serializedModel = serializer.serializeToString(doc);
      } else {
        $scope.serializedModel = undefined;
      }
    }

    $scope.$watch(
        function () {
          return $scope.model;
        },
        function (changed) {
          console.log("model change at controller: " + JSON.stringify(changed));
          serialize();
        },
        true
    );

  }]);
};
});
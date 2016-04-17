define([], function (){
'use strict';

return function(ngModule){

  ngModule.factory('domService', [function (){

      function getRoot(){
        var ns = 'http://www.w3.org/2000/xmlns/';
        var xsi = 'http://www.w3.org/2001/XMLSchema-instance';
        var sensormlNs = 'http://www.opengis.net/sensorML/1.1.0';
        var sidNs = 'http://www.orangenkiste.de/SID/0.5.0';
        var doc = document.implementation.createDocument(sensormlNs, 'System', null);
        doc.documentElement.setAttributeNS(ns, 'xmlns:sid', sidNs);
        doc.documentElement.setAttributeNS(xsi, 'xsi:schemaLocation',
            'http://www.opengis.net/sensorML/1.1.0 ' +
            'xsd/SID/sid.xsd');
        return doc;
      }

      return{
        getRoot: getRoot
      };

  }]);

};});
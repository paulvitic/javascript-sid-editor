define([
  // If you create a new filter and want to use in angular
  // Please add it to the list below, in alphabetical order.
  'app/filters/pretty-xml'
],
function(){

var args = Array.prototype.slice.call(arguments);

    return function(ngModule){

    // For each of the filters listed above
    args.forEach(function(filter){
      // Create angular filter with
      // filter name = filter.name
      // filter function = filter.filter
      ngModule.filter(filter.name, function(){
        return filter.filter;
      });
    });
  };
});

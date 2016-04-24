define([
    'd3',
    'app/directives/menu',
    'app/directives/editable-text'
], function (d3, menu, editableText) {
    'use strict';

    return function (ngModule) {
        ngModule.directive('editor', [function () {
            return {
                restrict: 'E',
                replace: true,
                template: '<div class="editor"></div>',
                scope: {
                    width: '=width',
                    height: '=height',
                    model: '=model',
                    hovered: '&hovered'
                },
                link: function (scope, element, attrs) {

                    var svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", scope.width)
                        .attr("height", scope.height)
                        .attr("id", "canvas")
                        .on('contextmenu', function (d) {
                            menu.show(this, scope) ;
                        })
                        .append("g")
                        .attr("transform", "translate(5,5)");

                    menu.init(element[0]);

                    var systemAttributes = [];

                    // D3 data
                    function attributes(d){
                        var index = 0;
                        var initX = 50;
                        var initY = 50;
                        return d.reduce(function (currentArr, attribute) {
                            currentArr.push({x:initX, y:initY, label:attribute.name, value:attribute.value, i:index});
                            initY += 25;
                            index ++;
                            return currentArr;
                        }, []);
                    }

                    var makeEditable = editableText(scope);

                    // Draw
                    var redraw = function(){
                        if (scope.model){
                            var rect = svg.append('g')
                                .attr("id", 'rootGroup');

                            rect.append("rect")
                                .attr("id", 'root')
                                .attr("x", 30)
                                .attr("y", 30)
                                .attr("height", 100)
                                .attr("width", 200)
                                .attr("rx", 10)
                                .attr("ry", 10)
                                .attr('class', 'modelElement')
                                .on('contextmenu', function (d) {
                                    menu.show(this, scope) ;
                                });

                            rect.selectAll("text.label")
                                .data(systemAttributes)
                                .enter()
                                .append('text')
                                .attr("class", "label")
                                .attr('x', function(d) {return d.x;})
                                .attr('y', function(d) {return d.y;})
                                .text(function(d) {return d.label;});

                            rect.selectAll("text.value")
                                .data(systemAttributes)
                                .enter()
                                .append('text')
                                .attr("class", "value")
                                .attr('x', function(d) {return d.x + 35;})
                                .attr('y', function(d) {return d.y;})
                                .text(function(d) {return d.value;})
                                .call(makeEditable);

                            if (scope.model.interfaces){
                                for (var i = 0; i < scope.model.interfaces.length; i++){
                                    rect.append("rect")
                                        .attr("id", 'root')
                                        .attr("x", 50)
                                        .attr("y", 70)
                                        .attr("height", 100)
                                        .attr("width", 200)
                                        .attr("rx", 10)
                                        .attr("ry", 10)
                                        .attr('class', 'modelElement')
                                        .on('contextmenu', function (d) {
                                            menu.show(this, scope) ;
                                        });
                                }
                            }

                        } else {
                            svg.selectAll("g#rootGroup").remove();
                        }
                    };

                    //================
                    // watch model
                    // ===============
                    scope.$watch(
                        function () {
                            return scope.model;
                        },
                        function (changed) {
                            console.log("model change at directive: " + JSON.stringify(changed));
                            if (changed && changed.attributes){
                                systemAttributes = attributes(changed.attributes);
                            }
                            redraw();
                        },
                        true
                    );
                }
            };
        }]);
    };
});
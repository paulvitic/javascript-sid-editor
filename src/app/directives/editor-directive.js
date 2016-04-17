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

                    // D3 data
                    var stack = d3.layout.stack()
                        .offset("wiggle")
                        .values(function(d) {
                            return d.values;
                        });

                    var system = [
                        {
                            "name": "apples",
                            "values": [
                                { "x": 0, "y":  91},
                                { "x": 1, "y": 290}
                            ]
                        },
                        {
                            "name": "oranges",
                            "values": [
                                { "x": 0, "y":  9},
                                { "x": 1, "y": 49}
                            ]
                        }
                    ];

                    var redraw = function(){
                        if (scope.model){
                            var rect = svg.append('g')
                                .attr("id", 'rootGroup');

                            rect.selectAll("rect")
                                .data(stack(system))
                                .enter()
                                .append("rect")
                                .attr("id", function(d) {
                                    return d.name;
                                });

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

                            rect.append("text")
                                .attr("class", "title")
                                .attr("x", 40)
                                .attr("y", 50)
                                .text('Type:');

                            rect.append("text")
                                .attr("class", "title")
                                .attr("x", 85)
                                .attr("y", 50)
                                .text(scope.model.type ? scope.model.type : '_______')
                                .call(editableText.makeEditable, "type", scope);

                            rect.append("text")
                                .attr("class", "title")
                                .attr("x", 40)
                                .attr("y", 65)
                                .text('Version:');

                            rect.append("text")
                                .attr("class", "title")
                                .attr("x", 85)
                                .attr("y", 65)
                                .text(scope.model.version ? scope.model.version : '_______')
                                .call(editableText.makeEditable, "version", scope);

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
                            console.log("model change: " + JSON.stringify(changed));
                            redraw();
                        },
                        true
                    );
                }
            };
        }]);
    };
});
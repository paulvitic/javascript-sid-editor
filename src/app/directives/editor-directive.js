define([
    'd3',
    'app/directives/menu'
], function (d3, menu) {
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

                            rect.selectAll("text")
                                .data(systemAttributes)
                                .enter()
                                .append('text')
                                .attr("class", "title")
                                .attr('x', function(d) {return d.x;})
                                .attr('y', function(d) {return d.y;})
                                .text(function(d) {return d.label;});

                            rect.selectAll("foreignObject")
                                .data(systemAttributes)
                                .enter()
                                .append("foreignObject")
                                .attr("x", function(d) {return d.x + 45;})
                                .attr("y", function(d) {return d.y - 15;})
                                .append("xhtml:form")
                                .append("input")
                                .attr("value", function (d) {
                                    return d.value;
                                })
                                .attr("style", "width: 98px;")
                                .on("blur", function (d) {
                                    var value = this.value;
                                    scope.$apply(function(m){
                                        m.model.attributes[d.i].value = value;
                                    });
                                })
                                .on("keypress", function (d) {
                                    var value = this.value;
                                    // IE fix
                                    if (!d3.event) d3.event = window.event;
                                    var e = d3.event;
                                    if (e.keyCode == 13) {
                                        if (typeof(e.cancelBubble) !== 'undefined') // IE
                                            e.cancelBubble = true;
                                        if (e.stopPropagation)
                                            e.stopPropagation();
                                        e.preventDefault();

                                        scope.$apply(function(m){
                                            m.model.attributes[d.i].value = value;
                                        });
                                    }
                                });

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
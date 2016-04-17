define(['d3'], function (d3) {

        var content = function(elm){
            switch (elm.id){
                case 'canvas':
                    return [
                        {
                            title: 'Add',
                            action: function (elm, scope) {
                                if (!scope.model){
                                    scope.$apply(function(){
                                        scope.model = {};
                                    });
                                }
                            }
                        }
                    ];
                    break;
                case 'root':
                    return [
                        {
                            title: 'Remove',
                            action: function (elm, scope) {
                                if (scope.model){
                                    scope.$apply(function(){
                                        scope.model = undefined;
                                    });
                                }
                            }
                        },
                        {
                            title: 'Add interface',
                            action: function (elm, scope) {
                                if (scope.model){
                                    if(!scope.model.interfaces){
                                        scope.model.interfaces = [];
                                        scope.$apply(function(){
                                            scope.model.interfaces.push(
                                                {
                                                    name:'________'
                                                }
                                            );
                                        });
                                    }
                                }
                            }
                        }
                    ];
                    break;
                default:
                    return [];
            }

        };

        var init = function (elm) {
            // create the div element that will hold the context menu
            d3.select(elm)
                .selectAll('.contextMenu')
                .data([1])
                .enter()
                .append('div')
                .attr('class', 'contextMenu')
                .on('click', function () {
                    d3.select('.contextMenu').style('display', 'none');
                });

        };

        var show = function (elm, scope, cb) {
            d3.selectAll('.contextMenu').html('');
            var list = d3.selectAll('.contextMenu').append('ul');

            list.selectAll('li')
                .data(content(elm))
                .enter()
                .append('li')
                .html(function (d) {
                    return d.title;
                })
                .on('click', function (d) {
                    d.action(elm, scope);
                    d3.select('.contextMenu').style('display', 'none');
                });

            // the callback allows an action to fire before the menu is displayed
            // an example usage would be closing a tooltip
            if (cb) {
                cb();
            }

            // display context menu
            d3.select('.contextMenu')
                .style('left', (d3.event.pageX - 50) + 'px')
                .style('top', (d3.event.pageY - 10) + 'px')
                .style('display', 'block');

            d3.event.preventDefault();
            d3.event.stopPropagation();
        };

        // return module
        return {
            show: show,
            init: init
        };
    }
);
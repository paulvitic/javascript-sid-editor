define(['d3'], function (d3) {
    // TODO try with closure. Instantiate a new function at directive by passing the scope.
    // TODO In this way scope will be available to makeEditable (closure)
    // TODO then use call(thisNewFunction, arguments);
    function editableText(scope){

        function makeEditable(d, field) {
            //console.log("makeEditable", arguments);
            this.on("mouseover", function () {
                    d3.select(this).style("fill", "red");
                })
                .on("mouseout", function () {
                    d3.select(this).style("fill", null);
                })
                .on("click", function (d) {
                        var p = this.parentNode;
                        //console.log(this, arguments);

                        // inject a HTML form to edit the content here...

                        // bug in the getBBox logic here, but don't know what I've done wrong here;
                        // anyhow, the coordinates are completely off & wrong. :-((
                        var xy = this.getBBox();

                        var el = d3.select(this);
                        var p_el = d3.select(p);

                        var frm = p_el.append("foreignObject");

                        var inp = frm
                            .attr("x", xy.x - 20)
                            .attr("y", xy.y - 20)
                            .attr("width", 300)
                            .attr("height", 25)
                            .append("xhtml:form")
                            .append("input")
                            .attr("value", function () {
                                // nasty spot to place this call, but here we are sure that the <input> tag is available
                                // and is handily pointed at by 'this':
                                this.focus();

                                //return d[field];
                                return '';
                            })
                            .attr("style", "width: 294px;")
                            // make the form go away when you jump out (form looses focus) or hit ENTER:
                            .on("blur", function () {
                                //console.log("blur", this, arguments);
                                scope.$apply(function(){
                                    scope.model[field] = inp.node().value;
                                });

                                // Note to self: frm.remove() will remove the entire <g> group! Remember the D3 selection logic!
                                p_el.select("foreignObject").remove();
                            })
                            .on("keypress", function () {
                                    //console.log("keypress", this, arguments);

                                    // IE fix
                                    if (!d3.event)
                                        d3.event = window.event;

                                    var e = d3.event;
                                    if (e.keyCode == 13) {
                                        if (typeof(e.cancelBubble) !== 'undefined') // IE
                                            e.cancelBubble = true;
                                        if (e.stopPropagation)
                                            e.stopPropagation();
                                        e.preventDefault();

                                        scope.$apply(function(){
                                            scope.model[field] = inp.node().value;
                                        });

                                        // odd. Should work in Safari, but the debugger crashes on this instead.
                                        // Anyway, it SHOULD be here and it doesn't hurt otherwise.
                                        p_el.select("foreignObject").remove();
                                    }
                                }
                            );
                    }
                );
        }
        return makeEditable;
    }

    return editableText;

});
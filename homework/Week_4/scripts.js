

d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement); 

    // var colors = ["#ccece6","#99d8c9",’#66c2a4’,’#41ae76’,’#238b45’,’#005824’]   

    var x = d3.select("#kleur1")
    .attr("x")

    var y = d3.select("#kleur2")
    .attr("y") - d3.select("#kleur1")
    .attr("y")

    var width = d3.select("#kleur1")
    .attr("width")

    var height = d3.select("#kleur1")
    .attr("height")

    // var test = d3.select(".st1")[0];

    // console.log(test);

    // var canvas = d3.select("#canvas")
    // .append("rect")
    // .attr("x", );

    var canvas = d3.select("svg")
	    .append("rect")
	    .attr("class", "st1")
	    .attr("x", x)
	    .attr("y", (y * 3))
	    .attr("width", width)
	    .attr("height", height)

    var canvas = d3.select("svg")
        .append("rect")
        .attr("class", "st1")
        .attr("x", x)
        .attr("y", (y * 4))
        .attr("width", width)
        .attr("height", height)

    var canvas = d3.select("svg")
        .append("rect")
        .attr("class", "st1")
        .attr("x", x)
        .attr("y", (y * 5))
        .attr("width", width)
        .attr("height", height)

    var canvas = d3.select("svg")
        .append("rect")
        .attr("class", "st1")
        .attr("x", x)
        .attr("y", (y * 6))
        .attr("width", width)
        .attr("height", height)

    // color.selectAll(".st1")
    // 	.data(colors)
    // 	.enter().appendChild()

});
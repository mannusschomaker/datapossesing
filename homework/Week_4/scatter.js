/* scripts.js
 * minor programeren
 *
 * d3.js page for interactive bar graph
 * interactive bar chart
 * graph is interactive: info popup when hovering over bars
 * door: mannus schomaker 10591664
 * 
 */

// global variables
var x, y;
var contenets = ["Azia", "Zuid-America", "Africa", "America", "Rusia", "Europe"]

// initiating padding and size of graph
var margin = {top: 80, right: 80, bottom: 80, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// load json file and execute function graph
d3.json("data.json", function (error, data) {
    if(error) throw error;
    graph(data)
});

// funtion for a dynamic bar chart
function graph(data){

    //formatting data
    data.forEach(function(d) {
        d.airline = d.airline
        d.dataX = +d.incidents_85_99
        d.dataSize = +d.fatal_accidents_85_99
        d.dataY = +d.fatalities_85_99
        d.dataXNew = +d.incidents_00_14
        d.datayNew = +d.fatalities_00_14
        d.dataSizeNew = +d.fatal_accidents_00_14
        console.log(typeof(d.country))


    });



    // create function for rescaling data to to fit x axis
    x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.dataX; })])
        .range([ 0, width ]);

    // create function for rescaling data to to fit y axis
    y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.dataY; })]).nice();

    // initiate and place xaxis 
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")

    // initiate and place xaxis 
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width)

    // initiate info window
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<span style='color:white'>" + d.airline + "</span>"
        })

    // initiate color sheme
    var color = d3.scale.category10(data.length);


    // make graph canvas
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(tip)


    // draw name x as 
    chart.append("text")
        .attr("class", "xtext")
        .attr("x", width/2 - margin.left)
        .attr("y", - 30)
        .attr("text-anchor", "middle")
        .text("Airline problems grouped by company and continent")



    // draw x axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append("text")
        .attr("y", 30)
        .attr("x", width)
        .style("text-anchor", "end")
        .text("Incidents")
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dy", ".8em")
        .attr("x", 5)



    // draw y axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Fatalities")

    
    // draw old data dots
    chart.selectAll("circle")
        .data(data)
        .enter().append("svg:circle")
        .attr("class", function (d,i) { return "dot" + i} )
        .attr("id", function (d,i) { return "oldPointdot" + i} )
        .attr("cx", function (d,i) { return x(d.dataX); } )
        .attr("cy", function (d) { return y(d.dataY); } )
        .attr("r", function (d) { return 7 + (d.dataSize * 4); })
        .style("opacity", 0.6)
        .style("fill", function(d) { return color(d.country); })
        .on('mouseover', function(d){
            tip.show(d);
            d3.selectAll("circle")
                .transition()
                .style("opacity", 0.15)
                .style("fill", "gray")
            d3.selectAll('.' + d3.select(this).attr('class'))
                .attr("r", function (d) { return (10 + d.dataSize * 4); })
                .style("fill", function(d) { return color(d.country); })
                .transition()
                .style("opacity", 0.8)
            d3.select('#' + "newPoint" + d3.select(this).attr('class'))
                .attr("r", function (d) { return (10 + d.dataSizeNew * 4); })
        })

        .on('mouseout', function(d){
            tip.hide(d)
            d3.selectAll("circle")
                .style("opacity", 0.6)
                .style("fill", function(d) { return color(d.country); })
            d3.selectAll('.' + d3.select(this).attr('class'))
                .attr("r", function (d) { return 7 + (d.dataSize * 4); })
            d3.select('#' + "newPoint" + d3.select(this).attr('class'))
                .attr("r", function (d) { return 7 + (d.dataSizeNew * 4); })
        })


    // draw new data dots
    chart.selectAll("new")
        .data(data)
        .enter().append("svg:circle")
        .attr("class", function (d,i) { console.log( "dot" + i);return "dot" + i} )
        .attr("id", function (d,i) { return "newPointdot" + i} )
        .attr("cx", function (d,i) { return x(d.dataXNew); } )
        .attr("cy", function (d) { return y(d.datayNew); } )
        .attr("r", function (d) { return 7 + (d.dataSizeNew * 4); })
        .style("opacity", 0.6)
        .style("fill", function(d) { return color(d.country); })
        .style("stroke-width", "2px")
        .style("stroke", "black")
        .on('mouseover', function(d){
            tip.show(d);
            chart.selectAll("circle")
                .style("opacity", 0.15)
                .style("fill", "gray")
            d3.selectAll('.' + d3.select(this).attr('class'))
                .style("fill", function(d) { return color(d.country); })
                .style("opacity", 0.8)
                .attr("r", function (d) { return (10 + d.dataSizeNew * 4); })
            d3.select('#' + "oldPoint" + d3.select(this).attr('class'))
                .attr("r", function (d) { return (10 + d.dataSize * 4); })

        })

        .on('mouseout', function(d){
            tip.hide(d)
            chart.selectAll("circle")
                .style("opacity", 0.6)
                .style("fill", function(d) { return color(d.country); })
            d3.selectAll('.' + d3.select(this).attr('class'))
                .attr("r", function (d) { return 7 + (d.dataSizeNew * 4); })
            d3.select('#' + "oldPoint" + d3.select(this).attr('class'))
                .attr("r", function (d) { return 7 + (d.dataSize * 4); })
        })

        // start legend 
        var legend = chart.selectAll(".legend")
            .data(color.domain())
        .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; });


        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 80)
            .attr("width", 100)
            .attr("height", 18)
            .style("fill", color)
            .style("opacity", .8)


        // append text
        legend.append("text")
            .attr("x", width + 20)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("font", "15px sans-serif")
            .text(function(d,i) { console.log(contenets[i]); return contenets[i]})

        // start circle size legend 
        var cir = chart.append("g")

        // max diameter
        cir.append("rect")
            .attr("x", width - 80)
            .attr("y", 160)
            .attr("width", (7 + (d3.max(data, function(d) { return d.dataSize; }) * 4) * 2))
            .attr("height", 5)
            .style("fill", "black")
        cir.append("text")
            .attr("class", ".axis")
            .text("maximal diameter = " + d3.max(data, function(d) { return d.dataSize; }))
            .style("font", "10px sans-serif")
            .attr("x", width - 80)
            .attr("y", 180)

        // title legenda pont diameter
        cir.append("text")
            .text("size of circle equales number of fatal accidents")
            .style("font", "10px sans-serif")
            .attr("x", width - 150)
            .attr("y", 150)

        // min diameter
        cir.append("rect")
            .attr("x", width - 80)
            .attr("y", 200)
            .attr("width", (7 + (d3.min(data, function(d) { return d.dataSize; }) * 4) * 2))
            .attr("height", 5)
            .style("fill", "black")
        cir.append("text")
            .text("minimal diameter =  " + d3.min(data, function(d) { return d.dataSize; }))
            .style("font", "10px sans-serif")
            .attr("x", width - 80)
            .attr("y", 220)

        //  circle border explenation
        chart.append("text")
            .attr("class", ".axis")
            .attr("x", width/2 - margin.left)
            .attr("y", height + 30)
            .attr("text-anchor", "middle")
            .text("data from 1985 til 1999 circles without border --- data form 2000 til 2014 with border")

}




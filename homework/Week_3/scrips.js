/* scripts.js
 * minor programeren
 *
 * d3.js page for interactive bar graph
 * interactive bar chart
 * graph is interactive: info popup when hovering over bars
 * door: mannus schomaker 10591664
 * 
 */

// load json file and execute function graph
d3.json("file.json", function(data) {
    graph(data)
});

// funtion for a dynamic bar chart
function graph(data){

    // formatting data
    data.forEach(function(d) {
        d.maxTemp = +d.maxTemp / 10
        d.date = formatdate(d.date)
    });



    // initiating padding and size of graph
    var margin = {top: 20, right: 0, bottom: 80, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    // create function for rescaling data to to fit x axis
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .05)
        .domain(data.map(function(d) { return d.date; }));

    // create function for rescaling data to to fit y axis
    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.maxTemp; })]);

    // initiate and place xaxis 
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.days,1);

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
            return "<span style='color:white'>" + "temp: " + d.maxTemp + "\u2103  " + "date: " + d.date +"</span>"
        })

    // make graph canvas
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(tip)

    // draw title graph 
    chart.append("text")
        .attr("class", "titletext")
        .attr("x", width/2 - margin.left)
        .attr("text-anchor", "middle")
        .text("temperature in \u2103 for all days of january 2014")

    // draw name x as 
    chart.append("text")
        .attr("class", "xtext")
        .attr("x", width/2 - margin.left)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("Days in january")

    // draw x axis
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dy", ".8em")
        .attr("transform", "rotate(-25)" )

    // draw y axis
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("temprature in \u2103")

        // make higher y axis lines more visuble than the lower ones
        d3.selectAll("g.y.axis g.tick line")
            .attr("opacity", function(d, i){ return ((i + 5) * .03) })

    // draw bars that represent temp. per day
    var bars = chart.selectAll("bar")
        .data(data)
    .enter().append("rect")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.rangeBand())
        .attr("y", height)
        .attr("rx",3)
        .attr("height", 0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

        //  make bars rise fom the bottum
        bars.transition().duration(500)
        .attr("height", function(d) { return height - y(d.maxTemp); })
        .attr("y", function(d) { return y(d.maxTemp); })
} 

// 
function formatdate(current_date){
    return current_date.slice(6, 8)
}


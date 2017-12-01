/* scripts.js
 * minor programeren
 *
 * d3.js page for interactive bar graph
 * interactive bar chart
 * graph is interactive: info popup when hovering over bars
 * door: mannus schomaker 10591664
 * 
 */


// initiating padding and size of graph
var margin = {top: 80, right: 80, bottom: 80, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = 0
var y = 0

// load json file and execute function graph
d3.json("min.json", function (error, data) {
    if(error) throw error;

    // go to make variables
    valueMin(data)
});

// load json file and execute function graph
function updateMin(){
  d3.json("min.json", function (error, data) {
      if(error) throw error;

      // go to make variables
      valueMin(data)
  });
}

// load json file and execute function graph
function updateMax(){
  d3.json("max.json", function (error, data) {
      if(error) throw error;

      // go to make variables
      valueMax(data)
  });
}

// initialize variables min
function valueMin(data){
  d3.select("svg").remove()
  var parseTime = d3.timeParse("%Y-%m-%d");

      data.forEach(function(d) {
      d.actual_max_temp = +d.actual_max_temp
      d.record_max_temp = +d.record_max_temp
      d.average_max_temp = +d.average_max_temp 
      d.date = parseTime(d.date)

        x = d3.scaleTime().rangeRound([0, width])
        y = d3.scaleLinear().rangeRound([height, 0])

        x.domain(d3.extent(data, function(d) { return d.date; })).nice();
        y.domain([d3.min(data, function(d) { return d.record_max_temp; }),
            d3.max(data, function(d) { return d.actual_max_temp; })]);

    });
  graph(data, x, y)
}

// initialize variables max
function valueMax(data){
  d3.select("svg").remove()
  var parseTime = d3.timeParse("%Y-%m-%d");

      data.forEach(function(d) {
      d.actual_max_temp = +d.actual_max_temp
      d.record_max_temp = +d.record_max_temp
      d.average_max_temp = +d.average_max_temp 
      d.date = parseTime(d.date)

        x = d3.scaleTime().rangeRound([0, width])
        y = d3.scaleLinear().rangeRound([height, 0])

        x.domain(d3.extent(data, function(d) { return d.date; })).nice();
        y.domain([d3.min(data, function(d) { return d.actual_max_temp; }),
            d3.max(data, function(d) { return d.record_max_temp; })]);

    });
  graph(data, x, y)
}



// funtion for a dynamic bar chart
function graph(data, x, y){

  // make canvas
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // make x axis
  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "#000")
      .call(d3.axisBottom(x));

  // make y axis
  svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", - 40)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºF");


// scale function for line 1
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.actual_max_temp); });

// scale function for line 2
var line2 = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.record_max_temp); });

// scale function for line 3
var line3 = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average_max_temp); });

  // path line 1
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .style("stroke", "steelblue");

  // path line 2
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line2)
      .style("stroke", "brown");

  // path line 3
  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line3)
      .style("stroke", "black");

  // initiate for mouse over
  var bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function(d) { return formatValue(d); };

  // line 1 mouse over 
  var focus1 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
  focus1.append("circle")
      .attr("r", 4.5);
  focus1.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  // line 2 mouse over 
  var focus2 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
  focus2.append("circle")
      .attr("r", 4.5);
  focus2.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  // line 3 mouse over 
  var focus3 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");
  focus3.append("circle")
      .attr("r", 4.5);
  focus3.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  // create invisible feld to measeure mouse movement
  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
               focus3.style("display", null); 
               focus2.style("display", null);
               focus1.style("display", null);
             })
      .on("mouseout", function() { 
              focus3.style("display", "none"); 
              focus2.style("display", "none"); 
              focus1.style("display", "none"); 
            })
      .on("mousemove", mousemove);

  // mouse over function
  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus1.attr("transform", "translate(" + x(d.date) + "," + y(d.average_max_temp) + ")");
    focus1.select("text").text(formatCurrency(d.average_max_temp));
    focus2.attr("transform", "translate(" + x(d.date) + "," + y(d.actual_max_temp) + ")");
    focus2.select("text").text(formatCurrency(d.actual_max_temp));
    focus3.attr("transform", "translate(" + x(d.date) + "," + y(d.record_max_temp) + ")");
    focus3.select("text").text(formatCurrency(d.record_max_temp));

  }

  // legend for variables
  svg.append("text")
      .attr("x", width/2)
      .attr("y", -10)
      .attr("fill", "steelblue")
      .attr("text-anchor", "middle")
      .text("actual Temperature")
  svg.append("text")
      .attr("x", width/2 - 200)
      .attr("y", -10)
      .attr("fill", "brown")
      .attr("text-anchor", "middle")
      .text("recorded Temperature")
  svg.append("text")
      .attr("x", width/2 + 200)
      .attr("y", -10)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("average Temperature")

  // main header
  svg.append("text")
      .attr("class", "hooft")
      .attr("x", width/2)
      .attr("y", - 30)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("different measurements of temperature in 2016")
}


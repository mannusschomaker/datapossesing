/* scripts.js
 * minor programeren
 *
 * d3.js page for interactive bar graph
 * interactive bar chart
 * graph is interactive: info popup when hovering over bars
 * door: mannus schomaker 10591664
 * 
 */

// dit heb geprobeerd de id nummers te fixen maar ze komen nergens overeen
d3.csv("configure.csv", function(error, data){
  dict = {}
  // console.log(data)
  data.forEach(function(d,i){ dict[d.countryCode] =  d.num })
  // console.log(dict)
  dictkeys = Object.keys(dict)
  // console.log(dictkeys)
  // console.log(dict[30])
})

var format = d3.format(",");

//Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {

               return "<strong>Country: </strong><span class='details'>" + d.id + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(["rgb(48, 192, 51)", "rgb(69, 174, 51)", "rgb(90, 156, 51)", "rgb(112, 138, 52)", "rgb(133, 120, 52)", "rgb(155, 102, 52)","rgb(176, 84, 53)","rgb(198, 66, 53)","rgb(219, 48, 53)","rgb(241, 30, 54)"]);

// const color = d3.scaleQuantile()
//   .range([
//     'rgb(247,251,255)',
//     'rgb(222,235,247)', 
//     'rgb(198,219,239)', 
//     'rgb(158,202,225)',
//     'rgb(107,174,214)',
//     'rgb(66,146,198)',
//     'rgb(33,113,181)',
//     'rgb(8,81,156)',
//     'rgb(8,48,107)',
//     'rgb(3,19,43)'
//   ]);

// path builder
var path = d3.geoPath();

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);
var path = d3.geoPath().projection(projection);

// add tool tip
svg.call(tip);

// loading data
queue()
    .defer(d3.json, "world_countries.json")
    .defer(d3.tsv, "happy.tsv")
    .await(ready);

// function builds wold map
function ready(error, data, population) {

  // typing variables and connecting data files
  var populationById = {};
  population.forEach(function(d) { 
    d.id = dict[d.Country];
    // console.log(d);
    populationById[d.id] = +d.Population; 
  });
  data.features.forEach(function(d) {  
    // console.log(population[d.id], d.id);
    if(populationById[d.id]){
       d.population = populationById[d.id];
       // console.log( d.population)
    } 
    // else {
    //    d[d.id] = "xxx";
    //    d.population = 1;
    // }
  })

   
  // console.log(populationById)
  
  // making countries on the map
 svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("class", function(d) { return d.id + " Land"; })
      .attr("d", path)
      .style("fill", function(d) { return color(d.population); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        })

  // draw country borders
  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);

      makeBarChart(population);
}


// function to make bar chart
function makeBarChart(data){
  type(data)
  // console.log(data)
    // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    // make svg to hold bar graph
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");


  // set ranges and domains
  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);

  x.domain(data.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(data, function(d) { return d.LifeExpectancy; })]);

  // create bars
  svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", function(d) { return d.id+" bar"; })
    .attr("x", function(d) { return x(d.Country); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.LifeExpectancy); })
    .attr("height", function(d) { return height - y(d.LifeExpectancy); });

  // on click event for countries to update bar graph
  d3.selectAll(".Land")
    .on("click", function (){
      // console.log(this)
      t = d3.select(this).attr("class").split(" ")[0]
      // console.log(d3.select("." + t + ".bar"))
      data.map(function(d) { if(d.id == t){
        dt = d; 
        return dt}})

        updateBar(dt)
    })

}
// function to update bar graph
function updateBar(dt){

  // experimentje
  var keys = Object.keys(dt)
    var newbars = d3.selectAll(".bar").data(console.log([dt].forEach(function(d){keys.map(function(key){ return { key: key, value: d[key]} })})))
    console.log(dt)
  console.log(keys)
  console.log(dt.length)

  // nieuw domain
  x.domain(data.map(dt.length) );
  y.domain([0, d3.max(data, function(d) { return d.LifeExpectancy; })]);
  
  // set nieuw data
  var bars = chart.selectAll(".bar")
          .remove()
          .exit()
          .data(data)   
  // create nieuw bars
  bars.append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i){ return barWidth + 1 })
    .attr("y", function(d){ return y( d.LifeExpectancy); })
    .attr("height", function(d){ return height - y(d.LifeExpectancy); })
    .attr("width", barWidth - 1)
  bars.append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i){ return barWidth + 1 })
    .attr("y", function(d){ return yChart( d.happyLifeYears); })
    .attr("height", function(d){ return height - yChart(d.happyLifeYears); })
    .attr("width", barWidth - 1)

}

// reformat data
function type(data){
  data.forEach(function(d) {
d.Footprint = +d.Footprint
d.GDP = +d.GDP
d.happyLifeYears = +d.happyLifeYears
d.happyPlanetIndex = +d.happyPlanetIndex
d.Inequality = +d.Inequality
d.LifeExpectancy= +d.LifeExpectancy
d.Population = +d.Population
})
return data
}
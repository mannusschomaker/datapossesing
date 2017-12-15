/* scripts.js
 * minor programeren
 *
 * d3.js page for interactive bar graph
 * interactive bar chart
 * graph is interactive: info popup when hovering over bars
 * door: mannus schomaker 10591664
 * 
 */


//Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([150, -150])
            .html(function(d) {

               return "<strong>Country: </strong><span class='details'>" + d.id + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 80, left: 60},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var color = d3.scaleThreshold()
    .domain([2,10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(['white','#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704']);


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

svg.append("text")
  .attr("id","title")
  .attr("x", 140)
  .attr("y", 20)
  .text("wold map viewing population of countries grouped by color");

// add tool tip
svg.call(tip);

// loading data
queue()
    .defer(d3.json, "world_countries.json")
    .defer(d3.tsv, "happy.tsv")
    .defer(d3.csv, "configure.csv")
    .await(ready);

// function builds wold map
function ready(error, data, population, configure) {

  dict = {}
  console.log(configure)
  configure.forEach(function(d,i){ dict[d.countryCode] =  d.num })
  // console.log(dict)
  dictkeys = Object.keys(dict)
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
    else {

       d.population = 1;
    }
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

var x = d3.scaleBand()
  .range([0, width])
  .padding(0.1);
var y = d3.scaleLinear()
  .range([height, 0]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

// function to make bar chart
function makeBarChart(data){
  type(data)
  // console.log(data)
    // set the dimensions and margins of the graph
  var margin = {top: 0, right: 20, bottom: 80, left: 60},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // make svg to hold bar graph
  var svg = d3.select("body")
      .append("svg")
      .attr("id", "barchart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id" , "test")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");


  // set domains
  x.domain(data.map(function(d) { return d.Country; }));
  y.domain([0, d3.max(data, function(d) { return d.LifeExpectancy; })]);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  
  //bottom axis
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d){
      return "rotate(-90)";
    });
  // create bars
  svg.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", function(d) { return d.id+" bar"; })
    .attr("x", function(d) { return x(d.Country); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.LifeExpectancy); })
    .attr("height", function(d) { return height - y(d.LifeExpectancy); });

  
  svg.append("text")
    .attr("transform", "translate(-35," +  (height+margin.bottom)/2 + ") rotate(-90)")
    .text("happy planet index");
      
  svg.append("text")
    .attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom - 5) + ")")
    .text("meseurments");
  

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
  keys =  ["happyLifeYears", "Footprint", "Inequality", "LifeExpectancy", "Wellbeing", "happyPlanetIndex", ""]

  var dataSetTest = [];
  var keysTest = [];
  for (var i  = 0; i < keys.length; i++){
    var curKey = keys[i];
    if (!isNaN(dt[curKey])) {
      var testObj = {};
      // testObj[curKey] = dt[curKey];
      testObj['data'] = dt[curKey];
      dataSetTest.push(testObj);
    }
  }

  // nieuw domain
  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  var y = d3.scaleLinear()
    .range([height, 0]);

    x.domain(keys);
  y.domain([0, d3.max(dataSetTest, function(d) { return d.data; })]);
  
  var barWidth = width / keys.length;
  // set nieuw data
  var bars = d3.selectAll(".bar")
          .remove()
          .exit()
          .data(dataSetTest);
  var svg =d3.select('#test')
  console.log(height)
  svg.selectAll(".bar")
  .data(dataSetTest).enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d, i){ return i * barWidth + 1 })
  .attr("y", function(d){ return y( d.data); })
  .attr("height", function(d){ return height - y(d.data); })
  .attr("width", barWidth - 1)
  .style("fill", "brown")

  //left axis
	svg.select('.y')
  .call(d3.axisLeft(y))
  //bottom axis
  svg.select('.xAxis').remove()
  svg.append("g")
    .data(keys)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middel")
    .attr("dy", "10")
    .attr("transform", function(d){
    return "rotate(360)";
  });

}

// reformat data
function type(data){
  data.forEach(function(d) {
  d.Footprint = +d.Footprint
  d.GDP = +d.GDP
  d.happyLifeYears = +d.happyLifeYears.slice(0, 2)
  d.happyPlanetIndex = +d.happyPlanetIndex.slice(0, 2)
  d.Inequality = +d.Inequality
  d.Wellbeing = +d.Wellbeing
  d.LifeExpectancy= +d.LifeExpectancy.slice(0, 2)
  d.Population = +d.Population.slice(0, 2)
  })
return data
}
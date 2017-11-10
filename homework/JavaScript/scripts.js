/* scripts.js
 * minor programeren
 *
 * java page for for raw_data
 * graph is resizeable by changing the size of the graph
 * door: mannus schomaker 10591664
 * had no time to make a wel functioning button sorry
 */


 var sizeGraph = 400

//makes sure the data is reseved before moving on to next function
dataUpload('KNMI_20171105.txt', function (text) {
	//things to do with text
	formatData(text)
})


// reseve data and send it as callback
function dataUpload(file, callback) {
	var xmlhttp = new XMLHttpRequest()

	// give callback when data is reseved
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			callback(this.responseText)	
		}
	}
	xmlhttp.open("GET", file, true)
	xmlhttp.send()
}


// data formating to to use in graph
function formatData(text){

	// spilt string at enter
	var x = []
	x = text.split("\n")

	var dataTemp = []
	var dataDates = []

	// split at "," and create two arrays for temp and dates 
	for (i = 0; i < x.length - 1; i++) { 
		if (x[i].startsWith("#") != true){
	    x[i] = x[i].split(",")
	    x[i][0].replace(/ /g, "")
	    dataDates.push(new Date(x[i][0].slice(0, 4) + 
		    	"-" + x[i][0].slice(4, 6) +
		    	"-" + x[i][0].slice(6, 8)))
	    dataTemp.push(Number(x[i][1]))
		}
	}
	// draw graph
	createGraph(dataTemp)
	
}

function createGraph(dataTemp){
	// initiate canvas
	var canvas = document.getElementById("grafiek");
	var g = canvas.getContext("2d")
	var width = canvas.width = 2 * sizeGraph
	var height = canvas.height = sizeGraph

	// initiate padding 
	var spaceForAxis = sizeGraph / 100
	yMinimalSpace = height - (height / spaceForAxis)
	xMinimalSpace = (width / (2 * spaceForAxis))


	// rescale data to x and y axsis parameters
	var createY = createTransform([-50 , 300], 
			[yMinimalSpace, height / spaceForAxis])
	var createX = createTransform([0,365],[xMinimalSpace,width])

	// draw data line
	g.beginPath()
	g.moveTo(createX(0), createY(dataTemp[0]))
	for (i = 1; i < dataTemp.length - 1; i++){
		g.lineTo(createX(i), createY(dataTemp[i]))
	}
	g.stroke()

	// draw name of graph
	g.font = "20px Arial"
	g.textAlign = "center"
	g.fillText("Average temp at the bilt last year", width / 2, height / spaceForAxis)

	// initiate x ax
	months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
	oneStepX = (width - xMinimalSpace) / 11

	// draw name x and yaxsis
	g.strokeStyle = "#9c9c9b"
	g.font = "15px Arial"
	g.fillText("months", (width + xMinimalSpace) / 2, 
			yMinimalSpace + (height / 60) * 6)
	writeSkewed(g, "temperature in \u2103", 
			xMinimalSpace - (height / 60) * 4,
			yMinimalSpace - height / spaceForAxis, 2)

	// draw x axsis
	g.beginPath()
	g.moveTo(xMinimalSpace, yMinimalSpace)
	for (i = 0; i < 12; i++){
		g.lineTo(xMinimalSpace + oneStepX * i, yMinimalSpace)
		g.lineTo(xMinimalSpace + oneStepX * i, yMinimalSpace + height / 60)
		g.moveTo(xMinimalSpace + oneStepX * i, yMinimalSpace)
		writeSkewed(g, months[i], (xMinimalSpace + oneStepX * i), (yMinimalSpace + (height / 60) * 3), 4)
	}

	// initiate and draw y axsis
	oneStepY = (height / spaceForAxis - yMinimalSpace) / 7
	g.moveTo(xMinimalSpace, yMinimalSpace)
	for (i = 0; i < 8; i++){
		g.lineTo(xMinimalSpace, yMinimalSpace + oneStepY * i)
		g.lineTo(xMinimalSpace - height / 60, yMinimalSpace + oneStepY * i)
		g.moveTo(xMinimalSpace, yMinimalSpace + oneStepY * i)
		g.fillText((- 5 + 5 * i), xMinimalSpace - (height / 60 * 3), yMinimalSpace + oneStepY * i + height / 90)
	}
	g.stroke()

}

function createTransform(domain, range){
    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta
    }
}

// function ratates the canvas write text and restores the canvas
function writeSkewed(g, month, xAxis, yAxis, rot){
	g.save();
	g.translate(xAxis, yAxis);
	g.rotate(-Math.PI / rot);
	g.fillText(month, -10, -10)
	g.restore();

}

// resize example big
function big() {
    sizeGraph = sizeGraph + 100
    dataUpload('KNMI_20171105.txt', function (text) {
	//things to do with text
	formatData(text)
})
}

// resize example small
function small() {
    sizeGraph = sizeGraph - 100
    if (sizeGraph < 400){
    	sizeGraph = 400
    }
    dataUpload('KNMI_20171105.txt', function (text) {
	//things to do with text
	formatData(text)
})
}





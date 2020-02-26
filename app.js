
//var response_data = JSON.parse('{{ response | tojson | safe }}');
//var part_liv = response_data.particulares_livianos

x = document.getElementsByClassName("filterDiv");



var name = "show"

var arr2 = name.split(" ")

var arr1 = x[0].className.split(" ")

var arr1_joined = arr1.join(" ")

x[0].className += " " + "show"



var particulares_livianos = response_data.particulares_livianos
var taxis = response_data.taxis
var motos = response_data.motos
var preventivas_livianos = response_data.preventivas_livianos

//console.log("taxis", taxis)


var part_liv_2016 = particulares_livianos.filter(x => { return x.anio === 2016 })
var part_liv_2017 = particulares_livianos.filter(x => { return x.anio === 2017 })
var part_liv_2018 = particulares_livianos.filter(x => { return x.anio === 2018 })
var part_liv_2019 = particulares_livianos.filter(x => { return x.anio === 2019 })
var part_liv_2020 = particulares_livianos.filter(x => { return x.anio === 2020 })

var all_products = { particulares: { particulares_livianos }, taxis: { taxis } }

var all_products_ = [{ particulares_livianos }, { taxis }, { motos }, { preventivas_livianos }]

//console.log(all_products_)
//console.log("keys", Object.keys(all_products_))
//console.log("keys", all_products_.map(x => Object.keys(x)))
//console.log("1", all_products)



//const raw = {
//    item1: { key: 'sdfd', value: 'sdfd' },
//    item2: { key: 'sdfd', value: 'sdfd' },
//    item3: { key: 'sdfd', value: 'sdfd' }
//};

//const allowed = ['item1', 'item3'];

//const filtered = Object.keys(raw)
//    .filter(key => allowed.includes(key))
//    .reduce((obj, key) => {
//        obj[key] = raw[key];
//        return obj;
//    }, {});







//BarChart:

// ----- svg dimensions, x and y scales and axes ----- // :


var svg = d3.select("#ordinal_demo")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 950)


var x = d3.scaleBand()
    .domain(["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"])
    .range([50, 700])
    .padding([0.3])

var y = d3.scaleLinear()
    .range([700, 0])
    .domain([0, d3.max(part_liv_2019, function (d) { return d.total }) + 200]);


svg.append("g")
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0,700)");


svg.append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate (50,10)");

var hover = function (d) {
    var div = document.getElementById('tooltip');
    div.style.left = event.pageX + 'px';
    div.style.top = event.pageY + 'px';
    div.innerHTML = d.total;
};



//----- changeProduct() filters the data data by product and year (depending on user input) and sends the data to the updateChart() function ----- //

function changeProduct() {

    var selected_product = document.getElementById("product").value;
    var product_filtered = Object.keys(all_products_)
        .filter(key => selected_product.includes(key))
        .reduce((obj, key) => {
            obj[key] = all_products_[key];
            return obj;
        }, {});

    var data_to_array = Object.values(product_filtered[selected_product])

    var selected_year = document.getElementById("sales_chart").value;
    var selected_year = +selected_year
    console.log(selected_year)
    var data_filtered_by_year = data_to_array.map(x => x.filter(function (element) { return element.anio === selected_year }))
    console.log("data_filtered_by_year", data_filtered_by_year)


    updateChart(data_filtered_by_year)
}

//----- updateChart() function will plot the filered data // : 

function updateChart(data) {


    var selected_year = document.getElementById("sales_chart").value;

    var data_filtered_by_year = data.map(x => x.filter(function (element) { return element.anio == selected_year }))
    var data_filtered_by_year = data_filtered_by_year[0]

    console.log(data_filtered_by_year)

    var bars = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(data_filtered_by_year)

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.mes.trim()); })
        .attr("y", function (d) { return y(d.total); })
        .attr("height", function (d) { return 700 - y(d.total); })
        .attr("width", x.bandwidth())
        .style("fill", "red")
        .style("opacity", 0.7)
        .on("mouseover", hover);

}


// --------- end of BarChart --------- // 










//start of LineChart


var data_total = [part_liv_2016, part_liv_2017, part_liv_2018, part_liv_2019, part_liv_2020]
var total_all_years = data_total.map(x => x.map(w => w.total))
var min_total = d3.min(total_all_years.map(x => d3.min(x)))


var total_all_months = data_total.map(x => x.map(w => w.mes))


var colors = [
    'steelblue',
    'green',
    'red',
    'purple'
]


svgLinechart = d3.select("#lineChart")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 950)



//---
svgLinechart.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 1200)
    .attr("height", 950);
//---


var gLineChart = svgLinechart.append("g")
    .attr("transform", "translate(" + 40 + "," + 20 + ")")


// --- x scale --- //
var xScale = d3.scaleBand()
    .domain(["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"])
    .range([0, 1000])
    .padding([1]);


gLineChart.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", "translate(0," + 810 + ")")

// --------------- //


// --- y scale --- //
var yScale = d3.scaleLinear()
    .range([800, 0])
    .domain([min_total, d3.max(part_liv_2019, function (d) { return d.total }) + 200]);


gLineChart.append("g")
    .call(d3.axisLeft(yScale))
    .attr("transform", "translate (0,10)");

// --------------- //


var line = d3.line()
    .x(function (d) { return xScale(d.mes.trim()); })
    .y(function (d) { return yScale(d.total); })


// --------------- //


gLineChart.selectAll(".line")
    .data(data_total)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("clip-path", "url(#clip)")
    .attr("stroke", function (d, i) { return colors[i % colors.length]; })
    .attr("d", line)


// --------------- //

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .style("opacity", 0)
    .style("position", "absolute");


// --------------- //


var hover2 = function (d) {
    var div = document.getElementById('tooltip2');
    div.style.left = event.pageX + 'px';
    div.style.top = event.pageY + 'px';
    div.innerHTML = d.point.total;
};



// --------------- //

var points = gLineChart.selectAll('.dots')
    .data(data_total)  // < ---  inject the data
    .enter()
    .append("g")  // < --- append a "g" attribute
    .attr("class", "dots") // < ---  give that "g" attribute a class name "dots"
    .attr("clip-path", "url(#clip)");


points.selectAll('.dot')
    .data(function (d, index) { // < ---  d: the data (every object in the array), index: the index of every object in the awway
        var a = [];

        d.forEach(function (point, i) { // < ---  for each Point: every value in each object in the array
            a.push({ 'index': index, 'point': point }); // < ---  push to a the index of object in the array. Also push every value in each object in the array
        });
        return a; // < ---  a is every object in the array with an indez identifier.

    })

    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr("r", 2.5)
    .attr('fill', function (d, i) {
        return colors[d.index % colors.length];
    })
    .attr("transform", function (d) {
        return "translate(" + xScale(d.point.mes.trim()) + "," + yScale(d.point.total) + ")";
    }
    )
    .on('mouseover', hover2)



// --------------- //


gLineChart.append("text")
    .attr("transform", "translate(" + 930 + "," + yScale(data_total[0][11].total) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("2016");

gLineChart.append("text")
    .attr("transform", "translate(" + 930 + "," + yScale(data_total[1][11].total) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", 'green')
    .text("2017");


gLineChart.append("text")
    .attr("transform", "translate(" + 930 + "," + yScale(data_total[2][11].total) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", 'red')
    .text("2018");

gLineChart.append("text")
    .attr("transform", "translate(" + 930 + "," + yScale(data_total[3][11].total) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", 'purple')
    .text("2019");


// ------  End of Line Chart ------- //






// ------  Start Geo Chart Chart ------- //


var width = 1000;
var height = 530;
var db = d3.map();


var svg_map = d3.select("#map")
    .append("svg")
    .attr("id", "svgmap")
    .attr("width", width)
    .attr("height", height);

$(document).ready(function () {
    $.getJSON('/bogota_geojson', function (data, status, xhr) {

        console.log(data.features)

        var projection = d3.geoEquirectangular()
            .scale(400)
            .center([-3.0026, 16.7666])
            .translate([480, 250])
            .fitExtent([[0, 0], [1000, 530]], { type: "FeatureCollection", features: data.features })


        var geoGenerator = d3.geoPath()
            .projection(projection);

        var color = d3.scaleLinear()
            .domain([0, 38])
            .range(['grey']);

        var map = svg_map.append('g').attr('class', 'boundary');

        u = map.selectAll('path').data(data.features);

        var u = d3.select('#svgmap') //////////////////////////////////////////
            .selectAll('path')
            .data(data.features)

        u.enter()
            .append('path')
            .attr('d', geoGenerator)
            //.attr('fill', 'black')
            //.on("mouseover", hover)
            .attr('fill-opacity', 0.7)
            .attr('fill', function (d, i) { return color(i); });

        u.attr('fill', '#eee');
        u.exit().remove();




    })
})
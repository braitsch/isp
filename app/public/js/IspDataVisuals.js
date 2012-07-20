
var x = 0;
var chartX = 130;
var chartW = 800;
var chartH = 165;
var leading = 25;

var canvas = d3.select("#svg-cnt").append("svg:svg")
	.attr('viewBox', '0 0 0 0')
	.attr('preserveAspectRatio', 'xMidYMid')

$(window).on("resize", function() {
	computeWidth(); drawTicks();
});

var chart = canvas.append('svg:g')
	.attr('class', 'chart')
    .attr("transform", "translate("+chartX+", 30)");

var labels = canvas.append('svg:g')
	.attr('class', 'labels')
    .attr("transform", "translate("+(chartX - 10)+", 30)");

labels.selectAll('text')
	.data(isps)
	.enter().append("text")
	.attr("y",  function(d, i) { return i * leading})
	.attr("dy", "1.1em")
	.attr('text-anchor', 'end')
	.text(function(d) {return d.isp});

// ticks //

function computeWidth()
{
	var w = $('#svg-cnt').width();
	x = d3.scale.linear()
	.domain([0, 100])
	.range([0, w - chartX - 40]);
}

function drawTicks()
{
	chart.selectAll("line").remove();
	chart.selectAll("line")
		.data(x.ticks(10))
		.enter().append("line")
			.attr("x1", x)
			.attr("x2", x)
			.attr("y1", 0)
			.attr("y2", chartH)
			.style("stroke", "#ccc");

	chart.selectAll(".rule").remove();
	chart.selectAll(".rule")
		.data(x.ticks(10))
		.enter().append("text")
			.attr("class", "rule")
			.attr("x", x)
			.attr("y", 0)
			.attr("dx", 4)
			.attr("dy", -8)
			.attr("text-anchor", "middle")
			.text(function (d){ return d + '%'});
}

computeWidth(); drawTicks();

// bars //
chart.selectAll("rect")
	.data(isps)
	.enter().append("rect")
	.attr("y",  function(d, i) { return i * leading})
	.attr("width", function(d, i) { return (d.online + d.offline) * 25 })
	.attr("height", 15);
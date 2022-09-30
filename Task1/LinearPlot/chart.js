async function buildPlot() {

    const data = await d3.json("my_weather_data.json");

    const dateParser = d3.timeParse("%Y-%m-%d");
    const yMin = (d) => d.temperatureMin;
    const yMax = (d) => d.temperatureHigh;


    const xAccessor = (d) => dateParser(d.date);


    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yTLScaler = d3.scaleLinear()
        .domain(d3.extent(data,yMin))
        .range([dimension.boundedHeight, 50]);

    const yTHScaler = d3.scaleLinear()
        .domain(d3.extent(data,yMax))
        .range([dimension.boundedHeight, 50]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineMinGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTLScaler(yMin(d)));

    var lineMaxGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yTHScaler(yMax(d)));

    bounded.append("path")
        .attr("d",lineMinGenerator(data))
        .attr("fill","none")
        .attr("stroke","blue")
        .attr("transform","translate(120, 10)")
        .attr("stroke-linecap","round")
    bounded.append("path")
        .attr("d",lineMaxGenerator(data))
        .attr("fill","none")
        .attr("stroke","red")
        .attr("transform","translate(120, 10)")
        .attr("stroke-linecap","round")

    var x_axis = d3.axisBottom()
        .scale(xScaler);

    var y_axis = d3.axisLeft()
        .scale(yTLScaler);
    y_axis.tickFormat( (d,i) => d + "F")

    const adjust = dimension.boundedHeight + 10
    bounded.append("g")
        .attr("transform", "translate(120, " + adjust + ")")
        .call(x_axis);

    bounded.append("g")
        .attr("transform", "translate(120, 10)")
        .call(y_axis);

    bounded.append('text')
        .attr('x', dimension.width/2 + 50)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .style('font-size', 26)
        .style("font-family", "Helvetica")
        .text('Low and High temperature by time.');

    var svg2 = d3.select("#legend")

    svg2.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "red")
    svg2.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "blue")
    svg2.append("text").attr("x", 220).attr("y", 130).text("High temperature").style("font-size", "15px")
        .attr("alignment-baseline","middle").style("font-family", "Helvetica")
    svg2.append("text").attr("x", 220).attr("y", 160).text("Low temperature").style("font-size", "15px")
        .attr("alignment-baseline","middle").style("font-family", "Helvetica")

}
buildPlot();

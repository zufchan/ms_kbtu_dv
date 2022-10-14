async function drawHistogram(tempAccessor, btn_id) {
    const btns = ["#btn1", "#btn2", "#btn3", "#btn4"];
    for (const bttn of btns) {
        $(bttn).prop('disabled', false);
    }
    var disableButton = (e) => {
        $(btn_id).prop('disabled', true);
    };

    $(document).on('click', btn_id, disableButton);

    const dataset = await d3.json("./my_weather_data.json")
    const yAccessor = d => d.length;

    const width = 600
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 50,
            right: 30,
            bottom: 20,
            left: 30,
        },
    }
    //set dimensions

    const parent = d3.select("#wrapper")
    parent.selectAll('*').remove()

    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    const wrapper = parent
        .append("svg").
        attr("width", dimensions.width).
        attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate", `translate(${dimensions.margin.left}+px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, tempAccessor))
        .range([75, dimensions.boundedWidth])

    const d3_bins_gen = d3.bin()
        .domain(xScaler.domain())
        .value(tempAccessor)
        .thresholds(20);

    const d3_bins = d3_bins_gen(dataset);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(d3_bins, yAccessor)])
        .range([dimensions.boundedHeight, 20])
    //setting scalers

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(d3_bins)
        .enter()
        .append("g");

    const bar = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + 1 / 2)
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("fill", "green")
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0)-0.5]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)));

    const x_axis_gen = d3.axisBottom().scale(xScaler);

    const x_axis = bounds.append("g")
        .style("font", "16px sans-serif")
        .style("transform", `translateY(${dimensions.boundedHeight+5}px)`)
        .call(x_axis_gen);

    const count = binGroups.filter(yAccessor)
        .append("text")
        .attr("font-size","12px")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)-7) / 2 )
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor);

    var y = d3.scaleLinear()
        .domain([0, d3.max(d3_bins, function (d) {return d.length;})])
        .range([dimensions.boundedHeight, 20])
    //generating both axis

    bounds.append("g")
        .style("font", "14px sans-serif")
        .attr("transform", "translate(" + 75 + "," + 0 + ")")
        .call(d3.axisLeft(y));

    bounds.append('text')
        .attr("font-size","20px")
        .attr("y", 40)
        .attr("x", -80)
        .attr("transform", "rotate(-90)")
        .attr("font-family","sans-serif")
        .text("Count")

    bounds.append('text')
        .attr("font-size","20px")
        .attr("x", 400)
        .attr("y", 340)
        .attr("font-family","sans-serif")
        .text("Temperature °F")
}

const getMax = d => d.temperatureMax;
const getMin = d => d.temperatureMin;
const getLow = d => d.temperatureLow;
const getHigh = d => d.temperatureHigh;

drawHistogram(getMax)


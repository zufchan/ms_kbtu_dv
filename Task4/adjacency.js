async function build() {
    const nodes = await d3.csv("nodelist.csv");
    const projs = await d3.csv("edge-node.csv");
    const edges = await d3.csv("edgelist.csv");
    const countrycnt = await d3.csv("countrycount.csv");
    const typecnt = await d3.csv("typecount.csv");

    // console.table(nodes);
    // console.table(edges);
    function adjacencyMatrix(nodes,projs,edges) {
        var matrix = [];
        var edgeHash = {};
        edges.forEach(edge => {
            var id = edge.company+"-"+edge.programms;
            edgeHash[id] = edge;
        })

        for(let i=0; i<nodes.length; i++) {
            for(let j=0; j<projs.length; j++) {
                var uel = nodes[i];
                var bel = projs[j];
                var grid = {
                    id: uel.company+"-"+bel.programms,
                    x:j,
                    y:i,
                    programms: bel.type,
                    weight:0
                }
                if(edgeHash[grid.id]) {
                    grid.weight = parseInt(edgeHash[grid.id].value);
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 420,
            right: 10,
            bottom: 10,
            left: 500
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(nodes,projs,edges);
    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","grid")
        .attr("width",25)
        .attr("height",25)
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .style("fill-opacity", d=>d.weight*0.3);


    const weight_text = wrapper
        .append("g")
        .attr("transform","translate(508,438)")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .text(d=>d.weight === 0 ? "" : d.weight)
        .style("text-anchor","right");

    // programms text
    const namesX = wrapper
        .append("g")
        .attr("transform","translate(500,400)")
        .selectAll("text")
        .data(projs)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(projs=>projs.programms)
        .style("text-anchor","right")
        .style('fill', d=>d.colors)
        .attr("transform", "rotate(270)");

    // companies text
    const namesY = wrapper
        .append("g")
        .attr("transform","translate(490,425)")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.company)
        .style('fill', d=>d.colors)
        .style("text-anchor","end");


    // types text
    const namesX1 = wrapper
        .append("g")
        .attr("transform","translate(500,200)")
        .selectAll("text")
        .data(typecnt)
        .enter()
        .append("text")
        .attr("y",d=>(d.programms_cums*25 + d.programms*12.5))
        .text(d=>d.typess)
        .style("text-anchor","right")
        .style('fill', d=>d.colors)
        .style('font-weight', '900')
        .attr("transform", "rotate(270)");

    // countries text
    const namesY1 = wrapper
        .append("g")
        .attr("transform","translate(130,425)")
        .selectAll("text")
        .data(countrycnt)
        .enter()
        .append("text")
        .attr("y",d=>(d.company*12.5 + d.company_cums*25))
        .text(d=>d.country)
        .style('fill', d=>d.colors)
        .style('font-weight', '900')
        .style("text-anchor","end");
}

build();
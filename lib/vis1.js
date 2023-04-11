let geoJson = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json";
let arboDataByYearCsv = "../data/Data_WNV.csv"
let fipsByState = "https://raw.githubusercontent.com/kjhealy/us-county/master/data/census/fips-by-state.csv"
let width = 1000
let height = 1300
Promise.all([d3.json(geoJson), d3.csv(arboDataByYearCsv, (d) => {
    if (d.State.match(/^MA|CT|NH|RI|ME|VT$/)) {
        return d
    }
}), d3.csv(fipsByState, (d) => {
    if (d.state.match(/^MA|CT|NH|RI|ME|VT$/)) {
        return d
    }
}),], d3.autoType())
    .then(main)

function main(data) {
    const tooltip = d3.select("#vis1-tab-pane").append("div")
    tooltip.attr("id", "tooltip")


    let arboDataByYear = d3.group(data[1], d => d.Year);
    let countyFips = d3.group(data[2], d => d.fips);
    let yearStateSpecies = d3.rollup(data[1], v => d3.sum(v, d => d.COUNT), d => d.Year, d => d.State, d => d.name)
    let unrolled = unroll(yearStateSpecies, ["Year", "State", "name"], "COUNT")

    const yearSelector = d3.select("#vis1-tab-pane")
        .append('select')
        .attr("id", "yearSelector")
        .on('change', onChange)

    yearSelector
        .selectAll('option')
        .data(arboDataByYear.keys()).enter()
        .append('option')
        .text(function (d) {
            return d;
        });

    yearSelector.property("value", Math.max(...arboDataByYear.keys()))

    function onChange() {
        let selectedYear = d3.select('select').property('value')
        console.log(`Filtering by year: ${selectedYear}, rerendering map`)
        d3.selectAll("#geo").remove()
        d3.selectAll("#bubble").remove()
        d3.selectAll("#barChart").remove()
        d3.selectAll("#pieChart").remove()

        renderMap(selectedYear)
        renderBubble(selectedYear)
    }

    onChange()

    function getCountyDataForYear(year, county) {
        let results = {
            total: 0, speciesTotals: []
        }
        arboDataByYear.get(year).forEach(d => {
            if (d.County == county) {
                results.total += +d.COUNT
                results.speciesTotals.push(`${d.name}: ${d.COUNT}`)
            }
        })
        return results
    }

    function renderBubble(year) {
        let bubbleData = unrolled.filter(d => {
            if (d.Year == year) {
                return d
            }
        })
        let max = Math.max(...bubbleData.map(o => o.COUNT))
        let min = Math.min(...bubbleData.map(o => o.COUNT))
        let mouseleave = function (d) {
            d3.select("#tooltip")
                .style("opacity", 0)
        }
        let x = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5, 6])
            .range([100, 200, 300, 400, 500, 600])

        let color = d3.scaleOrdinal()
            .domain([1, 6])
            .range(["#D42A34", "#62CA50", "#F78C37", "#0677BA", "#FFD827", "#6A32A5"])

        let scaleRadius = d3.scaleLinear()
            .domain(d3.extent(bubbleData.map(d => d.COUNT)))
            .range([15, 60])

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        let bubbleSvg = d3.select("#vis1-tab-pane").append("svg")
        bubbleSvg.attr("viewBox", `0 0 ${width} ${height}`)
            .attr("id", "bubble")

        let nodeElements = bubbleSvg.append("g")
            .selectAll("circle") //    .attr("id", )
            .data(bubbleData)
            .enter()
            .append("circle")
            .attr("r", (d, i) => {
                return scaleRadius(d.COUNT)
            })
            .attr("cx", (d, i) => {
                return width / 2 + 5 * i
            })
            .attr("cy", (d, i) => {
                return width / 2 + 5 * i
            })
            .attr("class", "nodes")
            .style("fill", function (d) {
                return color(d.State)
            })
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 4)
            .on("mousemove", (mouseData, d) => {
                try {
                    d3.select('#tooltip')
                        .style("opacity", .8)
                        .style("left", (mouseData.clientX + 10).toString() + "px")
                        .style("top", (mouseData.clientY + 10).toString() + "px")
                        .html(`State: ${d.State}<br>${d.COUNT}<br>${d.name}
                        `)
                } catch (TypeError) {
                    console.log(`Error: Data not found for county FIPS=${d.County}`)
                }
            })
            .on("mouseleave", mouseleave)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        let simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(.2).x(function (d) {
                return x(d.State)
            }))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2))
            .force("charge", d3.forceManyBody().strength(.1))
            .force("y", d3.forceY())
            .force("collide", d3.forceCollide().radius(function (d, i) {
                return 40 * standardize(d.COUNT) + 25
            }))

        simulation
            .nodes(bubbleData)
            .on("tick", ticked);

        function ticked() {
            nodeElements
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
        }

        function standardize(val) {
            return (val - min) / (max - min)
        }
    }

    function renderMap(year) {
        let geoSvg = d3.select("#vis1-tab-pane")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("id", "geo")

        let projection = d3.geoMercator()
            .center([-71.5, 45.5])
            .scale(5500)
            .translate([width / 2, height / 3]);
        let geoGenerator = d3.geoPath().projection(projection);
        const geoJson = topojson.feature(data[0], data[0].objects.collection).features.filter((d) => {
            return d.properties.state_fips == "25" || d.properties.state_fips == "23" || d.properties.state_fips == "33" || d.properties.state_fips == "50" || d.properties.state_fips == "44" || d.properties.state_fips == "09"
        })
        let casesExtent = d3.extent(data[1], d => {
            if (d.Year == year) {
                return Number(d.COUNT)
            }
        })
        casesExtent[0] = 1

        function getColor(cases) {
            const color = d3.rgb(d3.interpolateYlOrRd(cases / casesExtent[1]))
            return color.formatHex()
        }

        let mapCanvas = geoSvg.append('g')
        mapCanvas.selectAll('path')
            .data(geoJson)
            .enter()
            .append('path')
            .attr("class", "path_geo")
            .attr("d", geoGenerator)
            .attr("fill", "white")
            .on("mousemove", (mouseData, d) => {
                try {
                    let county = countyFips.get(d.properties.fips.toString())[0].name
                    let state = countyFips.get(d.properties.fips.toString())[0].state
                    let counts = getCountyDataForYear(year, d.properties.fips.toString())
                    d3.select('#tooltip')
                        .style("opacity", .8)
                        .style("left", (mouseData.clientX + 10).toString() + "px")
                        .style("top", (mouseData.clientY + 10).toString() + "px")
                        .html(`<div class='tooltipData'>
                        ${county}, ${state}<br>
                        Total: ${counts.total}<br>
                        ${counts.speciesTotals.join("<br>")}
                        </div>
                `)
                } catch (TypeError) {
                    console.log(`Error: Data not found for county FIPS=${d.properties.fips.toString()}`)
                }
            })
            .on("mouseout", () => {
                d3.select('#tooltip')
                    .style("opacity", 0)
            })
            .transition()
            .delay((_, i) => i * 2)
            .duration(800)
            .style("fill", d => {
                try {
                    let year = yearSelector.property("value")
                    let total = getCountyDataForYear(year, d.properties.fips.toString()).total
                    let color = getColor(total)
                    return color;
                } catch (error) {
                    return "white";
                }
            })
        geoSvg.call(d3.zoom()
            .extent([[0, 0], [1000, 800]])
            .scaleExtent([0, 8])
            .on("zoom", zoomed))

        function zoomed({transform}) {
            mapCanvas.attr("transform", transform);
        }
    }
}

function unroll(rollup, keys, label = "value", p = {}) {
    return Array.from(rollup, ([key, value]) => value instanceof Map ? unroll(value, keys.slice(1), label, Object.assign({}, {
        ...p,
        [keys[0]]: key
    })) : Object.assign({}, {...p, [keys[0]]: key, [label]: value})).flat();
}
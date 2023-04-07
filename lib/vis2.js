Promise.all([d3.csv("https://raw.githubusercontent.com/mshea12/week7-568/main/Mosq_Type_By_Year.csv", d3.autoType),
    d3.csv("https://raw.githubusercontent.com/mshea12/week7-568/main/Stacked_Bar_GENUS.csv",
        d3.autoType)]).then(barData => {

    //Create Axis and Call

    let margin = {top: 10, right: 30, bottom: 20, left: 50}

    let barChartSvg = d3.select("#vis2-tab-pane")
        .append("svg")
        .attr("id", "barChart")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", "translate(50,10)")


    let x = d3.scaleBand().range([0, 600]).padding(0.4)
    let y = d3.scaleLinear().range([height, 0])
    let z = d3.scaleOrdinal()
        .range(d3.schemeSet3);
    barChartSvg.append("g").call(d3.axisLeft(y.domain([0, 1400])))
    barChartSvg.append("g").call(d3.axisBottom(x.domain(d3.map(barData[1], d => d.Date)))).attr("transform", "translate(0,470)")

    d3.map(barData[1], function (d) {
        // return console.log(x(d.Date))
    })
    // console.log(data[1])
    let keys = barData[1].columns.slice(1);
    // console.log(keys)
    // console.log(d3.stack().keys(keys)(data[1]))
    // console.log(keys.slice().reverse())

    barChartSvg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(barData[1]))
        .enter().append("g")
        .attr("fill", function (d) {
            return z(d.key)
        })
        .selectAll("rect")
        .data(function (d, i) {
            d = d.map(dd => {
                dd["key"] = keys[i].trim().replace(" ", "-").replace("/", "-").replaceAll(" ", "")
                return dd
            })
            return d
        })
        .enter()
        .append("rect").attr("class", (d, i) => {

        return d["key"]
    })
        .attr("x", function (d) {
            return x(d.data.Date)
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", 20)
        .on("mouseover", function () {
            d3.selectAll("rect").classed("inactive", true);
            d3.select(this).classed("inactive", false)
        })
        .on("mouseout", function () {
            d3.selectAll("rect").classed("inactive", false);
        })


    var legend = barChartSvg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(500," + i * 10 + ")";
        })


    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });

    // console.log(data[0])
    AedesGrouper = (function (d) {
        return d.Species == "Aedes triseriatus" || d.Species == "Aedes c. canadensis" || d.Species == "Aedes cantator" || d.Species == "Aedes cinereus" || d.Species == "Aedes j. japonicus" || d.Species == "Aedes sollicitans" || d.Species == "Aedes taeniorhynchus" || d.Species == "Aedes vexans" || d.Species == "Aedes trivittatus" || d.Species == "Aedes sticticus" || d.Species == "Aedes dupreei" || d.Species == "Aedes stimulans" || d.Species == "Aedes albopictus" || d.Species == "Aedes provocans"
    })

    data2 = barData[0].filter(function (d) {
        return d.Year == '2019'
    }).filter(AedesGrouper)


    let radius = Math.min(width, height) / 2


    pieChartSvg = d3.select("#vis2-tab-pane").append("svg")
        .attr("id", "pieChart")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", "translate(300,160)")


    let color = d3.scaleOrdinal()
        .range(d3.schemeSet3)

    let pie = d3.pie()
        .value(function (d) {
            return d.Num
        })
    let outerarc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // console.log(pie(data2))
    const urlList = ([{url: "https://raw.githubusercontent.com/mshea12/week7-568/main/Aedes.png"}, {url: "https://raw.githubusercontent.com/mshea12/CIS-568_med-viz1/main/mosquito%20(3).png"}])

    pieChartSvg
        .selectAll()
        .data(pie(data2))
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(150)
            .outerRadius(radius))
        .attr('fill', function (d) {
            return (color(function (d) {
                return d.Species
            }))
        })
        .attr("stroke", "black")
        .attr("class", "labels")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

    pieChartSvg
        .selectAll('allPolylines')
        .data(pie(data2))
        .join('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', function (d) {
            const posA = d3.arc()
                .innerRadius(90)
                .outerRadius(radius).centroid(d) // line insertion in the slice
            const posB = d3.arc()
                .innerRadius(radius * .93)
                .outerRadius(radius * .9).centroid(d) // line break: we use the other arc generator that has been built only for that
            const posC = d3.arc()
                .innerRadius(radius * .93)
                .outerRadius(radius * .9).centroid(d); // Label position = almost the same as posB
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.96 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    pieChartSvg
        .selectAll('allLabels')
        .data(pie(data2))
        .join('text')
        .text(d => d.data.Species)
        .attr('transform', function (d) {
            const pos = d3.arc()
                .innerRadius(radius * .9)
                .outerRadius(radius * .9).centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return `translate(${pos})`;
        })
        .style('text-anchor', function (d) {
            const midangle = d.startAngle + (d.endAngle * 0.9 - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    pieChartSvg.append('image')
        .attr("xlink:href", function (d) {
            return urlList[0].url
        })
        .attr("width", 200)
        .attr("height", 200)
        .attr("transform", "translate(-90,-90)")
        .attr('fill', '#00000')
        .attr('r', '155');
})
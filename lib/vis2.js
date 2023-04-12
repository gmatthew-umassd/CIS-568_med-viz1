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

        var radius = Math.min(width, height) / 2 - margin.bottom


        /*svg2= d3.select("#figure2").append("svg").attr("width",  width + margin.left + margin.right)
                                        .attr("height", height + margin.top + margin.bottom)
                                        .append("g")
                                        .attr("transform","translate(400,250)") */
        
        
        // set the color scale
        var color = d3.scaleOrdinal()
          .range(d3.schemeSet3)
        
          piechart = function(piedata) {
        
            svg2= d3.select("#figure2").append("svg").attr("width",  width + margin.left + margin.right)
                                        .attr("height", height + margin.top + margin.bottom)
                                        .append("g")
                                        .attr("transform","translate(400,250)")
        
            //Me messing around with turning a class into a filter to use on the data. I need to add all of the species groupers. Just want to get
            //it working first. 
          var grouper2 = piedata.concat("Grouper")
          var imageGrouper;
        
          console.log(piedata)
          var AedesGrouper = (function(d) {return d.Species=="Aedes triseriatus"||	d.Species=="Aedes c. canadensis"||	d.Species=="Aedes cantator"||	d.Species=="Aedes cinereus"||	d.Species=="Aedes j. japonicus"||	d.Species=="Aedes sollicitans"||
                                                d.Species=="Aedes taeniorhynchus"||	d.Species=="Aedes vexans"||	d.Species=="Aedes trivittatus"||	d.Species=="Aedes sticticus"||	d.Species=="Aedes dupreei"||	d.Species=="Aedes stimulans"||	d.Species=="Aedes albopictus"||	d.Species=="Aedes provocans"})
          var CulexGrouper = (function(d) {return 	d.Species =="Culex territans"||	d.Species =="Culex sp."||	d.Species =="Culex salinarius"||	d.Species =="Culex restuans"||	d.Species =="Culex pipiens-restuans (Mixed)"||	d.Species =="Culex pipiens"})
          var CulisetaGrouper = (function(d) {return d.species=="Culiseta sp."||	d.species=="Culiseta morsitans"||	d.species=="Culiseta minnesotae"||	d.species=="Culiseta melanura"||	d.species=="Culiseta inornata"||	d.species=="Culiseta impatiens"})
          var AnophelesGrouper = (function (d) {return d.Species== "Anopheles walkeri"||	d.Species== "Anopheles quadrimaculatus s.s."||	d.Species== "Anopheles quadrimaculatus s.l."||	d.Species== "Anopheles punctipennis"||	d.Species== "Anopheles crucians complex"})
          var PsorophoraGrouper = (function (d) {return d.Species == 'Psorophora ferox'})
          var OtherGrouper = (function (d) {return d.Species == 'Other Species / Unknown'})
          var UranotaeniaGrouper = (function (d) {return d.Species == 'Uranotaenia sapphirina'})
          var CoquillettidiaGrouper = (function (d) {return d.Species == 'Coquillettidia perturbans'})
        
        
          var pievar = function (piedata) {
         
          if(piedata=='Aedes') { imageGrouper=4; return AedesGrouper}
          else if (piedata=='Culex') {imageGrouper=2;return CulexGrouper;}
          else if (piedata=='Culliseta') {imageGrouper=0;return CulisetaGrouper;}
          else if (piedata=='Psorophoraferox') {imageGrouper=3;return PsorophoraGrouper}
          else if (piedata=='OtherSpecies/Unknown') {imageGrouper=5;return OtherGrouper}
          else if (piedata=='Uranotaeniasapphirina') {imageGrouper=0;return UranotaeniaGrouper}
          else if (piedata=='Anopheles') {imageGrouper=3;return AnophelesGrouper}
          else if (piedata=='Coquillettidia') {imageGrouper=6; return CoquillettidiaGrouper}
        }
        
        
        console.log(pievar)
        data2 = data[0].filter(function(d){return d.Year == '2021'}).filter(pievar(piedata))
        
        
        // Compute the position of each group on the pie:
        var pie = d3.pie()
          .value(function(d) {return d.Num })
        var outerarc = d3.arc()
          .innerRadius(radius * 0.9)
          .outerRadius(radius * 0.9)
        
        console.log(pie(data2))
        const urlList = ([{url: "https://raw.githubusercontent.com/mshea12/week7-568/main/bugimage.jpg"},
                                        {url: "https://raw.githubusercontent.com/mshea12/CIS-568_med-viz1/main/mosquito%20(3).png"},
                                        {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/CulexPipens.png"},
                                      {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/AnophelesGrouper.png"},
                                    {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/AedesAlboGrouper.png"},
                                  {url: "https://raw.githubusercontent.com/mshea12/week7-568/main/OtherGrouper.png"},
                                {url: "https://raw.githubusercontent.com/mshea12/week7-568/main/CoqGrouper.png"},
                              {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/CoqGrouper.png"}])
        
        
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg2
          .selectAll()
          .data(pie(data2))
          .enter()
          .append('path')
          .attr('d', d3.arc()
            .innerRadius(150)
            .outerRadius(radius)
          )
          .attr('fill', function(d){ return(color(function (d) {return d.Species})) })
          .attr("stroke", "black")
          .attr("class","labels")
          .style("stroke-width", "2px")
          .style("opacity", 0.9)
        
        // Add the polylines between chart and labels: 
        svg2
          .selectAll('allPolylines')
          .data(pie(data2))
          .join('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              const posA = d3.arc()
            .innerRadius(90)
            .outerRadius(radius).centroid(d) // line insertion in the slice
              const posB = d3.arc()
            .innerRadius(radius*.93)
            .outerRadius(radius*.9).centroid(d) // line break: we use the other arc generator that has been built only for that
              const posC = d3.arc()
            .innerRadius(radius*.93)
            .outerRadius(radius*.9).centroid(d); // Label position = almost the same as posB
              const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.96 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            }) 
        
        // Add the polylines between chart and labels:
        svg2
          .selectAll('allLabels')
          .data(pie(data2))
          .join('text')
            .text(d => d.data.Species)
            .attr('transform', function(d) {
                const pos = d3.arc()
            .innerRadius(radius*.9)
            .outerRadius(radius*.9).centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function(d) {
                const midangle = d.startAngle + (d.endAngle*0.9 - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end') })
        
          var centerSvg = svg2.append('image')
                        .attr("xlink:href", function(d){return urlList[imageGrouper].url})
                        .attr("width", 200)
                        .attr("height", 200)
                        .attr("transform", "translate(-90,-90)")
                        .attr('fill','#00000')
                        .attr('r','155');
        
        
                                    
                                }    })
        
        

                                    
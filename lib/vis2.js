Promise.all([d3.csv("https://raw.githubusercontent.com/mshea12/week7-568/main/Mosq_Type_By_Year.csv", d3.autoType),
    d3.csv("https://raw.githubusercontent.com/mshea12/week7-568/main/Stacked_Bar_GENUS.csv",
        d3.autoType)]).then(barData => {

    //Create Axis and Call

    let margin = {top: 10, right: 30, bottom: 20, left: 50}

    let table = d3.select/*(".tab-content").select*/("#vis2-tab-pane").append("div").attr("id","table")
    table.append("div").attr("class","table-row")
    d3.select(".table-row").append("div").attr("class","table-data").attr("id", "viz1") 
    d3.select(".table-row").append("div").attr("class","table-data").attr("id", "viz2")

    
    const tooltip2 = d3.select("#table").append("div")
    tooltip2.attr("id", "tooltipq")

    let barChartSvg = d3.select("#viz1")   
        .append("svg") 
        .attr("id", "barChart")
        .append("g")
        .attr("transform", "translate(50,10)")
    barChartSvg.append("text").attr("id","title").text("MOSQUITO GENUS").attr("transform", "translate(100,35)")

   


    let x = d3.scaleBand().range([0, 600]).padding(0.4)
    let y = d3.scaleLinear().range([500, 0])
    let z = d3.scaleOrdinal()
        .range(d3.schemeSet3);
    barChartSvg.append("g").call(d3.axisLeft(y.domain([0, 1300])))
    barChartSvg.append("g").call(d3.axisBottom(x.domain(d3.map(barData[1], d => d.Date)))).attr("transform", "translate(0,500)")

    d3.map(barData[1], function (d) {
 
    })

    let keys = barData[1].columns.slice(1);


    barChartSvg
        .append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(barData[1]))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return z(d.key)
        })
        .selectAll("rect")
        .data(function (d, i) {
            d = d.map(dd => {
                dd["key"] = keys[i].trim().replace(" ", "").replace("/", "").replaceAll(" ", "")
                //console.log(dd["key"])
                return dd
               
            })
           
            return d
        })
        .enter()
        .append("rect").attr("class", (d, i) => {

        return d["key"]
    }).attr("id", function(d) {return d.data.Date})
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

        .on("mouseover", function(d,i) { d3.selectAll("rect").classed("inactive", true)   
        d3.select(this).classed("inactive", false) 
       grouper= (d3.select(this).attr("class"))
       year = (d3.select(this).attr("id"))
       //console.log(year)
        // get the class name which is the mosquito species 
       piechart(grouper,year)
       
      })
      .on("mousemove", (mouseData, d) => {
        try {
          gen =  d["key"]
           group = "d.data."+d["key"]
            d3.select('#tooltipq')
                .style("opacity", .8)
                .style("left", (mouseData.clientX + 10).toString() + "px")
                .style("top", (mouseData.clientY + 10).toString() + "px")
                .html(gen +": " + eval(group))
                
        } catch (TypeError) {
            console.log(`Error: Data not found for county FIPS=`)
        }
    })
      .on("mouseout", function() { d3.selectAll("rect").classed("inactive", false)
      d3.select("#viz2").select("svg").remove()
      })


    var legend = barChartSvg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")



    legend.append("rect")
        .attr("x", 120)
        .attr("y", function(d,i) {return 100+ 25*i})
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z)


    legend.append("text")
        .attr("x", 120)
        .attr("y", function(d,i) {return 110+ 25*i})
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });


        const radius = 160;

    

        
          piechart = function(piedata, year) {
            
             pieChartSvg = d3.select("#viz2").append("svg")
            .attr("id", "barChart")
            //.attr("viewBox", `0 0 1200 1000 `)
            .append("g")
            .attr("transform", "translate(165,270)")
            
            pieChartSvg.append("text").attr("id","title").text("MOSQUITO SPECIES").attr("transform", "translate(-155,-220)")


          var grouper2 = piedata.concat("Grouper")
          var imageGrouper;
        
          //console.log(piedata)
          var AedesGrouper = (function(d) {return d.Species=="Aedes triseriatus"||	d.Species=="Aedes c. canadensis"||	d.Species=="Aedes cantator"||	d.Species=="Aedes cinereus"||	d.Species=="Aedes j. japonicus"||	d.Species=="Aedes sollicitans"||
                                                d.Species=="Aedes taeniorhynchus"||	d.Species=="Aedes vexans"||	d.Species=="Aedes trivittatus"||	d.Species=="Aedes sticticus"||	d.Species=="Aedes dupreei"||	d.Species=="Aedes stimulans"||	d.Species=="Aedes albopictus"||	d.Species=="Aedes provocans"})
          var CulexGrouper = (function(d) {return 	d.Species =="Culex territans"||	d.Species =="Culex sp."||	d.Species =="Culex salinarius"||	d.Species =="Culex restuans"||	d.Species =="Culex pipiens-restuans (Mixed)"||	d.Species =="Culex pipiens"})
          var CulisetaGrouper = (function(d) {return d.species=="Culiseta sp."||	d.species=="Culiseta morsitans"||	d.species=="Culiseta minnesotae"||	d.species=="Culiseta melanura"||	d.species=="Culiseta inornata"||	d.species=="Culiseta impatiens"})
          var AnophelesGrouper = (function (d) {return d.Species== "Anopheles walkeri"||	d.Species== "Anopheles quadrimaculatus s.s."||	d.Species== "Anopheles quadrimaculatus s.l."||	d.Species== "Anopheles punctipennis"||	d.Species== "Anopheles crucians complex"})
          var PsorophoraGrouper = (function (d) {return d.Species == 'Psorophora ferox'})
          var OtherSpeciesUnkownGrouper = (function (d) {return d.Species == 'Other Species / Unknown'})
          var UranotaeniasapphirinaGrouper = (function (d) {return d.Species == 'Uranotaenia sapphirina'})
          var CoquillettidiaGrouper = (function (d) {return d.Species == 'Coquillettidia perturbans'})
        
        
          var pievar = function (piedata) {
         
          if(piedata=='Aedes') { imageGrouper=4; return AedesGrouper}
          else if (piedata=='Culex') {imageGrouper=2;return CulexGrouper;}
          else if (piedata=='Culliseta') {imageGrouper=0;return CulisetaGrouper;}
          else if (piedata=='Psorophoraferox') {imageGrouper=5;return PsorophoraGrouper}
          else if (piedata=='OtherSpeciesUnknown') {imageGrouper=5;return OtherSpeciesUnkownGrouper}
          else if (piedata=='Uranotaeniasapphirina') {imageGrouper=0;return UranotaeniasapphirinaGrouper}
          else if (piedata=='Anopheles') {imageGrouper=3;return AnophelesGrouper}
          else if (piedata=='Coquillettidia') {imageGrouper=6; return CoquillettidiaGrouper}
        }
        
        
        //console.log(barData[0])
        data2 = barData[0].filter(function(d){return d.Year == year}).filter(pievar(piedata))
        colorDomain = d3.map(data2, function (d) {return d.Species})
       // console.log(colorDomain)
        var color = d3.scaleOrdinal()
        .range(d3.schemeSet3).domain(colorDomain)
        
        // Compute the position of each group on the pie:
        var pie = d3.pie()
          .value(function(d) {return d.Num })
        
        console.log(pie(data2))
        const urlList = ([{url: "https://raw.githubusercontent.com/mshea12/CIS-568_med-viz1/main/mosquito%20(3).png"},
                                        {url: "https://raw.githubusercontent.com/mshea12/CIS-568_med-viz1/main/mosquito%20(3).png"},
                                        {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/CulexPipens.png"},
                                      {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/AnophelesGrouper.png"},
                                    {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/AedesAlboGrouper.png"},
                                  {url: "https://raw.githubusercontent.com/mshea12/week7-568/main/OtherGrouper.png"},
                                {url: "https://raw.githubusercontent.com/mshea12/week7-568/main/CoqGrouper.png"},
                              {url:"https://raw.githubusercontent.com/mshea12/week7-568/main/CoqGrouper.png"}])
        
        
        var totals = d3.sum(pie(data2), function(d) {return d.data.Num}) 
    
        var label = d3.arc().innerRadius(120).outerRadius(160)        
        
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        pieChartSvg
        .selectAll()
        .data(pie(data2))
        .enter().append("g").attr("class", "pie")
        .append('path')
        .attr('d', d3.arc()
          .innerRadius(120)
          .outerRadius(160)
        )
          .attr('fill',d=>color(d.data.Species))
          .attr("stroke", "black")
          .attr("class","labels")
          .style("stroke-width", "2px")
          .style("opacity", 0.9)

          d3.selectAll(".pie").append("text").attr("transform", function(d) { 
            return "translate(" + label.centroid(d) + ")"
    }).style("text-anchor", "middle").attr("dy", ".35em").text(function(d) {return (d3.format(".0%") (d.data.Num/totals))})
          var centerSvg = pieChartSvg.append('image')
                        .attr("xlink:href", function(d){return urlList[imageGrouper].url})
                        .attr("width", 200)
                        .attr("height", 200)
                        .attr("transform", "translate(-90,-90)")
                        .attr('fill','#00000')
                        .attr('r','150'); 
          var pielegend = pieChartSvg
                        .selectAll(".pielegend")
                        .data(pie(data2))
                        .enter()
                        .append('g')
                        .attr('class', 'pielegend')
                       pielegend
                        .append("circle")
                        .attr("r", 10)
                        .attr("cx", "-105")
                        .attr("cy", function(d,i) {return 200+ 25*i})
                        //.attr('height', 20)
                        .style('fill', d=>color(d.data.Species));
                      
                      pielegend
                        .append('text')
                        .text(function(d) {return d.data.Species + "; Count: " +d.data.Num})
                        .attr('x', "-90")
                        .attr('y', function(d,i) {return 200+ 25*i})
                        .style("font-size", 12)


                                    
                                }    })
        
        

                                    
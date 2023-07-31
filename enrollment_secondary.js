//Date: 7/29/23
function main() {
    
    //SVG
    const margin = { top: 40, right: 50, bottom: 40, left: 50 },
    width = 820 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;
    
    const svg = d3.select("#Chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Tooltip
    const container = d3.select("#Chart")
    const tooltip = container
                    .append("div")
                    .style("visibility", "hidden")
                    .attr("class", "tooltip")

    //Color scale for filters: Region & Income
    const incomes = ["High income", "Upper middle income", "Lower middle income", "Low income"]

    const regions = ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean",
                    "Middle East & North Africa", "North America", "South Asia", "Sub-Saharan Africa"]

    const Incomecolor = d3.scaleOrdinal()
        .domain(incomes)
        .range(["#38761D", "#ACE1AF", "#F44336", "#990000"])
                // green  light green  light red     red 

                const Regioncolor = d3.scaleOrdinal()
                .domain(regions)
                .range(["#F44336", "#dc8120", "#51aa57", "#875ab2 ", "#d28989", "#2775FC", "#f1c232"])
                        // red       orange       green      purple     pink       blue     yellow

    //Legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right - 100}, 0)`)
        .style("opacity", 0.8);

    //Legend for Income
    const incomeLegend = legend.append("g")
        .attr("class", "incomeLegend")
        .style("visibility", "hidden")

    incomeLegend.selectAll("circle")
        .data(incomes)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => 20 + i * 25)
        .attr("r", 7)
        .attr("stroke", "black")
        .attr("fill", (d) => Incomecolor(d));
    
    incomeLegend.selectAll("text")
        .data(incomes)
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", 25)
        .attr("y", (d, i) => 25 + i * 25)
        .style("font-size", "12px");

    //Legend for Region
    const regionLegend = legend.append("g")
        .attr("class", "regionLegend")
        .style("visibility", "hidden")

    regionLegend.selectAll("circle")
        .data(regions)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => 20 + i * 25)
        .attr("r", 7)
        .attr("stroke", "black")
        .attr("fill", (d) => Regioncolor(d));
    
    regionLegend.selectAll("text")
        .data(regions)
        .enter()
        .append("text")
        .text((d) => d)
        .attr("x", 25)
        .attr("y", (d, i) => 25 + i * 25)
        .style("font-size", "12px");

    //Style legend
    legend.append("circle")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", 200)
        .attr("height", 200)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 2);


//Get data: x and y axis use d3.extent() to set domain automatically, why inside d3.csv()
d3.csv("all_years_pivot_edit.csv").then(function(data) {
    
    //Select columns and filter out blank data
    let selectedData = data.map(function(d) {
        if (d.Region !== "" && d.Country !== "" && d.Income !== "" && d.GovtExpEd !== "" && d.EnrollmentSecondary !== "") {
            return {
                Region: d.Region,
                Country: d.Country,
                Income: d.Income,
                GovtExpEd: +d.GovtExpEd,
                EnrollmentSecondary: +d.EnrollmentSecondary,
            };
        }
    }).filter(function(d) { return d != undefined; });

    //Chart title
    svg.append("text")
        .attr("class", "chart_title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", -20)
        .text("Secondary Enrollment (GPI) vs. Government Expenditure on Education")
        .style("font-weight", "bold");

    //X-axis and label
    const x = d3.scaleLinear()
        .domain([0, 0]) //added for transition 
        .range([0, width])
    svg.append("g")
        .attr("class", "x_axis") //added for transition 
        .attr("transform", "translate(0," + height + ")")
        .style("visibility", "hidden")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("class", "x_label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .text("Government expenditure on education (% of government expenditure)")
        .style("visibility", "visible")

    //Y-axis and label
    const y = d3.scaleLinear()
        .domain([0, 0]) //added for transition
        .range([height, 0])
    svg.append("g")
        .attr("class", "y_axis") //added for transition
        .attr("transform", "translate(0,0)")
        .style("visibility", "hidden")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "y_label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("School enrollment, secondary (gross), gender parity index (GPI)")

    //Right side - additional y-axis labels
    svg.append("text")
        .attr("class", "y_label2")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 4)
        .attr("y", width + margin.right / 2)
        .text("GPI > 1 more girls")
        .style("fill", "pink")

    svg.append("text")
        .attr("class", "y_label2")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/1.35)
        .attr("y", width + margin.right / 2)
        .text("GPI < 1 more boys")
        .style("fill", "steelblue")

    //GPI parity - horizontal line and label
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", y(1))
        .attr("x2", width)
        .attr("y2", y(1))
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))

    svg.append("text")
        .attr("class", "parity_label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", y(1))
        .text("gender parity, (GPI) = 1")
        .style("fill", "grey")

    //Scatter plot + Tooltip + Click to filter by Income|Region  
    const dots = svg.append("g")
        .selectAll("dot")
        .data(selectedData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", 0) // Set initial x position to 0 --> added for transition from 0,0
        .attr("cy", height) // Set initial y position to height --> added for transition from 0,0
        .attr("r", 4.25)
        .style("fill", function(d) { return Incomecolor(d.Income); })
        .style("opacity", 0.5)
        .attr("stroke", "black")
        //Tootlip
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("visibility", "visible");
            tooltip.html("<b>Country</b>: " + d.Country +
                    "<br><b>Region</b>: " + d.Region +
                    "<br><b>Income</b>: " + d.Income +
                    "<br><b>Government expenditure on education (% of government expenditure)</b>: " + d.GovtExpEd +
                    "<br><b>School enrollment, secondary (gross), gender parity index (GPI)</b>: " + d.EnrollmentSecondary)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 10) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("visibility", "hidden");
        })
        //Filter
        .on("click", function(d) {
            //Filter on region -> "click" -> highlight opacity of region group & reset opacity all other dots
            if (regionCheckbox.property("checked")) {
                const filteredDots = dots.filter(function(dotData) {
                    return dotData.Region === d.Region;
                });
                dots.style("opacity", 0.5);
                filteredDots.style("opacity", 1);
                regionLegend.selectAll("circle")
                    .style("opacity", 0.5)
                    .filter(function(legendData) {
                        return legendData === d.Region;
                    })
                    .style("opacity", 1);
            
            //Filter on income -> "click - dot" -> highlight opacity of income group & reset opacity all other dots
            } else if (incomeCheckbox.property("checked")) {
                const filteredDots = dots.filter(function(dotData) {
                    return dotData.Income === d.Income;
                });
                dots.style("opacity", 0.5);
                filteredDots.style("opacity", 1);
                incomeLegend.selectAll("circle")
                    .style("opacity", 0.5)
                    .filter(function(legendData) {
                        return legendData === d.Income;
                    })
                    .style("opacity", 1);
            }
        })

    //Transition - new x axis
    x.domain(d3.extent(selectedData, function(d) { return d.GovtExpEd; }));
    svg.select(".x_axis")
        .transition()
        .duration(3000)
        .style("visibility", "visible")
        .call(d3.axisBottom(x))

    //Transition - new y axis
    y.domain(d3.extent(selectedData, function(d) { return d.EnrollmentSecondary; }));
    svg.select(".y_axis")
        .transition()
        .duration(4900)
        .style("visibility", "visible")
        .call(d3.axisLeft(y))

    //Highlight dots
    dots.transition()
        .delay(function(d, i) { return i * 3 })
        .duration(3000)
        .attr("cx", function(d) { return x(d.GovtExpEd); })
        .attr("cy", function(d) { return y(d.EnrollmentSecondary); })

    //Event listener on SVG - double click on dot -> reset opacity
    svg.on("dblclick", function() {
        dots.style("opacity", 0.5);
        incomeLegend.selectAll("circle").style("opacity", 0.8);
        regionLegend.selectAll("circle").style("opacity", 0.8);
    });  

    //HTML checkbox filters: Income & Region
    const regionCheckbox = d3.select("#regionCheckbox");
    const incomeCheckbox = d3.select("#incomeCheckbox");

    //Incase "no change", due to income|regionCheckbox being "checked" in HTML by default
    if (incomeCheckbox.property("checked")) {
        d3.select(".incomeLegend").style("visibility", "visible");
        d3.select(".regionLegend").style("visibility", "hidden");
    } else if (regionCheckbox.property("checked")) {
        d3.select(".incomeLegend").style("visibility", "hidden");
        d3.select(".regionLegend").style("visibility", "visible");
    }

    //Change visibility of Income|Region legened, dependent on user interaction
    regionCheckbox.on("change", function() {
        if (regionCheckbox.property("checked")) {
            dots.style("fill", function(d) { return Regioncolor(d.Region); });
            incomeCheckbox.property("checked", false);
            d3.select(".regionLegend").style("visibility", "visible");
            d3.select(".incomeLegend").style("visibility", "hidden");
        } else {
            dots.style("fill", function(d) { return Incomecolor(d.Income); });
            d3.select(".regionLegend").style("visibility", "hidden");
        }
    });
    
    incomeCheckbox.on("change", function() {
        if (incomeCheckbox.property("checked")) {
            dots.style("fill", function(d) { return Incomecolor(d.Income); });
            regionCheckbox.property("checked", false);
            d3.select(".incomeLegend").style("visibility", "visible");
            d3.select(".regionLegend").style("visibility", "hidden");
        } else {
            dots.style("fill", function(d) { return Incomecolor(d.Income); });
            d3.select(".incomeLegend").style("visibility", "hidden");
        }
    });

    //Variables for Annotations - USA
    //Sort + Rank and Count y values
    let sort_x = selectedData.sort(function(a, b) {
        return a.GovtExpEd - b.GovtExpEd;
    });

    let x_rank = sort_x.findIndex(function(d) {
        return d.Country === "United States";
    }) + 1;

    let x_count = selectedData.map(function(d) {
        return d.GovtExpEd;
    }).filter(function(d) {
        return d !== undefined;
    }).length;

    //Calc. abs from 1: = 1 parity, > 1 more girls , < more boys + Sort + Rank and Count y values
    let differences = selectedData.map(function(d) {
        return Math.abs(d.EnrollmentSecondary - 1);
    });

    let sort_y = selectedData.sort(function(a, b) {
        return differences[selectedData.indexOf(a)] - differences[selectedData.indexOf(b)];
    });

    let y_rank = sort_y.findIndex(function(d) {
        return d.Country === "United States";
    }) + 1;

    let y_count = selectedData.map(function(d) {
        return d.EnrollmentSecondary;
    }).filter(function(d) {
        return d !== undefined;
    }).length;

    //Find the data point for United States
    const usData = selectedData.find(function(d) {
        return d.Country === "United States";
    });
    
    //Convert the x and y to pixel coordinates
    const xPixel = x(usData.GovtExpEd);
    const yPixel = y(usData.EnrollmentSecondary);
  
    //Annotation
    const annotations = [{
        note: {
        label: `#${y_rank} out of ${y_count} in (GPI) and #${x_rank} out of ${x_count} in Government expenditure on education.`,
        title: "United States",
        wrap: 150,
        align: "left",
        color: ["#5b5b5b"]
        },
        connector: {
        end: "arrow",
        color: ["#e71d94"]
        },
        type: d3.annotationCalloutCircle,
        subject: { radius: 8 },
        x: xPixel,
        y: yPixel,
        dy: -20,
        dx: 20,
        color: ["#000000"],
        }];

    const makeAnnotations = d3.annotation()
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .style("font-size", "12px")
        .call(makeAnnotations);

});

}
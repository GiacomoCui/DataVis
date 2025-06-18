 d3.json("dataVis.json")
        .then(function(dataset) {



            var margin = {top: 30, right: 80, bottom: 70, left: 60};
            var width = 750 - margin.left - margin.right;
            var height = 750 - margin.top - margin.bottom;


            // append the svg object to the body of the page
            var svg = d3.select("#my_dataviz")
                .append("p")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleBand()
                .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                .range([0, width])
                .padding(0.2);

            var maxDataset = d3.max(dataset, function(d) { return Math.max(d.var1, d.var2); });
            var minDataset = d3.min(dataset, function(d) { return Math.min(d.var1, d.var2); });

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, function(d) { return Math.max(d.var1, d.var2);  }) + 10])
                .range([height, 0]);

            const color = d3.scaleLinear([0, maxDataset/2, maxDataset], ["#1a4396","#e1e3be" , "#961a1a"])
            // Add X axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale).ticks(5));

            // Add Y axis
            svg.append("g")
                .call(d3.axisLeft(yScale).ticks(5));

            // Add bars
            var bars = svg.selectAll("bars")
                .data(dataset)
                .enter()
                .append("rect")
                .attr("x", function(d, i) { return xScale(i+1) })
                .attr("y", function() { return yScale(0)})
                .attr("width", xScale.bandwidth())
                .attr("height", function() { return height - yScale(0); })
                .attr("fill", function(d) { return color(d.var2); });

            svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", function(d) { return yScale(d.var1); })
                .attr("height", function(d) { return height - yScale(d.var1); })
                .delay(function(d,i){console.log(i) ; return(i*100)})


            bars
                .on("click", function(d) {
                    let temp = d.var1;
                    d.var1 = d.var2;
                    d.var2 = temp;

                    d3.select(this)
                        .transition()
                        .duration(800)
                        .ease(d3.easeCubicInOut)
                        .attr("y", yScale(d.var1))
                        .attr("width", xScale.bandwidth())
                        .attr("height", height - yScale(d.var1))
                        .attr("fill", color(d.var2));
                })
                .on("mouseover", function(d, i) {
                    d3.select(this)
                        .attr("fill", color(d.var2 + d.var2 * 0.1))
                })
                .on("mouseout", function(d, i) {
                    d3.select(this)
                        .attr("fill", color(d.var2))
                        .select("title")
                        .remove();
                });

        })
        .catch(function(err) {
            console.error("Error loading the JSON data: ", err);
            d3.select("#my_dataviz")
                .append("p")
                .text("Failed to load data. Please check the console for errors.");
        })


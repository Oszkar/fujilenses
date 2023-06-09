// Function to load lenses data from JSON file and generate table
function loadLenses(isFocalMapView) {
    var fullFrameEquivalent = $("#switch1").is(":checked");
    var onlyFujifilm = $("#switch2").is(":checked");

    $.getJSON('lenses.json', function(data) {
        if (onlyFujifilm) {
            data = data.filter(function(lens) {
                return lens.Manufacturer.toLowerCase() === 'fujinon';
            });
        }

        if (isFocalMapView) {
            $("#lensDisplayArea").html(''); // Clear the display area
            generateFocalMapView(data, fullFrameEquivalent);
        } else {
            $("#lensDisplayArea").html(generateTableView(data, fullFrameEquivalent));
        }
    });
}

// Function to generate the table view
function generateTableView(lenses, fullFrameEquivalent) {
    var tableView = '<h2>Available Lens List</h2>' +
                    '<table class="table table-striped" id="lensTable">' +
                    '<thead>' +
                    '<tr>' +
                    '<th></th>' + // new column for the '+' button
                    '<th>Manufacturer</th>' +
                    '<th>Model Name</th>' +
                    '<th>Lens Type</th>' +
                    '<th>Min Focal Distance</th>' +
                    '<th>Max Focal Distance</th>' +
                    '<th>Max Aperture</th>' +
                    '</tr>' +
                    '</thead>';
    
    lenses.forEach(function(lens, index) {
        var minFocalLength = fullFrameEquivalent ? lens.MinFocalDistance * 1.5 : lens.MinFocalDistance;
        var maxFocalLength = fullFrameEquivalent ? lens.MaxFocalDistance * 1.5 : lens.MaxFocalDistance;

        tableView += '<tbody>' +
                     '<tr data-toggle="collapse" data-target="#details-' + index + '">' + // '+' button targets the detail cell
                     '<td><button class="btn btn-default">+</button></td>' +
                     '<td>' + lens.Manufacturer + '</td>' +
                     '<td>' + lens.Model + '</td>' +
                     '<td>' + lens.LensType + '</td>' +
                     '<td>' + minFocalLength + ' mm</td>' +
                     '<td>' + maxFocalLength + ' mm</td>' +
                     '<td>f/' + lens.MaxAperture + '</td>' +
                     '</tr>' +
                     '<tr id="details-' + index + '" class="collapse">' + // detail row, initially collapsed
                     '<td colspan="7">' + // detail row spans all columns
                     'Linear Motor: ' + (lens.LinearMotor ? 'Yes' : 'No') + '<br>' +
                     'Image Stabilization: ' + (lens.ImageStabilization ? 'Yes' : 'No') + '<br>' +
                     'Aperture Ring: ' + (lens.ApertureRing ? 'Yes' : 'No') + '<br>' +
                     'Weather Resistant: ' + (lens.WeatherResistant ? 'Yes' : 'No') +
                     '</td>' +
                     '</tr>' +
                     '</tbody>';
    });

    tableView += '</table>';

    return tableView;
}

// Function to generate the focal map view
function generateFocalMapView(lenses, switch1IsChecked) {
    // Set up the dimensions
    var svgWidth = 750;  // SVG width
    var svgHeight = lenses.length * 30; // SVG height, adjust as needed
    var chartMargin = 50;  // Margin around the chart area within the SVG

    // Check if switch1 is on
    if (switch1IsChecked) {
        lenses = lenses.map(lens => {
            return {...lens, MinFocalDistance: lens.MinFocalDistance * 1.5, MaxFocalDistance: lens.MaxFocalDistance * 1.5}
        });
    }

    // Clear the lens display area
    d3.select("#lensDisplayArea").html("");

    // Create SVG
    var svg = d3.select("#lensDisplayArea")
                .append("svg")
                .attr("width", svgWidth + chartMargin * 2)  // SVG width + margin on both sides
                .attr("height", svgHeight + chartMargin * 2) // SVG height + margin on top and bottom
                .style("border", "1px solid black");  // Border for SVG

    // Define the chart area within the SVG
    var chartArea = svg.append("g")
                       .attr("transform", "translate(" + chartMargin + "," + chartMargin + ")");

    // Create a scale for x-axis (Focal Length)
    var xScale = d3.scaleLog()  // Use a logarithmic scale for x-axis
                   .domain([8, 600])  // Focal length range 8mm to 600mm
                   .range([0, svgWidth]);  // Mapping the focal length range to the width of the chart area

    // Create a scale for y-axis (Lens Models)
    var yScale = d3.scaleBand()
                   .domain(lenses.map(l => l.Model))  // Mapping the lens models to the height of the chart area
                   .range([0, svgHeight])
                   .padding(0.1);  // Padding between the bars/circles

    // Create x-axis at the bottom of the chart area
    chartArea.append("g")
             .attr("transform", "translate(0," + svgHeight + ")")
             .call(d3.axisBottom(xScale).tickFormat(d3.format("~f")));  // Remove exponential notation for ticks

    // Add rectangles for non-prime lenses
    chartArea.selectAll(".zoom")
             .data(lenses.filter(l => l.LensType !== 'Prime'))
             .enter()
             .append("rect")
             .attr("class", "zoom")
             .attr("x", d => xScale(d.MinFocalDistance))
             .attr("y", d => yScale(d.Model))
             .attr("width", d => xScale(d.MaxFocalDistance) - xScale(d.MinFocalDistance))
             .attr("height", yScale.bandwidth());

    // Add circles for prime lenses
    chartArea.selectAll(".prime")
             .data(lenses.filter(l => l.LensType === 'Prime'))
             .enter()
             .append("circle")
             .attr("class", "prime")
             .attr("cx", d => xScale(d.MinFocalDistance))  // Both MinFocalDistance and MaxFocalDistance are same for Prime lenses
             .attr("cy", d => yScale(d.Model) + yScale.bandwidth() / 2)  // Center the circle in the band
             .attr("r", yScale.bandwidth() / 2);  // Radius of the circle is half the bandwidth

    // Add labels for the lenses
    chartArea.selectAll(".label")
             .data(lenses)
             .enter()
             .append("text")
             .attr("class", "label")
             .attr("x", d => xScale(d.MaxFocalDistance) + yScale.bandwidth() + 5)  // Adjust the offset for label based on bandwidth
             .attr("y", d => yScale(d.Model) + yScale.bandwidth() / 2)  // Center the text in the band
             .text(d => d.Model);
}
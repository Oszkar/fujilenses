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
            generateFocalMapView(data);
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
function generateFocalMapView(lenses) {
    // Add SVG to the lens display area
    var svg = d3.select("#lensDisplayArea")
                .append("svg")
                .attr("width", 500) // Adjust as needed
                .attr("height", lenses.length * 30); // Adjust as needed

    var xScale = d3.scaleLinear()
                   .domain([0, d3.max(lenses, function(d) { return d.MaxFocalDistance; })])
                   .range([0, 500]); // Adjust as needed

    svg.selectAll("rect")
       .data(lenses)
       .enter()
       .append("rect")
       .attr("x", 0)
       .attr("y", function(d, i) { return i * 30; }) // Adjust as needed
       .attr("width", function(d) { return xScale(d.MaxFocalDistance); })
       .attr("height", 20); // Adjust as needed

    svg.selectAll("text")
       .data(lenses)
       .enter()
       .append("text")
       .attr("x", function(d) { return xScale(d.MaxFocalDistance); })
       .attr("y", function(d, i) { return (i * 30) + 15; }) // Adjust as needed
       .text(function(d) { return d.LensType + ": " + d.MinFocalDistance + " - " + d.MaxFocalDistance; });
}
$(document).ready(function() {
    loadLenses();

    $("#switch3").change(function() {
        if ($("#switch3").is(":checked")) {
            $("#lensDisplayArea").html(generateFocalMapView());
        } else {
            loadLenses();
        }
    });

    $(document).on('click', 'th', function() {
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(compare($(this).index()));
        this.asc = !this.asc;

        // Clear the classes of all other column headers
        $('th').not(this).removeClass('asc desc');
        
        // Add asc or desc class to the clicked column header
        $(this).addClass(this.asc ? 'asc' : 'desc');

        if (!this.asc){rows = rows.reverse()}
        for (var i = 0; i < rows.length; i++){table.append(rows[i])}
    });
});

function compare(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}

function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

// Function to generate the table view
function generateTableView(lenses, fullFrameEquivalent) {
    var tableView = '<h2>Available Lenses</h2>' +
                    '<table class="table table-striped" id="lensTable">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Manufacturer</th>' +
                    '<th>Model</th>' +
                    '<th>Zoom Lens</th>' +
                    '<th>Min Focal Distance</th>' +
                    '<th>Max Focal Distance</th>' +
                    '<th>Max Aperture</th>' +
                    '<th>Linear Motor</th>' +
                    '<th>Image Stabilization</th>' +
                    '<th>Aperture Ring</th>' +
                    '<th>Weather Resistant</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    
    lenses.forEach(function(lens) {
        var minFocalLength = fullFrameEquivalent ? lens.MinFocalDistance * 1.5 : lens.MinFocalDistance;
        var maxFocalLength = fullFrameEquivalent ? lens.MaxFocalDistance * 1.5 : lens.MaxFocalDistance;

        tableView += '<tr>' +
                     '<td>' + lens.Manufacturer + '</td>' +
                     '<td>' + lens.Model + '</td>' +
                     '<td>' + (lens.ZoomLens ? 'Yes' : 'No') + '</td>' +
                     '<td>' + minFocalLength + ' mm</td>' +
                     '<td>' + maxFocalLength + ' mm</td>' +
                     '<td>f/' + lens.MaxAperture + '</td>' +
                     '<td>' + (lens.LinearMotor ? 'Yes' : 'No') + '</td>' +
                     '<td>' + (lens.ImageStabilization ? 'Yes' : 'No') + '</td>' +
                     '<td>' + (lens.ApertureRing ? 'Yes' : 'No') + '</td>' +
                     '<td>' + (lens.WeatherResistant ? 'Yes' : 'No') + '</td>' +
                     '</tr>';
    });

    tableView += '</tbody></table>';

    return tableView;
}

// Function to generate the placeholder for focal map view
function generateFocalMapView() {
    var focalMapView = '<h2>Focal Map View</h2>' +
                       '<p>Content coming soon...</p>';
    return focalMapView;
}

// Function to load lenses data from JSON file and generate table
function loadLenses() {
    var fullFrameEquivalent = $("#switch1").is(":checked");
    var onlyFujifilm = $("#switch2").is(":checked");

    $.getJSON('lenses.json', function(data) {
        if (onlyFujifilm) {
            data = data.filter(function(lens) {
                return lens.Manufacturer.toLowerCase() === 'fujinon';
            });
        }

        $("#lensDisplayArea").html(generateTableView(data, fullFrameEquivalent));
    });
}
$(document).ready(function() {
    loadLenses();

    $("#switch1, #switch2, #switch3").change(function() {
        if ($("#switch3").is(":checked")) {
            $("#lensDisplayArea").html(generateFocalMapView());
        } else {
            loadLenses();
        }
    });

    $(document).on('click', 'th', function() {
        var table = $(this).parents('table').eq(0);
        var tbodies = table.find('tbody').toArray();
        var index = $(this).index();

        this.asc = !this.asc;
        // Clear the classes of all other column headers
        $('th').not(this).removeClass('asc desc');
        // Add asc or desc class to the clicked column header
        $(this).addClass(this.asc ? 'asc' : 'desc');

        tbodies.sort(function(a, b) {
            var valA = getCellValue($(a).find('tr').first(), index);
            var valB = getCellValue($(b).find('tr').first(), index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
    });

    if (!this.asc) {
        tbodies = tbodies.reverse();
    }

    tbodies.forEach(function(tbody) {
        table.append(tbody);
    });
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
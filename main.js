$(document).ready(function() {
    loadLenses();

    $("#switch1, #switch2, #switch3").change(function() {
        if ($("#switch3").is(":checked")) {
            loadLenses(true);
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
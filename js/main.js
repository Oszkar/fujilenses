$(document).ready(function () {
    loadLenses();

    $("#full-frame-switch, #3rd-party-switch, #focal-map-switch").change(function () {
        isFocalMapView = $("#focal-map-switch").is(":checked");
        isFullFrameEquivalent = $("#full-frame-switch").is(":checked");
        onlyFujifilm = $("#3rd-party-switch").is(":checked");
        loadLenses(isFocalMapView, isFullFrameEquivalent, onlyFujifilm);
    });

    $(document).on("click", "th", function() {
        var table = $(this).parents("table").eq(0);
        var tbodies = table.find("tbody").toArray();
        var index = $(this).index();

        this.asc = !this.asc;
        // Clear the classes of all other column headers
        $("th").not(this).removeClass("asc desc");
        // Add asc or desc class to the clicked column header
        $(this).addClass(this.asc ? "asc" : "desc");

        tbodies.sort(function (a, b) {
            var valA = getCellValue($(a).find("tr").first(), index);
            var valB = getCellValue($(b).find("tr").first(), index);
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
        });

        if (!this.asc) {
            tbodies = tbodies.reverse();
        }

        tbodies.forEach(function (tbody) {
            table.append(tbody);
        });
    });
});
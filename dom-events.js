(function (H, $) {
    var fireEvent = H.fireEvent;
    H.wrap(H.Pointer.prototype, 'init', function (proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var pointer = this,
            container = pointer.chart.container;

        container.oncontextmenu = function (e) {
            pointer.onContainerContextMenu(e);
            e.stopPropagation();
            e.preventDefault();
            return false;
        };
    });

    if(!H.Pointer.prototype.hasOwnProperty("onContainerContextMenu")) {
        H.Pointer.prototype.onContainerContextMenu = function (e) {
            var pointer = this,
                chart = pointer.chart,
                hoverPoint = chart.hoverPoint,
                plotLeft = chart.plotLeft,
                plotTop = chart.plotTop;

            e = this.normalize(e);

            if (!chart.cancelClick) {
                // On tracker click, fire the series and point events. #783, #1583
                if (hoverPoint && this.inClass(e.target, 'tracker')) {

                    // the series click event
                    fireEvent(hoverPoint.series, 'contextmenu', $.extend(e, {
                        point: hoverPoint
                    }));

                    // the point click event
                    if (chart.hoverPoint) {
                        hoverPoint.firePointEvent('contextmenu', e);
                    }
                } else {
                    $.extend(e, this.getCoordinates(e));
                    if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
                        fireEvent(chart, 'contextmenu', e);
                    }
                }
            }
        }
    }
}(Highcharts, jQuery));
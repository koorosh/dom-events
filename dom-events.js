'use strict';
(function (H, $) {
    var fireEvent = H.fireEvent;

    H.wrap(H.Pointer.prototype, 'init', function (proceed) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        var pointer = this,
            container = pointer.chart.container,
            DELAY = 500, clicks = 0, timer = null;

        container.oncontextmenu = function (e) {
            pointer.onContainerContextMenu(e);
        };

        container.onwheel = function (e) {
            pointer.onWheel(e);
        };

        // Override default click event handler by adding delay to handle double-click event
        container.onclick = function (e) {
            clicks++;
            if(clicks === 1) {
                timer = setTimeout(function() {
                    pointer.onContainerClick(e);
                    clicks = 0;
                }, DELAY);
            } else {
                clearTimeout(timer);
                clicks = 0;
            }
        };

        container.ondblclick = function (e) {
            pointer.onDblClick(e);
            clicks = 0;
        };
    });

    if(!H.Pointer.prototype.hasOwnProperty('onContainerContextMenu')) {
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
        };
    }

    if(!H.Pointer.prototype.hasOwnProperty('onWheel')) {
        H.Pointer.prototype.onWheel = function (e) {
            var pointer = this,
                chart = pointer.chart,
                plotLeft = chart.plotLeft,
                plotTop = chart.plotTop;

            e = this.normalize(e);

            $.extend(e, this.getCoordinates(e));
            if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
                fireEvent(chart, 'wheel', e);
            }
        };
    }

    var applyClickEventHandler = function( eventtype, propertyName ) {
        if(!H.Pointer.prototype.hasOwnProperty(propertyName)) {
            H.Pointer.prototype[propertyName] = function (e) {
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
                        fireEvent(hoverPoint.series, eventtype, $.extend(e, {
                            point: hoverPoint
                        }));

                        // the point click event
                        if (chart.hoverPoint) {
                            hoverPoint.firePointEvent(eventtype, e);
                        }
                    } else {
                        $.extend(e, this.getCoordinates(e));
                        if (chart.isInsidePlot(e.chartX - plotLeft, e.chartY - plotTop)) {
                            fireEvent(chart, eventtype, e);
                        }
                    }
                }
            };
        }
    };

    applyClickEventHandler('contextmenu', 'onContainerContextMenu');

    applyClickEventHandler('dblclick', 'onDblClick');


}(Highcharts, jQuery));
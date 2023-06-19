import {useEffect, useRef} from "react";
import {StockRecord, AdjustedStockRecord, DailyAdjustedStockRecord} from "../../../types/timeseries";
import * as d3 from "d3";

interface CandleStickChartProps {
    stockRecords: (StockRecord | AdjustedStockRecord | DailyAdjustedStockRecord)[];
}

export default function CandleStickChart({stockRecords}: CandleStickChartProps) {

    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {

        const width = 1200;
        const height = 600;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        if (!stockRecords || stockRecords.length === 0 || !chartRef.current) {
            return;
        }

        const firstTimestamp = stockRecords[0].timestamp;
        const lastTimestamp = stockRecords[stockRecords.length - 1].timestamp;
        const lastTimestampPlusOneDay = new Date(lastTimestamp);
        lastTimestampPlusOneDay.setDate(lastTimestampPlusOneDay.getDate() + 1);

        // Scale for X-axis (time)
        const xScale = d3.scaleTime()
            // .domain([firstTimestamp, lastTimestampPlusOneDay]) // Define the range of dates
            .domain([lastTimestampPlusOneDay, firstTimestamp]) // Define the range of dates
            .range([marginLeft, width - marginRight]); // And map that range to pixels values

        function findYMinMax(stockRecords: (StockRecord | AdjustedStockRecord | DailyAdjustedStockRecord)[]) {
            let yMin = Number.POSITIVE_INFINITY;
            let yMax = Number.NEGATIVE_INFINITY;

            for (const record of stockRecords) {
                if (record.low !== undefined && record.low < yMin) {
                    yMin = record.low;
                }
                if (record.high !== undefined && record.high > yMax) {
                    yMax = record.high;
                }
            }

            yMin = isFinite(yMin) ? yMin : 0;  // default min value
            yMax = isFinite(yMax) ? yMax : 1;  // default max value
            return {yMin, yMax}
        }

        let {yMin, yMax} = findYMinMax(stockRecords)

        // Scale for Y-axis (price)
        const yScale = d3.scaleLinear()
            .domain([yMin, yMax]) // Lowest and highest price
            .range([height - marginBottom, marginTop]); // pixels from top to bottom

        const svg = d3.select(chartRef.current)
            .attr("viewBox", [0, 0, width, height])

        svg.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width - marginLeft - marginRight)
            .attr('height', height - marginTop - marginBottom)
            .attr('x', marginLeft)
            .attr('y', marginTop);

        // Append the x-axis.
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(xScale));  // d3.axisBottom creates the x-axis

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(yScale));  // d3.axisLeft creates the y-axis

        const g = svg.append("g")
            .attr("class", "candle")
            .attr("clip-path", "url(#clip)") // Apply clipping path
            // .attr("stroke-linecap", "round")
            .attr("stroke", "black")
            .selectAll("g")
            .data(stockRecords)
            .join("g")
            .attr("transform", d => `translate(${xScale(d.timestamp)},0)`);

        // Define the size of the candles.
        let barWidth = Math.min((width - marginLeft - marginRight) / stockRecords.length, 10);

        g.append("line")
            .attr("class", d => d.open > d.close ? "candle-fall" : "candle-rise")
            .attr("y1", d => yScale(d.low))
            .attr("y2", d => yScale(d.high));


        g.append("line")
            .attr("class", d => d.open > d.close ? "candle-fall" : "candle-rise")
            .attr("y1", d => yScale(d.open))
            .attr("y2", d => yScale(d.close))
            .attr("stroke-width", barWidth)
            .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0] : d.close > d.open ? d3.schemeSet1[2] : d3.schemeSet1[8]);


        // Here we create the zoom behavior
        const maxZoom = Math.max(1, stockRecords.length / 10);
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, maxZoom]) // This controls how much you can zoom in and out
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", function (event) {


                // Rescale the x-axis during zoom
                const xz = event.transform.rescaleX(xScale);
                // const yz = event.transform.rescaleY(yScale);
                let [x0, x1] = xz.domain();

                // Filter the records that are within the current domain.
                const visibleRecords = stockRecords.filter(d => {
                    const t = d.timestamp;
                    return t >= x0 && t <= x1;
                });

                // Assume that stockRecords are sorted by date.
                // Compute the width of one bar in screen space.
                // We subtract one date's worth of width to avoid overlap.
                const newBarWidth = Math.max(1, (xz(stockRecords[0].timestamp) - xz(stockRecords[1].timestamp)) * 0.7);
                // Calculate new bar width

                // Remove the old axis from the SVG
                svg.selectAll(".x-axis").remove();
                svg.selectAll(".y-axis").remove();
                svg.selectAll("line").remove()

                // Append the new axis
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0,${height - marginBottom})`)
                    .call(d3.axisBottom(xz));

                let {yMin, yMax} = findYMinMax(visibleRecords);

                const yz = d3.scaleLinear()
                    .domain([yMin, yMax]) // Lowest and highest price
                    .range([height - marginBottom, marginTop]); // pixels from top to bottom


                svg.append("g")
                    .attr("class", "y-axis")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .call(d3.axisLeft(yz));

                g.append("line")
                    .attr("class", d => d.open > d.close ? "candle-fall" : "candle-rise")
                    .attr("y1", d => yz(d.low))
                    .attr("y2", d => yz(d.high));


                g.append("line")
                    .attr("class", d => d.open > d.close ? "candle-fall" : "candle-rise")
                    .attr("y1", d => yz(d.open))
                    .attr("y2", d => yz(d.close))
                    .attr("stroke-width", newBarWidth)
                    .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0] : d.close > d.open ? d3.schemeSet1[2] : d3.schemeSet1[8]);

                // Update the bars and lines with the new scale
                g.attr("transform", d => `translate(${xz(d.timestamp)},0)`);
            });

        svg.call(zoom)
        console.log(xScale(lastTimestamp))

    }, [stockRecords]);


    return (
        <svg ref={chartRef}/>);
}

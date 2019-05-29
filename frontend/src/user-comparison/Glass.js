import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

const width = 100
const height = 100
const glassTop = 50
const glassBottom = 50

const drawGlassContainer = svg => () => {
  const radialAreaGenerator = d3.radialArea()
  .angle(d => d.angle)
  .innerRadius(d => d.r0)
  .outerRadius(d => d.r1)

  const points = [
    {angle: 0, r0: glassTop, r1: 50},
    {angle: Math.PI * 0.25, r0: 70, r1: 100},
    {angle: Math.PI * 0.8, r0: 65, r1: 100},
    {angle: Math.PI, r0: glassBottom, r1: 100},
    {angle: Math.PI * 1.2, r0: 65, r1: 100},
    {angle: Math.PI * 1.75, r0: 70, r1: 100},
    {angle: Math.PI * 2, r0: glassTop, r1: 100}
  ]

  d3.select(svg.current)
    .selectAll('g.container')
    .append('path')
    .datum(points)
    .attr('d', radialAreaGenerator)
    .attr('fill', 'white')
    .attr('stroke', '#ddd')
}

function Glass (props) {
  const svg = useRef(null)

  useEffect(drawGlassContainer(svg), [])
  useEffect(() => {
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([-100, 100])

    const colorScale = d3.scaleLinear().range(['red', 'yellowgreen', 'green']).domain([-100, 20, 100])

    const howFull = (props.positive - props.negative) * 100

    const liquid = d3.select(svg.current)
      .selectAll('.liquid')
      .selectAll('rect')
      .data([howFull])

    liquid.exit().remove()

    liquid.enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => yScale(d))
      .attr('height', d => height - yScale(d))
      .attr('width', width)
      .attr('fill', d => colorScale(d))

    liquid
      .attr('y', d => yScale(d))
      .attr('height', d => height - yScale(d))
      .attr('fill', d => colorScale(d))
  }, [props.negative, props.positive])

  return (
    <svg ref={svg} height={height} width={width} >
      <rect height={height} width={width} fill='#eee' />
      <g className='liquid' />
      <g className='container' transform={`translate(${width / 2}, ${height / 2})`} />
    </svg>
  )
}

Glass.propTypes = {
  positive: PropTypes.number.isRequired,
  negative: PropTypes.number.isRequired
}

export default Glass

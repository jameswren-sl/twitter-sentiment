import React, { useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import * as d3 from 'd3'

const percentFormat = d3.format('.0%')
const padding = 5
const startAngle = Math.PI * -0.7
const endAngle = Math.PI * 0.7

function ScaleGraph (props) {
  const container = useRef(null)
  const cache = useRef(props.percentage)

  const width = 200
  const height = 200

  useEffect(() => {
    const prev = cache.current

    const scale = d3.scaleLinear()
      .domain([0, 1])
      .range([startAngle, endAngle])

    const arc = d3.arc()
      .startAngle(startAngle)
      .innerRadius((width / 2) * 0.7)
      .outerRadius(width / 2 - padding)
      .cornerRadius(4)

    const g = d3.select(container.current)

    g.selectAll('path.track')
      .attr('fill', '#ccc')
      .attr('stroke', '#bbb')
      .attr('stroke-width', '2px')
      .attr('d', arc.endAngle(endAngle))

    const arcTween = d => {
      const interpolate = d3.interpolate(prev, props.percentage)

      return t => arc.endAngle(scale(interpolate(t)))()
    }

    const fill = g.selectAll('path.fill')
      .data([props.percentage])

    fill.exit().remove()

    fill.enter()
      .append('path')
      .attr('class', 'fill')
      .attr('fill', props.color)
      .transition()
      .duration(750)
      .attrTween('d', arcTween)

    fill
      .transition()
      .attrTween('d', arcTween)

    const text = g.selectAll('text')
      .data([props.percentage])

    text.exit().remove()

    text.enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.4em')
      .attr('font-size', `${width / 5}px`)
      .text(d => percentFormat(d))

    text
      .transition()
      .duration(750)
      .tween('text', (d, i, nodes) => {
        const interpolate = d3.interpolate(prev, props.percentage)

        return t => d3.select(nodes[0]).text(percentFormat(interpolate(t)))
      })
      // .text(d => percentFormat(d))

    cache.current = props.percentage
  }, [props.color, props.percentage])

  return (
    <svg width={width} height={height} >
      <g ref={container} transform={`translate(${width / 2}, ${height / 2})`} >
        <path className='track' />
      </g>
      <text x={width / 2} y={height - 20} textAnchor='middle' fill={props.color}>
        { props.title }
      </text>
    </svg>
  )
}

ScaleGraph.propTypes = {
  title: propTypes.string.isRequired,
  percentage: propTypes.number.isRequired,
  color: propTypes.string
}

export default ScaleGraph

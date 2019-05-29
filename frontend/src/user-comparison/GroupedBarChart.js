import React, { useRef, useEffect, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

const height = 200
const margin = { top: 5, bottom: 20, left: 50, right: 15 }

function GroupedBarChart (props) {
  const { data } = props
  const g = useRef(null)
  const container = useRef(null)
  const [width, setWidth] = useState(300)

  useLayoutEffect(() => setWidth(container.current.getBoundingClientRect().width), [])

  useEffect(() => {
    const onResize = () => {
      if (container.current && container.current.getBoundingClientRect().width !== width) {
        setWidth(container.current.getBoundingClientRect().width)
      }
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })

  useEffect(() => {
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width - margin.left - margin.right])

    const y0 = d3
      .scaleBand()
      .domain(data.map(d => d.category))
      .range([0, height - margin.top - margin.bottom])

    const y1 = d3.scaleBand()
      .domain(d3.range(2))
      .range([10, y0.bandwidth()])

    const colors = d3.scaleOrdinal(d3.schemeCategory10)

    const categoryBars = d3.select(g.current)
      .selectAll('.bars')
      .selectAll('.bar')
      .data(data, d => d.category)

    categoryBars.exit().remove()

    categoryBars
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', d => `translate(0, ${y0(d.category)})`)
      .selectAll('rect')
      .data(d => d.data)
      .enter()
      .append('rect')
      .attr('fill', (d, i) => colors(i))
      .attr('width', x)
      .attr('height', y1.bandwidth())
      .attr('x', 0)
      .attr('y', (d, i) => y1(i))

    const bars = categoryBars
      .selectAll('rect')
      .data(d => d.data)

    bars.exit().remove()

    bars
      .enter()
      .append('rect')
      .attr('fill', (d, i) => colors(i))
      .attr('width', x)
      .attr('height', y1.bandwidth())
      .attr('x', 0)
      .attr('y', (d, i) => y1(i))

    bars
      .attr('width', x)
      .attr('height', y1.bandwidth())
      .attr('x', 0)
      .attr('y', (d, i) => y1(i))

    d3.select(g.current)
      .selectAll('.xAxis')
      .call(d3.axisBottom(x).tickFormat(d3.format('.0%')))

    d3.select(g.current)
        .selectAll('.yAxis')
        .call(d3.axisLeft(y0))
  }, [data, width])

  return (
    <div ref={container}>
      <svg height={height} width={width} >
        <g className='container' ref={g} transform={`translate(${margin.left}, ${margin.top})`}>
          <g className='bars' />
          <g className='xAxis' transform={`translate(0, ${height - margin.top - margin.bottom})`} />
          <g className='yAxis' />
        </g>
      </svg>
    </div>
  )
}

GroupedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.number)
  }))
}

export default GroupedBarChart

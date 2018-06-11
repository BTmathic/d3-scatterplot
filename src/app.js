import 'normalize.css/normalize.css';
import './styles/styles.scss';
import * as d3 from 'd3';

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then((response) => {
  return response.json();
}).then((data) => {
  let margin;
  let height, width;
  let x, y;
  let legendTime, legendPlace;

  let svg = d3.select('#container').append('svg');
  let popup = d3.select('body').append('div');

  main();

  function main() {
    //document.body.style.height = window.clientHeight + 'px';
    popup.attr('class', 'tooltip')
      .style('opacity', 0);

    setSizes();
    //document.body.style.width = window.clientWidth + 'px';
    drawGraph();
  }

  function setSizes() {
    margin = { top: 10, right: 40, bottom: 50, left: 50 };
    height = 450 - margin.top - margin.bottom;
    width = 850 - margin.left - margin.right;
    x = d3.scaleTime().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    x.domain([new Date(1969, 0, 0, 0, 0, 40 * 60), new Date(1969, 0, 0, 0, 0, 36 * 60)]);
    y.domain([37, 0]);

    legendTime = 2190;
    legendPlace = 20;
  }

  function drawGraph() {
    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top+height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%M:%S')));

    svg.append('text')
      .attr('y', height + margin.bottom)
      .attr('x', height)
      .style('text-anchor', 'middle')
      .text('Ascent Time for the 13.8km climb');

    svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(y));

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 0.9 * margin.right)
      .attr('x', 0 - height / 2)
      .style('text-anchor', 'middle')
      .text('Rank among top 35');

    svg.append('g').selectAll('dot')
      .data(data).enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d) => x(new Date(1969, 0, 0, 0, 0, d.Seconds)))
      .attr('cy', (d) => y(d.Place))
      .attr('fill', (d) => !!d.Doping ? '#f44' : '#333')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .on('mouseover', (d) => mouseover(d))
      .on('mouseout', mouseout);

    setNames();
    setLegend();
  }

  function mouseover(d) {
    popup.transition()
      .duration(200)
      .style('opacity', 0.9)
    popup.html(`
          <div><span id='name'>${d.Name}</span> - <span id='nationality'>${d.Nationality}</span></div>
          <div id='second-row'><span id='year'>${d.Year}</span> - <span id='time'>${(d.Time)}</span></div>
          <div id='doping'>${d.Doping}</div>
          `)
      .style('left', (d3.event.pageX + 5) + 'px')
      .style('top', (d3.event.pageY - 50) + 'px')
  }

  function mouseout() {
    popup.transition()
      .duration(500)
      .style('opacity', 0)
  }

  function setNames() {
    svg.append('g').selectAll('text')
      .data(data).enter()
      .append('text')
      .text((d) => d.Name)
      .style('font-size', '12px')
      .attr('x', (d) => x(new Date(1969, 0, 0, 0, 0, d.Seconds)))
      .attr('y', (d) => y(d.Place))
      .attr('transform', `translate(${15+margin.left},${5+margin.top})`);
  }

  function setLegend() {
    svg.append('g').append('circle')
      .attr('r', 5)
      .attr('cx', (d) => x(new Date(1969, 0, 0, 0, 0, legendTime)))
      .attr('cy', (d) => y(legendPlace))
      .attr('fill', '#f44');

    svg.append('g').append('text')
      .attr('x', (d) => x(new Date(1969, 0, 0, 0, 0, legendTime - 4)))
      .attr('y', (d) => y(legendPlace) + 4)
      .attr('text-anchor', 'left')
      .style('font-size', '12px')
      .text('Doping allegations');

    svg.append('g')
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d) => x(new Date(1969, 0, 0, 0, 0, legendTime)))
      .attr('cy', (d) => y(legendPlace + 1.5))
      .attr('fill', '#333');

    svg.append('g').append('text')
      .attr('x', (d) => x(new Date(1969, 0, 0, 0, 0, legendTime - 4)))
      .attr('y', (d) => y(legendPlace + 1.5) + 4)
      .attr('text-anchor', 'left')
      .style('font-size', '12px')
      .text('No doping allegations');
  }
});
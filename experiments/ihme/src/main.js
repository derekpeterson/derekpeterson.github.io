var _clone = require('lodash/lang/cloneDeep');
var d3 = require('d3');
var q = require('q');

function loadData (url) {
  var dfd = q.defer();
  d3.csv(url, function (data) {
    dfd.resolve(data);
  });
  return dfd.promise;
}

function cleanData (data) {
  return data.map(function (d) {
    var clean = _clone(d);
    clean.year = +d.year;
    clean.mean = +d.mean;
    clean.location_id = +d.location_id;
    return clean;
  });
}

function filterData (data, ageGroup) {
  return data.filter(function (d) {
    return d.metric === 'overweight'
      && d.measure === 'prevalence'
      && d.sex_id === '3'
      && d.age_group_id === ageGroup
      && /^R[0-9]{1,2}$/.exec(d.location);
  });
}

function buildVisualization (data, book, locs) {
  var height = 300;
  var width = 960;
  var padding = 30;
  var yearStart = 1990;
  var yearEnd = 2013;

  var stack = d3.layout.stack()
    .values(function (d) {
      return d.values;
    })
    .x(function (d) {
      return d.year;
    })
    .y(function (d) {
      return d.mean;
    });

  var nestData = d3.nest()
    .key(function (d) {
      return d.location;
    });
  var adults = stack(nestData.entries(filterData(data, '38')));
  var kids = stack(nestData.entries(filterData(data, '36')));

  var x = d3.scale.linear()
    .domain([yearStart, yearEnd])
    .range([padding, width - padding]);
  var y = d3.scale.linear()
    .domain([0, d3.max(adults.concat(kids), function (layer) {
      return d3.max(layer.values, function (d) {
        return d.y + d.y0;
      });
    })])
    .range([height, 0]);
  var color = d3.scale.linear()
    .range(['#099', '#bee']);

  var area = d3.svg.area()
    .x(function (d) {
      return x(d.year);
    })
    .y0(function (d) {
      return y(d.y0);
    })
    .y1(function (d) {
      return y(d.y0 + d.y);
    });

  var container = d3.select('#obesity-visualization');

  var viz = container.append('svg')
    .attr('height', height + padding)
    .attr('width', width + padding);

  var tooltip = container.append('div')
    .attr('class', 'visualization-tooltip')
    .style('opacity', '0');

  var select = d3.select('.visualization-action')
    .on('change', function () {
      var option = this['visualization-action-selection'].value;
      viz.selectAll('path')
        .data(function () {
          return option === '0' ? adults : kids;
        })
        .transition()
          .duration(2000)
          .attr('d', function (d) {
            return area(d.values);
          });
    });

  var path = viz.append('g')
    .selectAll('path')
      .data(adults)
    .enter().append('path')
      .attr('d', function (d) {
        return area(d.values);
      })
      .style('fill', function (d) {
        return color(Math.random());
      })
      .on('mouseover', function (d, i) {
        tooltip.style('opacity', 1);
      })
      .on('mousemove', function (d, i) {
        var datum = d.values[i];
        tooltip.text(datum.location_name)
          .style('top', (d3.event.pageY + 3) + 'px')
          .style('left', (d3.event.pageX + 3) + 'px');
      })
      .on('mouseout', function (d) {
        tooltip.style('opacity', 0);
      });

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(yearEnd - yearStart)
    .tickFormat(d3.format('d'));

  viz.append('g')
    .attr('class', 'visualization-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
}

window.addEventListener('DOMContentLoaded', function () {
  q.all([
    loadData(__DATA_PATH__ + '/obesity-data.csv'),
    loadData(__DATA_PATH__ + '/obesity-code-book.csv'),
    loadData(__DATA_PATH__ + '/location-code-book.csv')
  ]).done(function (values) {
    buildVisualization(
      cleanData(values[0]),
      values[1],
      d3.map(values[2], function (d) { return d.location; })
    );
  });
});

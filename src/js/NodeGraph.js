define(function (require) {

	// draggable
	// zoomable
	// control connections between nodes?

	var Events = require('Events');
	var NodeElement = require('nodes/NodeElement');

	function NodeGraph(container) {

		new Events(this);

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;
		container.appendChild(svg);

		var paper = Snap(svg);
		window.paper = paper; // debugging

		var nodes = [
			new NodeElement(paper),
			new NodeElement(paper),
			new NodeElement(paper),
			new NodeElement(paper),
			new NodeElement(paper),
			new NodeElement(paper)
		];

		var selectedNode;
		var fromNodeType;
		for (var i = 0, maxi = nodes.length; i < maxi; i++) {
			(function () {
				var node = nodes[i];
				var nodeEl = node.element;

				nodeEl.click(function () {
					var selected = paper.selectAll('.node.selected');
					for (var j = 0, maxj = selected.length; j < maxj; j++) {
						selected[j].removeClass('selected');
					}
					selectedNode = node;
					nodeEl.addClass('selected');
				});
				node.on('createEdge', function (fromType) {
					fromNodeType = fromType;
				});

				function onDrag() {

					var edges = paper.selectAll('line.edge');

					// get all of the edges and see if their position needs updating
					for (var i = 0, maxi = edges.length; i < maxi; i++) {

						var edge = edges[i];

						var nodes = edge.data('nodes');
						var width = nodes.input.getBBox().width;
						var height = nodes.input.getBBox().height;

						var m1 = nodes.input.matrix ? nodes.input.matrix : {e: 0, f: 0};
						var m2 = nodes.output.matrix ? nodes.output.matrix : {e: 0, f: 0};
						edge.attr({
							x1: m1.e,
							y1: m1.f + height / 2,
							x2: m2.e + width,
							y2: m2.f + height / 2
						});
					}

				}
				node.on('drag', onDrag);

				node.on('releaseEdge', function (edge) {

					var hoveredNodeEl = paper.select('.node.hover');

					if (hoveredNodeEl) {
						//get type by assuming the opposite of fromType
						var hoveredType = fromNodeType == 'output' ? 'input' : 'output';
						if (hoveredNodeEl != node.element) { // don't connect a node to itself

							//keep reference to the two nodes it's connecting
							var _in = hoveredType == 'input' ? hoveredNodeEl : node.element;
							var _out = hoveredType == 'output' ? hoveredNodeEl : node.element;
							edge.data('nodes', {
								input: _in,
								output: _out
							});
							edge.attr({
								stroke: '#fff',
								strokeWidth: 2,
								class: 'edge'
							});

							onDrag();

						}
					} else {
						edge.remove();
					}

				});


			})();
		}

	}

	return NodeGraph;
});

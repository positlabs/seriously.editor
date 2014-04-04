define(function (require) {

	// draggable
	// zoomable
	// control connections between nodes?

	function NodeGraph(container) {

		//TODO: remove ox dependency. just use ox Events
		new ox.Events(this);

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;
		container.appendChild(svg);

		var paper = Snap(svg);
		window.paper = paper; // debugging

		var nodes = [
			new SNode(paper),
			new SNode(paper),
			new SNode(paper),
			new SNode(paper),
			new SNode(paper)
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

				node.on('drag', function () {

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

				});

				node.on('releaseEdge', function (edge) {

					var hoveredNodeEl = paper.select('.node.hover');

					if (hoveredNodeEl) {
						//get type by assuming the opposite of fromType
						var hoveredType = fromNodeType == 'output' ? 'input' : 'output';
						if (hoveredNodeEl != node.element) { // don't connect a node to itself

							// TODO: snap to the appropriate terminal
							var x1 = edge.attr("x1");
							var x2 = edge.attr("x2");
							var y1 = edge.attr("y1");
							var y2 = edge.attr("y2");

							var clonedEdge = paper.line(x1, y1, x2, y2);

							clonedEdge.attr({
								stroke: '#fff',
								strokeWidth: 2,
								class: 'edge'
							});

							//keep reference to the two nodes it's connecting
							var _in = hoveredType == 'input' ? hoveredNodeEl : node.element;
							var _out = hoveredType == 'output' ? hoveredNodeEl : node.element;
							clonedEdge.data('nodes', {
								input: _in,
								output: _out
							});

							paper.prepend(clonedEdge);
						}
					}

				});
			})();
		}

	}

	/**
	 Node component. stores options for seriously nodes.
	 All public data should be stored via Snap's Element.data()
	 This Class is just for setting up interaction rules... maybe...
	 */
	function SNode(paper) {
		var _this = this;
		new ox.Events(this);

		var r = paper.rect(0, 0, 100, 33);
		r.attr({
			fill: "#fff"
		});

		r.click(function () {
			_this.trigger('click');
		});

		var inputRect = paper.rect(0, 0, 10, 33);
		inputRect.attr({
			connectionType: 'input',
			fill: '#999',
			class: 'terminal'
		});

		inputRect.mousedown(stopPropagation);
		inputRect.mousedown(createEdge);

		var outputRect = paper.rect(90, 0, 10, 33);
		outputRect.attr({
			connectionType: 'output',
			fill: '#999',
			class: 'terminal'
		});
		outputRect.mousedown(stopPropagation);
		outputRect.mousedown(createEdge);

		var ghostEdge;

		function stopPropagation(e) {
			e.stopPropagation();
		}

		function createEdge(e) {
			ghostEdge = paper.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY);
			ghostEdge.attr({stroke: '#fff'});
			paper.prepend(ghostEdge);
			_this.trigger('createEdge', e.target.getAttribute('connectionType'));
			document.body.addEventListener('mouseup', releaseEdge);
			document.body.addEventListener('mousemove', dragEdge);
		}

		function dragEdge(e) {
			ghostEdge.attr({
				x2: e.offsetX,
				y2: e.offsetY
			});
		}

		function releaseEdge(e) {
			document.body.removeEventListener('mouseup', releaseEdge);
			document.body.removeEventListener('mousemove', dragEdge);
			_this.trigger('releaseEdge', ghostEdge);
			ghostEdge.remove();
		}

		function onDrag() {
			_this.trigger('drag', _this);
		}

		var nodeEl = paper.g(r, inputRect, outputRect);
		nodeEl.addClass('node');
		nodeEl.drag();
		nodeEl.drag(onDrag); // need this so we can dispatch events. default behavior doesn't work if we pass a handler

		// have to do this manually due to some wierdness with drag behavior stopping hover event propagation...
		nodeEl.mouseover(function () {
			nodeEl.addClass('hover');
		});
		nodeEl.mouseout(function () {
			nodeEl.removeClass('hover');
		});

		this.element = nodeEl;
		nodeEl.data('snode', this);
	}

	new ox.Events(SNode.prototype);

	return NodeGraph;
});

define(function (require) {

	// draggable
	// zoomable
	// control connections between nodes?

	function NodeGraph(container) {

		ox('body');
		new ox.Events(this);

		var edges = []; //TODO: HWAT THE FUCK. can't select

		var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.width = window.innerWidth;
		svg.height = window.innerHeight;
		container.appendChild(svg);

		var paper = Snap(svg);
		console.log("paper", paper);

		var nodes = [
			new SNode(paper),
			new SNode(paper),
			new SNode(paper),
			new SNode(paper),
			new SNode(paper)
		];

		var selectedNode;
		var hoveredNodeInput;
		var hoveredNodeOutput;
		var fromNodeType;
		for (var i = 0, maxi = nodes.length; i < maxi; i++) {
			(function () {
				var node = nodes[i];
				node.on('click', function () {
					selectedNode = node;
				});
				node.on('createEdge', function (fromType) {
					fromNodeType = fromType;
				});

				//TODO: do some kind of dom selection to grab hovered element instead of keeping track of it here
				node.on('mouseover:input', function () {
					hoveredNodeInput = node;
				});
				node.on('mouseover:output', function () {
					hoveredNodeOutput = node;
				});
				node.on('mouseout:input', function () {
					hoveredNodeInput = undefined;
				});
				node.on('mouseout:output', function () {
					hoveredNodeOutput = undefined;
				});

				node.on('drag', function () {

						console.log("edges",edges);
					// get all of the edges and see if their position needs updating
					for (var i = 0, maxi = edges.length; i < maxi; i++) {
						var edge = edges[i];

						var nodes = edge.data('nodes');
						var width = nodes.input.element.getBBox().width;

						console.log("width",width);
						var height = nodes.input.element.getBBox().height;
						console.log("height",height);

						var m1 = nodes.input.element.matrix ? nodes.input.element.matrix : {e:0, f:0};
						var m2 = nodes.output.element.matrix ? nodes.output.element.matrix : {e:0, f:0};
						edge.attr({
							x1: m1.e,
							y1: m1.f + height / 2,
							x2: m2.e + width,
							y2: m2.f + height / 2
						});
					}

				});

				node.on('releaseEdge', function (edge) {

					if (hoveredNodeInput || hoveredNodeOutput) {
						// hovered node exists. get reference to it.
						var hovered = hoveredNodeInput ? hoveredNodeInput : hoveredNodeOutput;
						var hoveredType = hoveredNodeInput ? 'input' : 'output';

						// check that it's an input/output pair somehow. Can't have inputs connecting to inputs.
						if (hoveredType == fromNodeType) return;

						if (hovered != node) { // don't connect a node to itself

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
							var _in = hoveredType == 'input' ? hovered : node;
							var _out = hoveredType == 'output' ? hovered : node;
							clonedEdge.data('nodes', {
								input: _in,
								output: _out
							});
							edges.push(clonedEdge);

							paper.prepend(clonedEdge);

						}
					}

				});
			})();
		}

	}

//	new ox.Events(NodeGraph.prototype);

	/*
	 Node component
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
		inputRect.attr({connectionType: 'input'});
		inputRect.attr({fill: '#999'});

		inputRect.mousedown(stopPropagation);
		inputRect.mouseover(function () {
			_this.trigger('mouseover:input');
		});
		inputRect.mouseout(function () {
			_this.trigger('mouseout:input');
		});
		inputRect.mousedown(createEdge);

		var outputRect = paper.rect(90, 0, 10, 33);
		outputRect.attr({connectionType: 'output'});
		outputRect.attr({fill: '#999'});
		outputRect.mousedown(stopPropagation);
		outputRect.mousedown(createEdge);
		outputRect.mouseover(function () {
			_this.trigger('mouseover:output');
		});
		outputRect.mouseout(function () {
			_this.trigger('mouseout:output');
		});
		document.body.on('mousemove', dragEdge);

		var edgeDragging = false;
		var newEdge;

		function stopPropagation(e) {
			e.stopPropagation();
		}

		function createEdge(e) {
			newEdge = paper.line(e.offsetX, e.offsetY, e.offsetX, e.offsetY);
			newEdge.attr({stroke: '#fff'});
			edgeDragging = true;
			_this.trigger('createEdge', e.target.getAttribute('connectionType'));
			document.body.on('mouseup', releaseEdge);
		}

		function dragEdge(e) {
			if (!edgeDragging) return;
			newEdge.attr({
				x2: e.offsetX,
				y2: e.offsetY
			});
		}

		function releaseEdge(e) {
			edgeDragging = false;
			document.body.off('mouseup', releaseEdge);
			_this.trigger('releaseEdge', newEdge);
			newEdge.remove();
		}

		function onDragStart() {
			_this.trigger('dragStart', _this);
		}

		function onDragEnd() {
			_this.trigger('dragEnd', _this);
		}

		function onDrag() {
			_this.trigger('drag', _this);
		}

		var node = paper.g(r, inputRect, outputRect);
		node.drag();
		node.drag(onDrag);
		this.element = node;

	}

	new ox.Events(SNode.prototype);

	return NodeGraph;
});

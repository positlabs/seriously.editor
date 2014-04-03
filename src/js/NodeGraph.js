define(function (require) {

	// draggable
	// zoomable
	// control connections between nodes?

	var SourceNode = require('nodes/SourceNode');

	function NodeGraph(container){

		var _this = this;
		this.nodes = [];
		this.container = container;

		this.addNode = function(node){
			node.element.on('click', function(){
				_this.selectNode(node);
			});
			this.nodes.push(node);
			this.container.appendChild(node.element);
		};

		this.selectNode = function(node){
			_this.trigger('selectNode', node);
		};

		//TEST
		var imgNode = new SourceNode(SourceNode.IMAGE);
		imgNode.source('images/colorbars.png');
		this.addNode(imgNode);

	}

	new ox.Events(NodeGraph.prototype);

	return NodeGraph;

});

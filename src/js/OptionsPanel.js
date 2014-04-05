define(function (require) {

	function OptionsPanel(container){

		this.canvas = document.createElement('canvas');
		this.canvas.width = container.offsetWidth;
		this.canvas.height = container.offsetHeight;

		container.appendChild(this.canvas);

		this.target = seriously.target(this.canvas);

	}

	OptionsPanel.prototype = {

		setNode:function(node){
			this.node = node;
			this.target.source = node.node; // show what the node's output looks like

			//TODO: parse node attributes into controls... somehow. Maybe look at the main seriously.js demo source
		}

	};

	return OptionsPanel;


});

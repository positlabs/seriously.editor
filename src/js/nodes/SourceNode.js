define(function (require) {

	var camera = require('seriously.sources/seriously.camera');
	var NodeElement = require('nodes/NodeElement');

	function SourceNode(type) {
		new ox.Events(this);
		this.type = type;

		this.element = new NodeElement('source');
	}

	SourceNode.prototype = {

		source: function (source) {
			switch (this.type) {
				case SourceNode.IMAGE:

					var img = document.createElement('img');
					img.src = source;
					this.node = seriously.source(img);

					break;
				case SourceNode.CAMERA:
					break;
				case SourceNode.VIDEO:
					break;

			}
		}

	};

	SourceNode.IMAGE = 'img';
	SourceNode.CAMERA = 'camera';
	SourceNode.VIDEO = 'video';

	return SourceNode;

});

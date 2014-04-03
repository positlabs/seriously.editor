define(function (require) {
	var NodeElement = function (type) {

		var element = ox.create('div');
		var body = ox('body');

		element.className = "node " + type;

		// draggable
		var offsets = {x: 0, y: 0};

		function onMouseDown(e) {
			offsets.x = e.x;
			offsets.y = e.y;
			body.on('mousemove', onMouseMove);
			body.on('mouseup', onMouseUp);
		}

		function onMouseMove(e) {
			element.ox.transform({x: e.x - offsets.x, y: e.y - offsets.y});
		}

		function onMouseUp(e) {
			body.off('mousemove', onMouseMove);
			body.off('mouseup', onMouseUp);
		}

		element.on('mousedown', onMouseDown);

		return element;
	};

	return NodeElement;
});

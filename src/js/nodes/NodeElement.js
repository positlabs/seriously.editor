define(function (require) {

		//TODO: make a proper prototype

	var Events = require('Events');

	/**
	 NodeElement
	 */

	function NodeElement(paper) {
		var _this = this;
		new Events(this);

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
		nodeEl.data('snode', this); //link the Snap Element to this controller in case we need to regain reference

		this.destroy
	}

	return NodeElement;

});

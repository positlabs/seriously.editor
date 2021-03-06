
/*

	Top-level controller

*/


define(function (require) {

	var NodeGraph = require('NodeGraph');
	var NodePicker = require('NodePicker');
	var OptionsPanel = require('OptionsPanel');
	require('SnapClassPlugin');

	window.seriously = new require('seriously')();

	function Editor(){

		var nodePicker = new NodePicker();
		var graph = new NodeGraph(document.querySelector('#node-graph'));
		var optionsPanel = new OptionsPanel(document.querySelector('#options-panel'));

		graph.on('selectNode', function(node){
			optionsPanel.setNode(node);
		});

		seriously.go();

	}

	return Editor;

});

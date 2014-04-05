define(["require_config"], function () {

	// lame entry point for managing globals

	require([
		'Editor',
		'underscore',
		'Snap'
	], function (Editor) {

		new Editor();

	});
});

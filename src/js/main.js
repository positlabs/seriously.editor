define(["require_config"], function () {

	// lame entry point for managing globals

	require([
		'Editor',
		'ox',
		'underscore'
	], function (Editor) {

		new Editor();

	});
});

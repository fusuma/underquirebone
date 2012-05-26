define([
		'backboneLoader',
		'models/Contact'
	],
	function(
		Backbone,
		Contact
	) {
		"use strict";
		
		return Backbone.Collection.extend({
			model: Contact
		});
	}
);

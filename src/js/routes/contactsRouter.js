define([
		'jqueryLoader',	//Included by default, but needed in less instances now that views have cached '$el'
		'underscoreLoader',
		'backboneLoader',
		'views/directoryView'
	],
	function(
		$,
		_,
		Backbone,
		DirectoryView
	) {
		"use strict";

		return Backbone.Router.extend({
			directory: null,

			initialize : function(options) {
				var self = this;
				self.directory = new DirectoryView(this);
			},

			routes: {
				"filter/:type" : "urlFilter"
			},

			urlFilter : function(type) {
				this.directory.filterType = type;
				this.directory.trigger("change:filterType");
			}
		});
	}
);

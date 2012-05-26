define([
		'views/directoryView',
		'backboneLoader',
		'routes/contactsRouter'
	],
	function(
		DirectoryView,
		Backbone,
		ContactsRouter
	) {
		"use strict";
		
		return {
			initialize : function() {
				var contactsRouter = new ContactsRouter();
				Backbone.history.start();
			}
		};
	}
);
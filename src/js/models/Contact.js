define([
		'backboneLoader'
	],
	function(
		Backbone
	) {
		"use strict";
		
		return Backbone.Model.extend({
			defaults: {
        		photo: "img/placeholder.png"
    		}
		});
	}
);

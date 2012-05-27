define([
		'backboneLoader'
	],
	function(
		Backbone
	) {
		"use strict";
		
		return Backbone.Model.extend({
			defaults: {
	            photo: "/img/placeholder.png",
	            name: "",
	            address: "",
	            tel: "",
	            email: "",
	            type: ""
	        },
	        url: function () {
	            return "/api/index.php?id=" + this.get("id");
	        }
		});
	}
);

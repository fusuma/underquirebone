define([
		'jqueryLoader',	//Included by default, but needed in less instances now that views have cached '$el'
		'underscoreLoader',
		'backboneLoader',
		'text!templates/contactTemplate.html',
		'text!templates/contactEditTemplate.html'
	],
	function(
		$,
		_,
		Backbone,
		contactTemplate,
		contactEditTemplate
	) {
		"use strict";

		return Backbone.View.extend({
			tagName: "article",
			className: "contact-container",
			template : _.template(contactTemplate),
			editTemplate : _.template(contactEditTemplate),
			
			initialize : function(params) {
				this.directory = params.directory;
				this.render();
			},

			events : {
				"click button.delete" : "deleteContact",
				"click button.edit" : "editContact",
				"change select.type": "addType",
            	"click button.save": "saveEdits",
            	"click button.cancel": "cancelEdit"
			},

			deleteContact : function() {
				var removedType = this.model.get("type").toLowerCase();

				this.model.destroy();

				this.remove();

				if(_.indexOf(this.directory.getTypes(), removedType) === -1) {
					this.directory.$el.find("#filter select").children("[value='"+removedType+"']").remove();
				}
			},

			editContact : function() {
				this.$el.html(this.editTemplate(this.model.toJSON()));

				var newOpt = $("<option>", {
					html: "<em>Add new...</em>",
					value: "addType"
				});

				this.select = this.directory.createSelect().addClass("type")
					.val(this.$el.find("#type").val()).append(newOpt)
					.insertAfter(this.$el.find(".name"));

				this.$el.find("input[type='hidden']").remove();
			},

			addType : function() {
				if (this.select.val() === "addType") {
	                this.select.remove();
	                $("<input />", {
	                    "class": "type"
	                }).insertAfter(this.$el.find(".name")).focus();
	            }
			},

			saveEdits: function (e) {
	            e.preventDefault();

	            var formData = {},
	                prev = this.model.previousAttributes();

	            //get form data
	            $(e.target).closest("form").find(":input").not("button").each(function () {
	                var el = $(this);
	                formData[el.attr("class")] = el.val();
	            });

	            //use default photo if none supplied
	            if (formData.photo === "") {
	                delete formData.photo;
	            }

	            //update model
	            this.model.set(formData);

	            //render view
	            this.render();

	            //if model acquired default photo property, remove it
	            if (prev.photo === "/img/placeholder.png") {
	                delete prev.photo;
	            }

	            //update contacts array
	            _.each(this.contacts, function (contact) {
	                if (_.isEqual(contact, prev)) {
	                    this.contacts.splice(_.indexOf(this.contacts, contact), 1, formData);
	                }
	            });
	        },

	        cancelEdit: function () {
	            this.render();
	        },
			
			render : function() {
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		});
	}
);

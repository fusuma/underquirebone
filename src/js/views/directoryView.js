define([
		'jqueryLoader',	//Included by default, but needed in less instances now that views have cached '$el'
		'underscoreLoader',
		'backboneLoader',
		'views/contactView',
		'models/Directory',
		'models/Contact'
	],
	function(
		$,
		_,
		Backbone,
		ContactView,
		Directory,
		Contact
	) {
		"use strict";

		return Backbone.View.extend({
			el: $("#contacts"),
			
			initialize : function(router) {

				 this.contacts = [
			        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
			        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
			        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
			        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
			        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
			    ];
			    this.router = router;
				this.collection = new Directory(this.contacts);
				this.$el.find("#filter").append(this.createSelect());

				this.on("change:filterType", this.filterByType, this);
				this.collection.on("reset", this.render, this);
				this.collection.on("add", this.renderContact, this);
				this.collection.on("remove", this.removeContact, this);
				this.render();
			},
			
			render : function() {
				var that = this;
				this.$el.find("article").remove();
				_.each(this.collection.models, function(item){
					that.renderContact(item);
				}, this)
			},

			events : {
				"change #filter select" : "setFilter",
				"click #add" : "addContact",
				"click #showForm": "showForm"
			},

			renderContact : function(item) {
				var contactView = new ContactView({
					model: item,
					directory: this
				});
				this.$el.append(contactView.render().el);
			},

			getTypes : function() {
				return _.uniq(this.collection.pluck("type"), false, function(type){
					return type.toLowerCase();
				});
			},

			createSelect : function() {
				var filter = this.$el.find("#filter"),
					select = $("<select/>", {
						html: "<option>all</option>" 
					});

				_.each(this.getTypes(), function(item){
					var option = $("<option/>", {
						value: item.toLowerCase(),
						text: item.toLowerCase()
					}).appendTo(select);
				})
				return select;
			},

			setFilter : function(e) {
				this.filterType = e.currentTarget.value;
				this.trigger("change:filterType");
			},

			filterByType : function() {
				if(this.filterType === "all") {
					this.collection.reset(this.contacts);
					this.router.navigate("filter/all");
				}
				else {
					this.collection.reset(this.contacts, { silent: true });

					var filterType = this.filterType,
						filtered = _.filter(this.collection.models, function(item) {
							return item.get("type").toLowerCase() === filterType;
						});
					this.collection.reset(filtered);
					this.router.navigate("filter/" + filterType);
				}
			},

			addContact : function(e) {
				e.preventDefault();

				var formData = {};
				$("#addContact").children("input").each(function(i, el) {
					if($(el).val() !== "") {
						formData[el.id] = $(el).val();
					}
				})
				this.contacts.push(formData);

				if(_.indexOf(this.getTypes(), formData.type) === -1) {
					this.collection.add(new Contact(formData));
					this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
				}
				else {
					this.collection.add(new Contact(formData));
				}
			},

			removeContact : function(removedModel) {
				var removed = removedModel.attributes;

				_.each(this.contacts, function(contact) {
					if(_.isEqual(contact,removed)) {
						this.contacts.splice(_.indexOf(contacts,contact), 1);
					}
				})
			},

			showForm : function() {
				this.$el.find("#addContact").slideToggle();
			}
		});
	}
);

import './settings.html';

Template.settings.helpers({
	'sent': function(){
		return Meteor.users.findOne({"_id":Meteor.userId()})['sent']
	},
	'username': function(){
		return Meteor.users.findOne({"_id":Meteor.userId()})['username']
	},
	'color': function() {
    return Meteor.users.findOne({_id:Meteor.userId()})["color"]
  },
});

Template.settings.events({
	'submit #colorf': function(event) {
    event.preventDefault();
    var val = document.getElementById('colorval').value;
    Meteor.call('userColor', val)
  }
})
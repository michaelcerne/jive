import { Tracker } from 'meteor/tracker';

import './settings.html';
import { ntc } from './ntc.js';

const userColorDep = new Tracker.Dependency;

Template.settings.helpers({
	'sent': function(){
		if(Meteor.user()) {
			return Meteor.user().sent
		}
	},
	'username': function(){
		if(Meteor.user()) {
			return Meteor.user().username
		}
	},
	'color': function() {
		if(Meteor.user()) {
			userColorDep.depend();
    	return ntc.name(Meteor.user().color)[1]
  	}
  },
});

Template.settings.events({
	'submit #colorf': function(event) {
    event.preventDefault();
    var val = document.getElementById('colorval').value;
    Meteor.call('userColor', val);
  	userColorDep.changed()
  }
})
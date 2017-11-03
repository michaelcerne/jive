import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Chronos } from 'meteor/remcoder:chronos';
import { moment } from 'meteor/momentjs:moment';
import { Streamy } from 'meteor/yuukan:streamy';

import './main.html';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Template.body.onCreated(function bodyOnCreated() {
	Meteor.subscribe('userData');
  Meteor.subscribe('Messages');
});

Template.messages.helpers({
    'message': function(){
        return Messages.find();
    }
});

Template.messageli.helpers({
    'time' : function() {
			return Chronos.moment(Messages.find({"_id":this._id}).fetch()[0]["createdAt"]).fromNow();
    },
    'color': function() {
    	return Messages.findOne({"_id":this._id})["color"]
    },
    'usernamechar': function() {
    	var str = Messages.findOne({"_id":this._id})["username"];
    	if (typeof str == 'undefined') {
    		return 1;
    	} else {
    		return str.charAt(0);
    	}
    },
    'sent': function() {
    	var user = Messages.findOne({"_id":this._id})["userid"];
    	return Meteor.users.findOne({"_id":user})['sent']
    },
    'owned': function() {
  		if (Messages.findOne({"_id":this._id})["userid"] == Meteor.userId()) {
  			return true
  		} else {
  			return false
  		}
    }
});

Template.messageinput.helpers({
		'username' : function() {
			return Meteor.user()["username"]
		},
    'usercolor' : function() {
			return Meteor.user()["color"]
    }
});

Template.statusBar.helpers({
    'status': function(){
    	if (Meteor.status().status == "connected" && Meteor.status().connected == true) {
    		return "Connected"
    	} else {
    		return "Experiencing Issues. Click to reconnect"
    	}
    }
});

Template.statusBar.events({
    'click a': function(event){
    event.preventDefault();
    Meteor.reconnect()
}
});

Template.messageinput.events({
    'submit form': function(event){
    event.preventDefault();
    var val = document.getElementById('msgval').value;
    Meteor.call('msgadd', val);
    document.getElementById('msgval').value = ""
		}	
});

Template.messageli.events({
		'click .msgdel': function(event){
    event.preventDefault();
    var val = this._id;
    Meteor.call('msgdel', val)
}
});
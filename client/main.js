import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Template.messages.helpers({
    'message': function(){
        return Messages.find();
    }
});

Template.messageli.helpers({
    'time': function(){
    	var diff = Math.abs(Messages.find({"_id":this._id}).fetch()[0]["createdAt"] - new Date());
    	var minutes = Math.floor((diff/1000)/60);
      return minutes + "m";
    },
    'color': function(){
    	return Messages.findOne({"_id":this._id})["color"]
    },
    'usernamechar': function(){
    	var str = Messages.findOne({"_id":this._id})["username"];
    	return str.charAt(0);
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
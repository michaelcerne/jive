import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Chronos } from 'meteor/remcoder:chronos';
import { moment } from 'meteor/momentjs:moment';
import { jquery, $ } from 'jquery';
import EmojiPicker from "rm-emoji-picker";

import './main.html';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Template.body.onCreated(function bodyOnCreated() {
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
    'color': function(){
    	return Messages.findOne({"_id":this._id})["color"]
    },
    'usernamechar': function(){
    	var str = Messages.findOne({"_id":this._id})["username"];
    	if (typeof str == 'undefined') {
    		return 1;
    	} else {
    		return str.charAt(0);
    	}
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
 
//First construct an instance of EmojiPicker
const picker = new EmojiPicker();
 
//Next tell it where to listen for a click, the container it should be appended to, and the input/textarea/contenteditable it needs to work with
const icon      = document.getElementById('emoji-ico');
const container = document.getElementById('emoji');
const editable  = document.getElementById('msgval');
 
picker.listenOn(icon, container, editable);
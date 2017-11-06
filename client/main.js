import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';
import { Chronos } from 'meteor/remcoder:chronos';
import { moment } from 'meteor/momentjs:moment';
import { Streamy } from 'meteor/yuukan:streamy';

import './main.html';
import './login.js';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('userData');
  Meteor.subscribe('Messages');
});

Template.messageinput.onCreated(function() {
  this.errorstate = new ReactiveVar('');
});

Template.body.onRendered(function() {
  var root = document.getElementById('root');
  var path = document.location.pathname;
  if(path == "/login") {
    Blaze.render(Template.login, root)
  } else if(path == "/signup") {
    Blaze.render(Template.signup, root)
  } else {
    Blaze.render(Template.main, root)
  }
});

Template.registerHelper( 'isAdmin', ( string ) => {
  if(Meteor.user() && Meteor.user().isAdmin) {
    return string
  } else {
    return ""
  }
});

Template.body.events({
  'click #signout': function(event) {
    event.preventDefault();
    Accounts.logout()
  }
});

Template.messages.helpers({
  'message': function() {
    return Messages.find();
  }
});

Template.messageli.helpers({
  'time': function() {
    return Chronos.moment(Messages.find({
      "_id": this._id
    }).fetch()[0]["createdAt"]).fromNow();
  },
  'color': function() {
    return Messages.findOne({
      "_id": this._id
    })["color"]
  },
  'usernamechar': function() {
    var str = Messages.findOne({
      "_id": this._id
    })["username"];
    if(typeof str == 'undefined') {
      return 1;
    } else {
      return str.charAt(0);
    }
  },
  'sent': function() {
    var user = Messages.findOne({
      "_id": this._id
    })["userid"];
    return Meteor.users.findOne({
      "_id": user
    })['sent']
  },
  'owned': function() {
    if(Messages.findOne({
        "_id": this._id
      })["userid"] == Meteor.userId()) {
      return true
    } else if(Meteor.user().isAdmin) {
      return true
    } else {
      return false
    }
  }
});

Template.messageinput.helpers({
  'username': function() {
    return Meteor.user()["username"]
  },
  'usercolor': function() {
    return Meteor.user()["color"]
  },
  'error': function() {
    var template = Template.instance();
    if(!template.errorstate.get() == "") {
      return true
    } else {
      return false
    }
  },
  'errorval': function() {
    var template = Template.instance();
    var errortype = template.errorstate.get();
    if(errortype == "Error: Error 406: Message Overdraw [406]") {
      return "Sorry, that message is a bit long. Keep it less than 280 characters."
    };
    return "Uh oh! There was an error sending your message! Please try again!";
  }
});

Template.statusBar.helpers({
  'status': function() {
    if(Meteor.status().status == "connected" && Meteor.status().connected == true) {
      return "Connected"
    } else {
      return "Experiencing Issues. Click to reconnect"
    }
  }
});

Template.statusBar.events({
  'click a': function(event) {
    event.preventDefault();
    Meteor.reconnect()
  }
});

Template.messageinput.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var val = document.getElementById('msgval').value;
    Meteor.call('msgadd', val, function(error) {
      if(error) {
        template.errorstate.set(error)
      } else {
        template.errorstate.set("")
      }
    });
    document.getElementById('msgval').value = ""
    Meteor.call('userTyping', false)
  },
  'keydown form': function(event, template) {
    console.log("Yed");
    Meteor.call('userTyping', true)
    Meteor.setTimeout(function(){Meteor.call('userTyping', false)}, 5000)
  },
});

Template.messageli.events({
  'click .msgdel': function(event) {
    event.preventDefault();
    var val = this._id;
    Meteor.call('msgdel', val)
  }
});

Template.isType.helpers({
  'users': function() {
    return Meteor.users.find({"isTyping":true})
  },
  'userTyping': function() {
    if(Meteor.users.find({"isTyping":true}).fetch()[0] == undefined) {
      return false
    } else {
      return true
    }
  },
  'userTyping1': function() {
    if(Meteor.users.find({"isTyping":true}).fetch().length > 1) {
      return "|"
    } else {
      return ""
    }
  }
});
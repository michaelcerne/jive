import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './login.html';

Template.signup.onCreated(function() {
  this.errorstate = new ReactiveVar('');
});

Template.signup.events({
  'submit form': function(event, template) {
    template.errorstate.set("");
    event.preventDefault();
    var usern = document.getElementById('username').value;
    var passw = document.getElementById('password').value;
    var passv = document.getElementById('password2').value;
    var newUserData = {
      username: usern,
      password: passw
    };
    if(!passw == passv) {
      template.errorstate.set("Error: Error 500: Password Fault, Password Match Failure [500]");
      return
    };
    Meteor.call('userCreate', newUserData, function(error) {
      if(error) {
        template.errorstate.set(error);
      }
    });
    if(template.errorstate.get() == "") {
      Meteor.loginWithPassword(newUserData.username, newUserData.password, function(error) {
        if(!error) {
          document.location.pathname = "/"
        }
      });
    };
  }
});

Template.signup.helpers({
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
    if(errortype == "Error: Error 500: Password Fault, Not 6 Digits [500]") {
      return "Sorry, looks like you need a longer password. Atleast 6 digits, please."
    } else if(errortype == "Error: Error 500: Password Fault, No Password [500]") {
      return "Whoops, looks like you forgot to set a password. Please enter one, atleast 6 digits, please."
    } else if(errortype == "Error: Error 500: Username Fault, No Username [500]") {
      return "Whoops, looks like you forgot to set a username. Please enter one, atleast 6 digits, please."
    } else if(errortype == "Error: Error 500: Username Fault, Not 6 Digits [500]") {
      return "Sorry, looks like you need a longer username. Atleast 6 digits, please."
    } else if(errortype == "Error: Error 500: Username Fault, Over 18 Digits [500]") {
      return "Sorry, looks like you need a shorter username. At most 18 digits, please."
    } else if(errortype == "Error: Error 500: Password Fault, Password Match Failure [500]") {
      return "Oh no! Your passwords don't match! Try again, please!"
    };
    return "Uh oh! There was an error adding your account! Please try again!";
  }
})

Template.login.onCreated(function() {
  this.errorstate = new ReactiveVar('');
});

Template.login.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var usern = document.getElementById('username').value;
    var passw = document.getElementById('password').value;
    var newUserData = {
      username: usern,
      password: passw
    };
    Meteor.loginWithPassword(newUserData.username, newUserData.password, function(error) {
      template.errorstate.set(error)
      if(!error) {
        document.location.pathname = "/"
      }
    });
  }
});

Template.login.helpers({
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
    if(errortype["message"] == "User not found [403]") {
      return "Uh oh! We couldn't quite find you! Are you sure you've got the right username?"
    } else if(errortype["message"] == "Incorrect password [403]") {
      return "Whoops! Somethings up with your password! Make sure it's correct!"
    } else {
      return "Oh no! There's been an issue. Make sure your username and password are correct!"
    };
  }
})
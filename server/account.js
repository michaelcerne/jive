import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

function rndcolor() {
  var ran = "#00EE76";
  switch(Math.floor(Math.random() * 15)) {
    case 0:
      ran = "#00EE76";
      break;
    case 1:
      ran = "#00E5EE";
      break;
    case 2:
      ran = "#EEEE00";
      break;
    case 3:
      ran = "#FA8072";
      break;
    case 4:
      ran = "#FF6EB4";
      break;
    case 5:
      ran = "#FFFFAA";
      break;
    case 6:
      ran = "#7AA9DD";
      break;
    case 7:
      ran = "#FF1493";
      break;
    case 8:
      ran = "#EE00EE";
      break;
    case 9:
      ran = "#6495ED";
      break;
    case 10:
      ran = "#1E90FF";
      break;
    case 11:
      ran = "#00BFFF";
      break;
    case 12:
      ran = "#00F5FF";
      break;
    case 13:
      ran = "#54FF9F";
      break;
    case 14:
      ran = "#FF8C00";
      break;
    case 15:
      ran = "#FF4040";
      break;
    default:
      ran = "#FF3030";
      break;
  };
  return ran
}

Accounts.onCreateUser((options, user) => {
  var rndcol = rndcolor();
  user.color = rndcol;
  user.isTyping = false;
  return user;
});

Meteor.methods({
  'userCreate': function(newUserData) {
    if(newUserData["username"] == "") {
      throw new Meteor.Error(500, 'Error 500: Username Fault, No Username', 'No Username');
      return
    };
    if(newUserData["username"].length < 5) {
      throw new Meteor.Error(500, 'Error 500: Username Fault, Not 6 Digits', 'Not 6 Digits');
      return
    };
    if(newUserData["username"].length > 19) {
      throw new Meteor.Error(500, 'Error 500: Username Fault, Over 18 Digits', 'Over 18 Digits');
      return
    };
    if(newUserData["password"] == "") {
      throw new Meteor.Error(500, 'Error 500: Password Fault, No Password', 'No Password');
      return
    };
    if(newUserData["password"].length < 5) {
      throw new Meteor.Error(500, 'Error 500: Password Fault, Not 6 Digits', 'Not 6 Digits');
      return
    };
    return Accounts.createUser(newUserData);
  },
  'userAdminify': function(val) {
  	Meteor.users.update({_id:Meteor.userId()}, { $set: { isAdmin: true } })
  },
  'userTyping': function(val) {
    if(val == true) {
      Meteor.users.update({_id:Meteor.userId()}, { $set: { isTyping : true }})
    } else {
      Meteor.users.update({_id:Meteor.userId()}, { $set: { isTyping : false }})
    }
  }
})
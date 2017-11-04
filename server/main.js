import { Meteor } from 'meteor/meteor';
import './account.js';

function count(obj) { return Object.keys(obj).length; }

function rndcolor() {
    var ran = "#00EE76";
	switch (Math.round(Math.random()*10)) {
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
    default:
    	ran = "#FA8072";
    	break;
	};
	return ran
}

Meteor.publish('Messages', function messages() {
    return Messages.find();
});

Meteor.publish("userData", function () {
    return Meteor.users.find({},
        {fields: {'sent': 1, 'color': 1}});
});

Meteor.startup(() => {
});

Meteor.methods({
  'msgadd': function(val){
  	if (!Meteor.userId()) {
  		throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
  		return
  	};
  	if (count(Messages.find({}, {sort: { "createdAt" : 1 }}).fetch()) >= 5) {
  		var postval = Messages.find({}, {sort: { "createdAt" : 1 }, limit: 1}).fetch()[0]["_id"];
  		Messages.remove({ _id: postval });
  	};
  	if (Meteor.users.findOne({_id:Meteor.userId()})["color"] == undefined) {
  		var rndcol = rndcolor();
  		Meteor.users.update( { _id: Meteor.userId() }, { $set: {color : rndcol}})
  	};
  	var usercolor = Meteor.users.findOne({_id:Meteor.userId()})["color"];
		Messages.insert({
  		username: Meteor.user().username,
  		userid: Meteor.userId(),
      content: val,
      color: usercolor,
      createdAt: new Date()
    });
    if (Meteor.users.findOne({_id:Meteor.userId()})["sent"] == undefined) {
    	Meteor.users.update( { _id: Meteor.userId() }, { $set: {sent : 0}})
    };
    Meteor.users.update({_id:Meteor.userId()},{$set:{sent : parseInt(Meteor.user()["sent"], 10) + 1}}) 
  },
  'msgdel': function(val){
  	if (!Messages.findOne({ _id:val, userid:Meteor.userId()})) {
  		throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
  		return
  	};
  	Messages.remove({ _id: val });
  }
});
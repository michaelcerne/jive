import { Meteor } from 'meteor/meteor';

function count(obj) { return Object.keys(obj).length; }

function rndcolor() {
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
	}
	return ran
}

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'msgadd': function(val){
  	if (!Meteor.userId()) {
  		throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
  		return
  	};
  	if (count(Messages.find({}, {sort: { "createdAt" : 1 }}).fetch()) >= 10) {
  		var postval = Messages.find({}, {sort: { "createdAt" : 1 }, limit: 1}).fetch()[0]["_id"];
  		Messages.remove({ _id: postval });
  	};
		Messages.insert({
  		username: Meteor.user().username,
  		userid: Meteor.userId(),
      content: val,
      color: rndcolor(),
      createdAt: new Date()
    });
  },
  'msgdel': function(val){
  	if (!Messages.findOne({ "_id":val, userid:Meteor.userId()})) {
  		throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
  		return
  	};
  	Messages.remove({ _id: val });
  }
});
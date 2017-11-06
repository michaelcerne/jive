import { Meteor } from 'meteor/meteor';
import './account.js';

function count(obj) {
  return Object.keys(obj).length;
}

Meteor.publish('Messages', function messages() {
  return Messages.find();
});

Meteor.publish("userData", function() {
  return Meteor.users.find({}, {
    fields: {
      'sent': 1,
      'username': 1,
      'color': 1,
      'isAdmin': 1,
      'isTyping': 1
    }
  });
});

Meteor.startup(() => {});

Meteor.methods({
  'msgadd': function(val) {
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
      return
    };
    if(val.length > 280) {
      throw new Meteor.Error(406, 'Error 406: Message Overdraw', 'user sent long message, over 280');
      return
    };
    if(count(Messages.find({}, {
        sort: {
          "createdAt": 1
        }
      }).fetch()) >= 25) {
      var postval = Messages.find({}, {
        sort: {
          "createdAt": 1
        },
        limit: 1
      }).fetch()[0]["_id"];
      Messages.remove({
        _id: postval
      });
    };
    if(Meteor.users.findOne({
        _id: Meteor.userId()
      })["color"] == undefined) {
      var rndcol = rndcolor();
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          color: rndcol
        }
      })
    };
    var usercolor = Meteor.users.findOne({
      _id: Meteor.userId()
    })["color"];
    Messages.insert({
      username: Meteor.user().username,
      userid: Meteor.userId(),
      content: val,
      color: usercolor,
      createdAt: new Date()
    });
    if(Meteor.users.findOne({
        _id: Meteor.userId()
      })["sent"] == undefined) {
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          sent: 0
        }
      })
    };
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        sent: parseInt(Meteor.user()["sent"], 10) + 1
      }
    })
  },
  'msgdel': function(val) {
    if(!Messages.findOne({
        _id: val,
        userid: Meteor.userId()
      }) && !Meteor.user().isAdmin) {
      throw new Meteor.Error(403, 'Error 403: No Access', 'user is not logged in');
      return
    };
    Messages.remove({
      _id: val
    });
  }
});
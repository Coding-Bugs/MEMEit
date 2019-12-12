import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './image.html';

//gets data for image template
Template.image.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

//manages events inside the image template
Template.image.events({
  'click .delete'() {
      Meteor.call('images.remove', this._id);
  },
  'click .toggle-private'() {
      Meteor.call('images.setPrivate', this._id, !this.private);
  },
});

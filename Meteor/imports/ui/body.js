import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Images } from '../api/images.js';

import './image.js';
import './body.html';

//creates the html and React
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  if(Meteor.userId){
  Meteor.subscribe('images');
}
});

//loads images into the body html
Template.body.helpers({
  images() {
    const instance = Template.instance();
    return Images.find({}, { sort: { createdAt: -1 } });
    }
});

Template.body.events({
  'submit .new-image'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Gets values from the form elements
    const target = event.target;
    const image = target.url.value;
    const title = target.title.value;

    //prevents blank entries
    if(image != '' && title != ''){
      // Insert a image into the collection by calling meteor function
      Meteor.call('images.insert', image, title);
    }
    else {
      alert("You must fill out the Title and URL fields to post.");
    }

    // Clear form
    target.url.value = '';
    target.title.value = '';
  },
});

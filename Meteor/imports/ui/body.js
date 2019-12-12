import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  if(Meteor.userId){
  Meteor.subscribe('tasks');
}
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const image = target.url.value;
    const title = target.title.value;
    if(image != '' && title != ''){
      //
      // Insert a task into the collection
      Meteor.call('tasks.insert', image, title);
  } else {
      alert("You must fill out the Title and URL fields to post.");
  }

    // Clear form
    target.url.value = '';
    target.title.value = '';
  },
  'change .hide-completed input'(event, instance) {
  instance.state.set('hideCompleted', event.target.checked);
  },
});

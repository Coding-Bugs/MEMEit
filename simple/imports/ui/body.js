import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
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
    if(image != ''){
      //
      // Insert a task into the collection
      Meteor.call('tasks.insert', image, title);
    }

    // Clear form
    target.image.value = '';
    target.title.value = '';
  },
  'change .hide-completed input'(event, instance) {
  instance.state.set('hideCompleted', event.target.checked);
  },
});

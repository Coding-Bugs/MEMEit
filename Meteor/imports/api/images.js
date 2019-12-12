import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Images = new Mongo.Collection('images');

if (Meteor.isServer) {
  // Only runs on the server
  // Only publish images that are public or belong to the current user
  Meteor.publish('images', function imagesPublication() {
    return Images.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  //Creates new image and inserts it into collection
  'images.insert'(text, title) {
    check(text, String);
    check(title, String)
    // Make sure the user is logged in before inserting a image
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    //adds time stamp
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    let hour = dateObj.getUTCHours();
    let mins = dateObj.getUTCMinutes();
    newDate = hour + ':' + mins + ', ' + month + '/' + day + '/' + year + ' UTC';

    //inserts new image into collection
    Images.insert({
      text,
      title,
      createdAt: newDate,
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  //removes images if properly authorized
  'images.remove'(imageId) {
    check(imageId, String);

    const image = Images.findOne(imageId);
    if (image.owner !== Meteor.userId()) {
      // If the image is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');

    }

    Images.remove(imageId);
  },
  //makes images private so only authorized users can see it
  'images.setPrivate'(imageId, setToPrivate) {
  check(imageId, String);
  check(setToPrivate, Boolean);

  const image = Images.findOne(imageId);

  // Make sure only the image owner can make a image private
  if (image.owner !== Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
  //update
  Images.update(imageId, { $set: { private: setToPrivate } });
  },
});

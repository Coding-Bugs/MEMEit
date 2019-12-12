import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';
import AccountsUIWrapper from '../imports/ui/AccountsUIWrapper.js'

import './main.html';
import './login/login.html';

Router.map(function() {
    this.route('home', {
        path: '/'
    });
    this.route('login', {
        path: '/login'
    });
    // this.route('signup', {
    //     path: 'signup'
    // });
});



if(Meteor.isClient){
    Template.login.events({
        'login .new-user': function(event){
            let uname = event.target.email_input.value;
            let pword = event.target.password_input.value;

            Users.insert({
                uname: uname,
                pword: pword,
            });
        }
    });
}

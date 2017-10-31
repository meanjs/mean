'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Events name.',
    trim: true
  },
  dateOfEvent: {
    type: Date, // Possibly make type String??
    required: 'Please enter the date of an event.'
  },
  startTime: {
    type: String,
    required: 'Please enter a start time.'
  },
  endTime: {
    type: String,
    required: 'Please enter an end time.'
  },
  location: {
    type: String,
    required: 'Please enter a location for the event.'
  },
  banner: {
    type: String,
    default: 'modules/events/client/img/default_banner.jpg'
  },
  /*organizationsPending: [{
   organizationName: String
   }],*/
  organizationsPending: {
    type: [String]
  },
  organizationConfirmed: {
    type: String
  },
  taxIdRequired: {
    type: Boolean
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Event', EventSchema);

//
// /**
//  * OLDEvent Schema
//  */
// var EventSchema = new Schema({
//   eventName: {
//     type: String,
//     default: 'Business name'    // check this
//   },
//   business: {
//     type: String
//   },
//   dateOfEvent: {
//     type: String
//   },
//   timeOfEvent: {
//     type: String
//   },
//   locationOfEvent: {
//     type: String
//   },
//   organizationsPending: [{
//     organizationName: String
//   }],
//   organizationConfirmed: {
//     type: String
//   },
//   eventImage: {    // check this
//     type: String,
//     default: 'modules/users/client/img/profile/default.png'   // business avatar
//   },
//   businessContact: {
//     firstName: {
//       type: String
//     },
//     lastName: {
//       type: String
//     },
//     phoneNumber: {
//       type: String
//     }
//   },
//   organizationContact: {
//     firstName: {
//       type: String
//     },
//     lastName: {
//       type: String
//     },
//     phoneNumber: {
//       type: String
//     }
//   },
//   updated: {
//     type: Date
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   }
// });

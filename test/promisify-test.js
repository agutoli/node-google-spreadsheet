var path = require('path');
var should = require('chai').should();
var async = require('async');
var _ = require('lodash');

var GoogleSpreadsheet = require("../index.js");

var sheet_ids = require('./config');

var docs = {};
Object.keys(sheet_ids).forEach(function(key) {
  docs[key] = new GoogleSpreadsheet(sheet_ids[key]);
});

var creds = require('./service-account-creds.json');

function getSheetName() { return 'test sheet'+(+new Date()); }

describe('Promise way', function() {
  this.timeout(5000);

  describe('without auth', function() {
    it('getInfo should fail on a private doc (promise)', function() {
      return docs['private'].getInfo().catch((err) => {
        err.should.be.an.error;
        err.message.should.include('Sheet is private.');
        err.message.should.include('Use authentication or make public.');
      })
    });

    _.each(['public', 'public-read-only'], function(key) {
      it('getInfo should succeed on a '+key+' doc - (promise)', function() {
        return docs[key].getInfo().then((info) => {
          info.title.should.be.a.string;
        });
      });
    });
  });

  describe('writing', function(){
    // it still fails on the public doc because you always need to auth
    _.each(['public', 'public-read-only', 'private'], function(key) {
      it('should fail on a '+key+' doc (promise)', function() {
        return docs[key].addWorksheet().catch(function(err) {
          err.should.be.an.error;
          err.message.should.include('authenticate');
        });
      });
    });
  });
});

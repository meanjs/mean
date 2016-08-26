'use strict';

var path = require('path'),
  fs = require('fs'),
  _ = require('lodash');

describe('Core E2E Tests:', function () {

  describe('Switch Language Validation', function () {
    it('Should react to language change', function () {

      browser.get('http://localhost:3001/');

      var title = 'Switch Language';
      var dir = path.resolve('./public/i18n');
      var parent = element(by.css('li.switch-language > a'));

      browser.driver.executeScript(function() {
        return window.application.languages;
      }).then(function(result) {
        _(result).forEach(switchLanguage);
        switchLanguage('English', 'en-us');
      });

      function switchLanguage(label, code) {
        var translations = JSON.parse(fs.readFileSync(dir + '/' + code + '.json'));

        parent.click();
        element(by.cssContainingText('ul.dropdown-menu li > a', label)).click();
        expect(parent.getText()).toBe(translations[title] + ' ');
      }

    });

  });

});

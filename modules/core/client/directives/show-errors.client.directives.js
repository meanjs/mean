'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
	.directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
		var linkFn = function (scope, el, attrs, formCtrl) {
			var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
				initCheck = false,
				showValidationMessages = false,
				blurred = false;

			options = scope.$eval(attrs.showErrors) || {};
			showSuccess = options.showSuccess || false;
			inputEl = el[0].querySelector('.form-control[name]');
			inputNgEl = angular.element(inputEl);
			inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

			if (!inputName) {
				throw 'show-errors element has no child input elements with a \'name\' attribute and a \'form-control\' class';
			}

			inputNgEl.bind('blur', function () {
				blurred = true;

				return toggleClasses(formCtrl[inputName].$invalid);
			});

			var reset = function () {
				return $timeout(function () {
					el.removeClass('has-error');
					el.removeClass('has-success');
					showValidationMessages = false;
					blurred = false;
				}, 0, false);
			};

			scope.$watch(function () {
				return formCtrl[inputName] && formCtrl[inputName].$invalid;
			}, function (invalid) {
				if (!blurred) {
					return;
				}
				return toggleClasses(invalid);
			});

			scope.$on('show-errors-check-validity', function () {
				initCheck = true;
				showValidationMessages = true;

				return toggleClasses(formCtrl[inputName].$invalid);
			});

			scope.$on('show-errors-reset', function () {
				return reset();
			});

			toggleClasses = function (invalid) {
				el.toggleClass('has-error', showValidationMessages && invalid);
				if (showSuccess) {
					return el.toggleClass('has-success', showValidationMessages && !invalid);
				}
			};
		};

		return {
			restrict: 'A',
			require: '^form',
			compile: function (elem, attrs) {
				if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
					if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
						throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
					}
				}
				return linkFn;
			}
		};
}]);

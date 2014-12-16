'use strict';

// ReturnUrl service
angular.module('core').service('ReturnUrl', ['$state',
	function($state)
	{
		var self = this;

		// i.e. ReturnUrl.return()
		this.return = function()
		{
			if (self.returnState)
			{
				$state.go(self.returnState.name, self.returnState.params);
				delete self.returnState;
				return true; // yes we returned somewhere
			}
			return false; // no we didn't return anywhere
		};

		// i.e. ReturnUrl.set({ name: $state.current.name, params: $stateParams });
		this.set = function(state)
		{
			if (!state) return;
			self.returnState = state;
		};
	}
]);

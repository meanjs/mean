'use strict';

// ReturnUrl service
angular.module('core').service('ReturnUrl', ['$state',
	function($state)
	{
		// i.e. ReturnUrl.return()
		this.return = function()
		{
			if (sessionStorage && sessionStorage.returnState)
			{
				var state = JSON.parse(sessionStorage.returnState);
				$state.go(state.name, state.params);
				delete sessionStorage.returnState;
				return true; // yes we returned somewhere
			}
			return false; // no we didn't return anywhere
		};

		// i.e. ReturnUrl.set({ name: $state.current.name, params: $stateParams });
		this.set = function(state)
		{
			if (!state || !sessionStorage) return;
			sessionStorage.returnState = JSON.stringify(state);
		};
	}
]);

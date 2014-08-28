GLOBAL.csrequire = require('covershot').require.bind(null, require);

// coverage will be collected for this file and all files it requires
//var myLibrary = csrequire('../lib/myLibrary');
GLOBAL.app = csrequire('../server');

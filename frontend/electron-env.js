// electron-env.js
process.env.NODE_ENV = 'development';
require('electron').app.on('ready', () => {
    require('./electron/main.js');
});
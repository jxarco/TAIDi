cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.darktalker.cordova.screenshot.screenshot",
    "file": "plugins/com.darktalker.cordova.screenshot/www/Screenshot.js",
    "pluginId": "com.darktalker.cordova.screenshot",
    "merges": [
      "navigator.screenshot"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "com.darktalker.cordova.screenshot": "0.1.5",
  "cordova-plugin-dialogs": "2.0.1"
};
// BOTTOM OF METADATA
});
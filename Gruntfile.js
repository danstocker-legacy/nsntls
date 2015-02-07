/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/behavior/Profile.js',
            'js/behavior/Profiled.js',
            'js/behavior/StateMatrix.js',
            'js/behavior/Stateful.js',
            'js/behavior/Lineage.js',
            'js/behavior/Progenitor.js',
            'js/behavior/JournalingCollection.js',
            'js/exports.js'
        ],

        test: [
            'js/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};

/*global dessert, troop, nsntls */
troop.postpone(nsntls, 'Profiled', function (nsntls) {
    "use strict";

    /**
     * Trait.
     * Allows objects to be profiled and/or to contribute to profiles of other objects.
     * @class nsntls.Profiled
     * @extends troop.Base
     */
    nsntls.Profiled = troop.Base.extend()
        .addMethods(/** @lends nsntls.Profiled# */{
            /**
             * Initializes profile for the current instance. Creates a `.profile` property on the object.
             * @param {string} profileId String identifying the current object in a profile collection.
             * Each profiled instance is issued a profile collection under its `.profile` property.
             * This way, any contribution to the profile will be reflected in all profiles and consequently those
             * objects by which they were created.
             * @param {nsntls.ProfileCollection} [profiles] Optional profile collection. When specified,
             * the current profiled object will add its own profile to this collection. When omitted, a new profile
             * collection will be created with one profile in it.
             */
            init: function (profileId, profiles) {
                dessert
                    .isString(profileId, "Invalid profile ID")
                    .isProfileCollectionOptional(profiles, "Invalid profile collection");

                /**
                 * Cloning passed profile collection or creating new
                 * @type {nsntls.ProfileCollection}
                 */
                this.profile = (profiles ? profiles.clone() : nsntls.ProfileCollection.create())
                    // adding new profile for this instance
                    .setItem(profileId, nsntls.Profile.create());

                return this;
            },

            /**
             * Gathers profiles from a collection of profiled instances.
             * @returns {nsntls.ProfileCollection}
             */
            getProfile: function () {
                return this.profile;
            }
        });
});

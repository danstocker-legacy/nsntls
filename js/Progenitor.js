/*global dessert, troop, sntls, nsntls */
troop.postpone(nsntls, 'Progenitor', function (ns, className) {
    "use strict";

    var base = sntls.Managed,
        self = base.extend(className);

    /**
     * @name nsntls.Progenitor.create
     * @function
     * @returns {nsntls.Progenitor}
     */

    /**
     * Trait that adds parent-children relations to classes.
     * @class
     * @extends sntls.Managed
     */
    nsntls.Progenitor = self
        .addMethods(/** @lends nsntls.Progenitor# */{
            /**
             * @ignore
             */
            init: function () {
                base.init.call(this);

                /**
                 * Collection of lineages the current instance is a member of.
                 * @type {sntls.Collection}
                 */
                this.lineages = sntls.Collection.create();
            },

            /**
             * Retrieves lineage bearing the specified name, or the first available when none is specified.
             * If the current instance is not on the specified lineage, returns `undefined`.
             * @param {string} [lineageName]
             * @returns {nsntls.Lineage}
             */
            getLineage: function (lineageName) {
                dessert.isStringOptional(lineageName, "Invalid lineage name");

                return lineageName ?
                    this.lineages.getItem(lineageName) :
                    this.lineages.getFirstValue();
            },

            /**
             * Retrieves parent for the specified lineage, or for the first available lineage when none is specified.
             * @param {string} [lineageName] Lineage name. When omitted, resolves to first available lineage.
             * @example
             * myProgenitor.getParent('widgets') // fetches parent for the 'widgets' lineage
             * @returns {sntls.Managed}
             */
            getParent: function (lineageName) {
                dessert.isStringOptional(lineageName, "Invalid lineage name");

                var lineage = lineageName ?
                        this.lineages.getItem(lineageName) :
                        this.lineages.getFirstValue(),
                    result;

                if (lineage) {
                    result = lineage.parent;
                }

                return result;
            },

            /**
             * Retrieves children from the specified lineage or all lineages.
             * @param {string} [lineageName]
             * @returns {sntls.Collection}
             */
            getChildren: function (lineageName) {
                dessert.isStringOptional(lineageName, "Invalid lineage name");

                var lineage;
                if (lineageName) {
                    // lineage specified
                    lineage = this.getLineage(lineageName);
                    if (lineage) {
                        return lineage.children;
                    } else {
                        return sntls.Collection.create();
                    }
                } else {
                    return this.lineages.toTree()
                        .queryKeyValuePairsAsHash('|>children>items>|'.toQuery())
                        .toCollection();
                }
            },

            /**
             * Registers a lineage on the current instance.
             * @param {string} lineageName
             * @returns {nsntls.Progenitor}
             */
            registerLineage: function (lineageName) {
                dessert.isString(lineageName, "Invalid lineage name");
                this.lineages.setItem(lineageName, nsntls.Lineage.create(lineageName, this));
                return this;
            },

            /**
             * Adds current instance to a lineage as child of the specified parent.
             * @param {string} lineageName
             * @param {nsntls.Progenitor} [parent]
             * @example
             * Widget = troop.Base.extend()
             *   .addTrait(nsntls.Progenitor)
             *   .addMethods({init: function () {nsntls.Progenitor.init.call(this);}});
             * var parent = Widget.create()
             *       .addToLineage('widgets'),
             *     child = Widget.create()
             *       .addToLineage('widgets', parent);
             * @returns {nsntls.Progenitor}
             */
            addToLineage: function (lineageName, parent) {
                // making sure lineage exists
                if (!this.getLineage(lineageName)) {
                    this.registerLineage(lineageName);
                }

                if (parent) {
                    // adding instance to parent
                    this.getLineage(lineageName)
                        .addToParent(parent);
                }

                return this;
            },

            /**
             * Adds a child to the specified lineage.
             * @param {string} lineageName
             * @param {nsntls.Progenitor} child
             * @example
             * var parent = Widget.create(),
             *     child = Widget.create();
             * parent.addChild('widgets', child); // both parent & child will be on the 'widgets' lineage
             * @returns {nsntls.Progenitor}
             */
            addChild: function (lineageName, child) {
                if (!this.getLineage(lineageName)) {
                    this.registerLineage(lineageName);
                }

                child.addToLineage(lineageName, this);

                return this;
            },

            /**
             * Removes child from the specified lineage.
             * @param {string} lineageName
             * @param {nsntls.Progenitor} child
             * @returns {nsntls.Progenitor}
             */
            removeChild: function (lineageName, child) {
                dessert.isClass(child, "Invalid child");

                var lineage = this.getLineage(lineageName),
                    childLineage;

                if (lineage && lineage.children.getItem(child.instanceId)) {
                    // child instance is in fact child on the specified lineage
                    childLineage = child.getLineage(lineageName);
                    if (childLineage) {
                        // removing child from parent
                        childLineage.removeFromParent();
                    }
                }

                return this;
            },

            /**
             * Prepares instance for garbage collection. Detaches instance from parents and children
             * on all lineages it belongs to.
             * @returns {nsntls.Progenitor}
             */
            destroy: function () {
                var lineages = this.lineages,
                    lineageNames = lineages.getKeys();

                // removing current item from parents on all lineages
                lineages
                    .callOnEachItem('removeFromParent');

                // removing all children from parent
                lineages.toTree()
                    .queryValuesAsHash([
                        '|'.toKeyValuePattern(),
                        'children', 'items', '|'.toKeyValuePattern(),
                        'lineages', 'items', lineageNames].toQuery()
                    )
                    .toCollection()
                    .callOnEachItem('removeFromParent');

                // removing instance from registry
                this.removeFromRegistry();

                return this;
            }
        });
});

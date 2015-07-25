ko.observable.fn.withComponent = function () {
    this.notifySubscribers = function () {
        ko.subscribable.fn.notifySubscribers.apply(this, arguments);
    };

    this.componentUpdate = function (newValue) {
        this.modifiedByComponent = true;
        this(newValue);
        this.modifiedByComponent = false;
    };

    this.isModifiedByComponent = function () {
        return !!this.modifiedByComponent;
    };

    return this;
};
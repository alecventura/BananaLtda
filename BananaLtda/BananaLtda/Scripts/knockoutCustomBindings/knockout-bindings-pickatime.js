ko.bindingHandlers.pickatime = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var $element, $input, $parent, observable, options, picker, readFormat, value;
        observable = valueAccessor();
        if (!_.isFunction(observable.componentUpdate)) {
            observable.withComponent();
        }
        value = observable();
        $element = $(element);
        options = ko.unwrap(allBindingsAccessor.get('pickatimeOptions'));
        readFormat = allBindingsAccessor.get('readFormat');
        $input = $element.pickatime(options);
        picker = $input.pickatime('picker');

        picker.set('select', value);

        picker.on("set", function (data) {
            if (data.select) {
                return observable.componentUpdate(data.select);
            } else {
                return observable.componentUpdate(null);
            }
        });
        $parent = $element.parent();
        if (options != null ? options.appendButtonSelector : void 0) {
            return $(options != null ? options.appendButtonSelector : void 0, $parent).click(function (event) {
                event.stopPropagation();
                return picker.open();
            });
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var observable, options, picker, readFormat, value;
        observable = valueAccessor();
        value = observable();
        options = ko.unwrap(allBindingsAccessor.get('pickatimeOptions'));
        readFormat = allBindingsAccessor.get('readFormat');
        if (_.isFunction(observable.isModifiedByComponent) && observable.isModifiedByComponent()) {
            return;
        }
        picker = $(element).pickatime('picker');
        picker.set('select', value);
    }
};
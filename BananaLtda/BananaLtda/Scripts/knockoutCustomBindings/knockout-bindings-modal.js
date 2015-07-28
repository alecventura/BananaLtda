ko.bindingHandlers.isVisible = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            value = valueAccessor();
        if (typeof value !== 'undefined') {
            $(element).modal(!ko.unwrap(value) ? 'hide' : 'show');
        }
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();

        if (typeof value !== 'undefined') {
            $(element).modal(!ko.unwrap(value) ? 'hide' : 'show');
        }
    }

};

ko.bindingHandlers.isVisibleBig = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            value = valueAccessor();
        if (typeof value !== 'undefined') {
            if (!ko.unwrap(value)) {
                $(element).modal('hide');
            } else {
                var desiredWidth = $(window).width() * 0.8;
                var desiredHeight = $(window).height() * 0.8;
                var desiredMargin = $(window).width() / 2 * 0.2;

                $('.modal-dialog', element).css('width', (desiredWidth));
                $('.modal-dialog', element).css('height', (desiredHeight));
                $('.modal-dialog', element).css('margin-left', (desiredMargin));
                $(element).modal('show');
            }
        }
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();

        if (typeof value !== 'undefined') {
            if (!ko.unwrap(value)) {
                $(element).modal('hide');
            } else {
                var desiredWidth = $(window).width() * 0.8;
                var desiredHeight = $(window).height() * 0.8;
                var desiredMargin = $(window).width() / 2 * 0.2;

                $('.modal-dialog', element).css('width', (desiredWidth));
                $('.modal-dialog', element).css('height', (desiredHeight));
                $('.modal-dialog', element).css('margin-left', (desiredMargin));
                $(element).modal('show');
            }
        }
    }

};

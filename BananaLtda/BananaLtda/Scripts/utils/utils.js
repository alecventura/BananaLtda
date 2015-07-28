var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

function utils() { }

utils.handleValidationError = function (item) {
    var element = $("#" + item.path);
    var parent = element.parent();
    element.addClass("has-error-input");
    parent.addClass("has-error");

    var errorHtml = '<div class="validation-error-message col-lg-12"><p>' + item.error + '</p></div>';

    parent.append(errorHtml);
};

utils.handleValidationErrors = function (response) {
    if (response.validationErrors != null && response.validationErrors.length > 0) {
        _.each(response.validationErrors, function (item) {
            utils.handleValidationError(item);
        })
    } else {
        toastr.warning(response.message)
    }
}

utils.clearErrors = function () {
    $('.validation-error-message').remove();
    $('.has-error-input').removeClass("has-error-input");
    $('.has-error').removeClass("has-error");
}

utils.postJSON = function (path, data, callback) {
    return $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: callback,
        contentType: 'application/json',
        dataType: 'json',
        failure: function (response) {
            alert(response);
        },
        error: function (response) {
            alert(response);
        }
    });
};

utils.postBackgroundJSON = function (path, data, callback) {
    return $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: callback,
        contentType: 'application/json',
        dataType: 'json',
        showOverlay: false,
        failure: function (response) {
            alert(response);
        },
        error: function (response) {
            alert(response);
        }
    });
};

utils.withFormNamePostJSON = function (path, data, form, callback) {
    return $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: callback,
        contentType: 'application/json',
        dataType: 'json',
        form: form,
        failure: function (response) {
            alert(response);
        },
        error: function (response) {
            alert(response);
        }
    });
};

utils.onlyPostJSON = function (path, data, callback) {
    return $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: callback,
        contentType: 'application/json',
        failure: function (response) {
            alert(response);
        },
        error: function (response) {
            alert(response);
        }
    });
};

utils.getJSON = function (path, data, callback) {
    return $.ajax({
        type: 'GET',
        url: path,
        data: data,
        success: callback,
        contentType: 'application/json',
        dataType: 'json',
        failure: function (response) {
            alert(response);
        },
        error: function (response) {
            alert(response);
        }
    });
};

utils.postWithoutGlobalsJSON = function (path, data, error, callback) {
    return $.ajax({
        type: 'POST',
        url: path,
        data: data,
        success: callback,
        error: error,
        contentType: 'application/json',
        dataType: 'json',
        global: false
    });
};

utils.notifySuccess = function (title, text) {
    return toastr.success(text, title);
};

utils.notifyError = function (title, text) {
    return toastr.error(text, title);
};

utils.notifyWarning = function (title, text) {
    return toastr.warning(text, title);
};

utils.notify = function (title, text) {
    return toastr.info(text, title);
};

utils.addCsrf = function (data, csrf) {
    data._csrf = csrf;
    return data;
};

utils.overlayCounter = 0;

utils.AjaxPaginator = (function () {
    function AjaxPaginator(options) {
        this.refresh = bind(this.refresh, this);
        this.search = bind(this.search, this);
        if ((options != null ? options.url : void 0) == null) {
            throw new Error("Url is required");
        }
        this.limit = options.limit || 10;
        this.maxPagesVisible = options.maxPagesVisible || 5;
        this.list = ko.observableArray([]);
        if (((options != null ? options.subscribe : void 0) != null) && _.isFunction(options.subscribe)) {
            this.list.subscribe(options.subscribe);
        }
        this.$paginationSelector = $(options.paginationSelector);
        this.hasData = ko.computed((function (_this) {
            return function () {
                return _this.list().length > 0;
            };
        })(this));
        this.url = options.url;
        this.query = {};
        this.currentPage = 1;
    }

    AjaxPaginator.prototype.search = function (query, page) {
        if (page == null) {
            page = 1;
        }
        this.currentPage = page;
        this.query = query || {};
        this.query.limit = this.query.limit || this.limit;
        this.query.page = page;
        this.query = utils.addCsrf(this.query, csrf);
        this.list([]);
        return utils.postJSON(this.url, JSON.stringify(this.query), (function (_this) {
            return function (data) {
                var pagerOpts;
                _this.list(data.list);
                pagerOpts = {
                    div: _this.$paginationSelector,
                    offset: (data.page - 1) * data.limit,
                    limit: _this.limit,
                    total: data.total,
                    onClick: function (e, page) {
                        e.preventDefault();
                        if (page.enabled) {
                            return _this.search(query, parseInt(page.offset / _this.limit) + 1);
                        }
                    }
                };
                return pager.gen(pagerOpts);
            };
        })(this));
    };

    AjaxPaginator.prototype.refresh = function () {
        return this.search(this.query, this.currentPage);
    };

    return AjaxPaginator;

})();

utils.Paginator = (function () {
    function Paginator(options) {
        this.resetFilters = bind(this.resetFilters, this);
        this.changeElementInList = bind(this.changeElementInList, this);
        this.hasProperty = bind(this.hasProperty, this);
        this.filterList = bind(this.filterList, this);
        this.filter = bind(this.filter, this);
        this.paginate = bind(this.paginate, this);
        this.calculateTotalPages = bind(this.calculateTotalPages, this);
        this.internalRun = bind(this.internalRun, this);
        this.start = bind(this.start, this);
        var filter;
        this.originalOptions = options;
        this.limit = options.limit || 4;
        this.maxPagesVisible = options.maxPagesVisible || 5;
        this.unfilteredList = [];
        this.originalList = [];
        this.lastPageOffset = null;
        this.list = ko.observableArray([]);
        if (((options != null ? options.subscribe : void 0) != null) && _.isFunction(options.subscribe)) {
            this.list.subscribe(options.subscribe);
        }
        this.$paginationSelector = $(options.paginationSelector);
        this.hasData = ko.observable(false);
        this.total = ko.observable(0);
        this.currentPage = 0;
        this.canFilter = ko.observable(false);
        if (((options != null ? options.filters : void 0) != null) && _.isObject(options.filters) && !(_.isEmpty(options.filters))) {
            this.canFilter(true);
            this.filters = ko.observable(ko.mapping.fromJS(options.filters));
            for (filter in options.filters) {
                this.filters()[filter].subscribe((function (_this) {
                    return function (value) {
                        return _.defer(function () {
                            return _this.filter();
                        });
                    };
                })(this));
            }
        }
    }

    Paginator.prototype.start = function (originalList) {
        this.unfilteredList = originalList;
        this.hasData(originalList.length > 0);
        return this.internalRun(originalList);
    };

    Paginator.prototype.internalRun = function (originalList) {
        this.total(originalList.length);
        this.originalList = originalList;
        this.$paginationSelector.empty();
        this.lastPageOffset = this.currentPage;
        return this.paginate(this.currentPage);
    };

    Paginator.prototype.calculateTotalPages = function () {
        var calculated, isInt;
        if (this.originalList.length > 0) {
            calculated = this.originalList.length / this.limit;
            isInt = calculated % 1 === 0;
            if (isInt) {
                return calculated;
            } else {
                return parseInt(calculated) + 1;
            }
        }
        return 0;
    };

    Paginator.prototype.paginate = function (offset) {
        var end, pagerOpts, start, temp;
        this.currentPage = parseInt(offset / this.limit);
        temp = _.clone(this.originalList);
        start = this.limit * this.currentPage;
        end = start + this.limit;
        temp = temp.slice(start, end);
        this.list(temp);
        pagerOpts = {
            div: this.$paginationSelector,
            offset: offset,
            limit: this.limit,
            total: this.originalList.length,
            onClick: (function (_this) {
                return function (e, page) {
                    e.preventDefault();
                    if (page.enabled) {
                        _this.lastPageOffset = page.offset;
                        return _this.paginate(page.offset);
                    }
                };
            })(this)
        };
        return pager.gen(pagerOpts);
    };

    Paginator.prototype.filter = function () {
        var customFilter, filter, name, ref, temp;
        temp = _.clone(this.unfilteredList);
        for (filter in this.originalOptions.filters) {
            if (!(indexOf.call(this.originalOptions.ignoreFilters || [], filter) >= 0)) {
                temp = this.filterList(temp, filter, this.filters()[filter]());
            }
        }
        if (_.isObject(this.originalOptions.customFilters)) {
            ref = this.originalOptions.customFilters;
            for (name in ref) {
                customFilter = ref[name];
                if (_.isFunction(customFilter)) {
                    temp = customFilter(temp, ko.mapping.toJS(this.filters));
                }
            }
        }
        return this.internalRun(temp);
    };

    Paginator.prototype.filterList = function (list, key, value) {
        var array, e, i, len, patt;
        if (value === null || value === void 0) {
            value = "";
        }
        if (!_.isDate(value)) {
            if (value && _.contains(this.originalOptions.exactMatch || [], key)) {
                patt = new RegExp('^' + value + '$', 'i');
            } else {
                patt = new RegExp(value, 'i');
            }
        } else {
            patt = null;
        }
        array = [];
        for (i = 0, len = list.length; i < len; i++) {
            e = list[i];
            if (this.hasProperty(e, key, value, patt)) {
                array.push(e);
            }
        }
        return array;
    };

    Paginator.prototype.hasProperty = function (element, key, value, pattern) {
        var v;
        v = utils.getProperty(element, key);
        if (pattern) {
            return pattern.test(v);
        } else if (_.isDate(value)) {
            return moment(value).isSame(moment(v), 'day');
        } else {
            return true;
        }
    };

    Paginator.prototype.changeElementInList = function (f, object) {
        var page;
        if (!_.isFunction(f)) {
            return;
        }
        _.each(this.unfilteredList, (function (_this) {
            return function (c) {
                if (f(c, object)) {
                    return _this.unfilteredList[_this.unfilteredList.indexOf(c)] = object;
                }
            };
        })(this));
        page = this.lastPageOffset;
        this.start(this.unfilteredList);
        this.filter();
        return this.paginate(page);
    };

    Paginator.prototype.resetFilters = function () {
        var filter, results;
        results = [];
        for (filter in this.originalOptions.filters) {
            results.push(this.filters()[filter](null));
        }
        return results;
    };

    return Paginator;

})();
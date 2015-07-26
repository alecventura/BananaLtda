var newReservation = {
    'branch_fk': null,
    'room_fk': null,
    'startdate': "2015-04-27T03:00:00.000Z",
    'enddate': "2015-04-27T03:00:00.000Z",
    'starttime': 460,  //Armazena a hora em minutos a partir da meia noite (Ex: meia noite é 0 minutos, meia noite e meia é 30min e por ai vai).
    'endtime': 460,
    'responsible': "",
    'description': "",
    'coffee': 0,
    'id': -1
}
var request = { 'limit': 10, 'offset': 0 }

function BookViewModel() {
    var self = this;
    self.branches = ko.observableArray([])
    self.rooms = ko.observableArray([]);
    self.reservations = ko.observableArray([]);
    self.request = ko.observable(ko.mapping.fromJS(request))
    self.isVisible = ko.observable(false);
    self.objModal = ko.observable(ko.mapping.fromJS(newReservation));

    self.linkedRooms = ko.computed(function () {
        var array = [];
        _.each(self.rooms(), function (item) {
            if (item.branch_fk == self.objModal().branch_fk()) {
                array.push(item);
            }
        })
        return array;
    });

    self.hasSelectedBranch = ko.computed(function () {
        return self.objModal().branch_fk() != null && self.objModal().branch_fk() > 0;
    });

    self.onEditClicked = function (item) {
        self.objModal(ko.mapping.fromJS(item));
        self.isVisible(true);
    }

    self.onCancelClicked = function (item) {
        bootbox.confirm("Are you sure you want to cancel the reservertion of the room=" + item.name + "?", function (result) {
            if (result) {
                var deep = _.cloneDeep(newReservation);
                deep.id = item.id
                $.ajax({
                    type: "POST",
                    url: "Machines.aspx/removeMachine",
                    contentType: "application/json; charset=utf-8",
                    data: '{book: ' + JSON.stringify(deep) + '}',
                    dataType: 'json',
                    success: function (response) {
                        self.findBookings(0, false);
                        toastr.success("Reservertion successfully canceled!");
                    },
                    failure: function (response) {
                        alert(response);
                    },
                    error: function (response) {
                        alert(response);
                    }
                });
            }
        });

    }

    self.mountRequest = function () {
        return JSON.stringify({ 'request': ko.mapping.toJS(self.request) });
    }

    self.onSaveClicked = function () {
        utils.clearErrors();
        $.ajax({
            type: "POST",
            url: "/Book/Create",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(ko.mapping.toJS(self.objModal)),
            dataType: 'json',
            success: function (response) {
                if (response.status != null) {
                    if (response.status == 400) {
                        _.each(response.validationErrors, function (item) {
                            utils.handleValidationError(item);
                        })
                    } else if (response.status == 200) {
                        self.searchReservations(0, false);
                        self.isVisible(false);
                        $('.modal-backdrop').remove();
                        toastr.success("Reserva efetuada!");
                    } else {
                        toastr.warning(response.message)
                    }
                }
            },
            failure: function (response) {
                alert(response);
            },
            error: function (response) {
                alert(response);
            }
        });
    }

    self.searchReservations = function (offset, showmessage) {
        self.request().offset(offset);
        return utils.postJSON("/Book/GetList", self.mountRequest(), function (data) {
            data = data.d;
            self.request().offset(data.offset);
            if (data.total === 0) {
                if (showmessage) {
                    toastr.success("No reservation found!");
                }
                self.machines([]);
            } else {
                if (showmessage) {
                    toastr.success("Successfully found" + data.total + " machines!");
                }
                self.machines(data.list);
                self.generatePager(data, self);
            }
        });
    };

    self.generatePager = (function (self) {
        return function (data, self) {
            var pagerOpts;
            pagerOpts = {
                div: $('#pager'),
                offset: data.offset,
                limit: self.request().limit(),
                total: data.total,
                onClick: function (e, page) {
                    e.preventDefault();
                    if (page.enabled) {
                        return self.searchReservations(page.offset, false);
                    }
                }
            };
            return pager.gen(pagerOpts);
        };
    })();

    self.loadBranches = function () {
        $.ajax({
            type: "GET",
            url: "/Branches/GetList",
            dataType: 'json',
            success: function (response) {
                self.branches(response);
            },
            failure: function (response) {
                alert(response);
            },
            error: function (response) {
                alert(response);
            }
        });
    }

    self.loadRooms = function () {
        $.ajax({
            type: "GET",
            url: "/Rooms/GetList",
            dataType: 'json',
            success: function (response) {
                self.rooms(response);
            },
            failure: function (response) {
                alert(response);
            },
            error: function (response) {
                alert(response);
            }
        });
    }

    self.loadBranches();
    self.loadRooms();
    //self.findBookings(0, false);
}

$(document).ready(function () {
    ko.applyBindings(new BookViewModel(), document.getElementById('books-content'));
});
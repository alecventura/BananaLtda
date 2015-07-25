var newReservation = { 'branch_fk': null, 'room_fk': null, 'responsible': null, 'id': -1 }
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
        $.ajax({
            type: "POST",
            url: "Machines.aspx/saveMachine",
            contentType: "application/json; charset=utf-8",
            data: '{machine: ' + JSON.stringify(ko.mapping.toJS(self.objModal)) + '}',
            dataType: 'json',
            success: function (response) {
                self.search(0, false);
                self.isVisible(false);
                $('.modal-backdrop').remove();
                toastr.success("Machine successfully saved!");
            },
            failure: function (response) {
                alert(response);
            },
            error: function (response) {
                alert(response);
            }
        });
    }

    self.findBookings = (function () {
        return function (offset, showmessage) {
            self.request().offset(offset);
            return utils.postJSON("Machines.aspx/searchMachines", self.mountRequest(), function (data) {
                data = data.d;
                self.request().offset(data.offset);
                if (data.total === 0) {
                    if (showmessage) {
                        toastr.success("No machine found!");
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
    })();

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
                        return self.findBookings(page.offset, false);
                    }
                }
            };
            return pager.gen(pagerOpts);
        };
    })();

    self.loadBranches = function () {
        $.ajax({
            type: "GET",
            url: "/Branches/GetBranches",
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
            url: "/Rooms/GetRooms",
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
﻿function CreateReservationViewModel() {
    var self = this;
    self.branches = ko.observableArray(ViewBagBranches)
    self.rooms = ko.observableArray(ViewBagRooms);
    self.selectedBranch = ko.observable(ModelSelectedBranch);
    self.selectedRoom = ko.observable(ModelSelectedRoom);

    self.hasCoffee = ko.observable();

    self.availableRooms = ko.computed(function () {
        var array = [];
        _.each(self.rooms(), function (item) {
            if (item.branch_fk == self.selectedBranch()) {
                array.push(item);
            }
        })
        return array;
    });

    self.hasSelectedBranch = ko.computed(function () {
        return self.selectedBranch() != null && self.selectedBranch() > 0;
    });
}


$(document).ready(function () {
    ko.applyBindings(new CreateReservationViewModel(), document.getElementById('create-reservation'));

    $('.datetimepicker').datetimepicker(); //Initialise any date pickers
});
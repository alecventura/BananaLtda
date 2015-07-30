var newReservation = {
    'branch_fk': null,
    'room_fk': null,
    'startdate': moment().startOf('day').toDate(), // Inicia com a data atual
    'enddate': moment().startOf('day').toDate(),
    'starttime': 480,  //Armazena a hora em minutos a partir da meia noite (Ex: meia noite é 0 minutos, meia noite e meia é 30min e por ai vai).
    'endtime': 480, // 480  representa 8h da manha
    'responsible': "",
    'description': "",
    'coffee': 0,
    'id': -1
}

function CalendarViewModel() {
    var self = this;
    self.branches = ko.observableArray(ViewBagBranches)
    self.rooms = ko.observableArray(ViewBagRooms);
    self.selectedBranch = ko.observable(ModelSelectedBranch);
    self.selectedRoom = ko.observable(ModelSelectedRoom);
    self.isVisible = ko.observable(false);

    self.hasCoffee = ko.observable(ModelNeedCoffee);

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

    self.onEditClicked = function (item) {
        self.hasCoffee(item.coffee != null && item.coffee > 0);
        self.isVisible(true);
    }

    self.onCreateClicked = function (date) {
        self.hasCoffee(false);
        self.isVisible(true);
    }
}


$(document).ready(function () {
    ko.applyBindings(new CalendarViewModel(), document.getElementById('calendar-body'));

    $('.datetimepicker').datetimepicker(); //Initialise any date pickers
});
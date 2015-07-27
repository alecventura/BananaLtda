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

// Se starttime ou endtime vier com valor nulo, coloca zero. 
var mapping = {
    'endtime': {
        update: function (options) {
            return options.data || 0;
        }
    }, 'starttime': {
        update: function (options) {
            return options.data || 0;
        }
    }
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
        mapedObj = ko.mapping.fromJS(item, mapping);
        self.objModal(mapedObj);
        self.objModal().room_fk(item.room_fk);
        self.isVisible(true);
    }

    self.onRemoveClicked = function (item) {
        bootbox.confirm("Tem certeza que deseja cancelar a reserva da sala=" + item.roomName + "?", function (result) {
            if (result) {
                $.ajax({
                    type: "POST",
                    url: "/Book/Delete/" + item.id,
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (response) {
                        self.searchReservations(0, false);
                        toastr.success("Reserva removida com sucesso!");
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

    self.onSaveClicked = function () {
        utils.clearErrors();
        data = ko.mapping.toJS(self.objModal);
        if (data.starttime == null || data.starttime == 'undefined')
            data.starttime = 0
        if (data.endtime == null || data.endtime == 'undefined')
            data.endtime = 0
        $.ajax({
            type: "POST",
            url: "/Book/Save",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (response) {
                if (response.status != null) {
                    if (response.status == 400) {
                        utils.handleValidationErrors(response);
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

    self.mountRequest = function () {
        return JSON.stringify({ 'request': ko.mapping.toJS(self.request) });
    }

    self.searchReservations = function (offset, showmessage) {
        self.request().offset(offset);
        $.ajax({
            type: "GET",
            url: "/Book/GetList?limit=" + self.request().limit() + "&offset=" + self.request().offset(),
            dataType: 'json',
            success: function (data) {
                self.request().offset(data.offset);
                if (data.total === 0) {
                    if (showmessage) {
                        toastr.success("Nenhuma reserva encontrada!");
                    }
                    self.reservations([]);
                } else {
                    if (showmessage) {
                        toastr.success("Foram encontradas " + data.total + " reservas!");
                    }
                    parsedList = self.parseReservations(data.list);
                    self.reservations(parsedList);
                    self.generatePager(data, self);
                }
            },
            failure: function (response) {
                alert(response);
            },
            error: function (response) {
                alert(response);
            }
        });
    };

    // Metodo para transformar os dados que vieram do web-services mais user-friendly
    self.parseReservations = function (list) {
        _.each(list, function (item) {
            branch = _.find(self.branches(), function (i) { return i.id == item.branch_fk });
            item.branchName = branch.name;
            room = _.find(self.rooms(), function (i) { return i.id == item.room_fk });
            item.roomName = room.name;

            item.startdateFormated = moment(item.startdate).format('DD/MM/YYYY HH:mm');
            item.enddateFormated = moment(item.enddate).format('DD/MM/YYYY HH:mm');
        })

        return list;
    }

    self.generatePager = (function (self) {
        return function (data, self) {
            var pagerOpts;
            pagerOpts = {
                div: $('#pager-reservations'),
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

    // Só carrega as reservas depois de carregar o array de filiais e o array de salas
    loadReservations = ko.computed(function () {
        if (self.branches().length > 0 && self.rooms().length > 0)
            self.searchReservations(0, true);
    });

}

$(document).ready(function () {
    ko.applyBindings(new BookViewModel(), document.getElementById('books-content'));
});
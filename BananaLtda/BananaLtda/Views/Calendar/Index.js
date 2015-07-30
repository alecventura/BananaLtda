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

// View model do modal de criar/editar eventos, é o javascript da página _CreateEvent.cshtml
function CreateEventViewModel(isVisible) {
    var self = this;
    self.branches = ko.observableArray(ViewBagBranches)
    self.rooms = ko.observableArray(ViewBagRooms);
    self.selectedBranch = ko.observable(ModelSelectedBranch);
    self.selectedRoom = ko.observable(ModelSelectedRoom);
    self.isVisible = isVisible;

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

    self.onSaveClicked = function () {

        var booking = {
            id: -1,
            branch_fk: $("#branch_fk").val(),
            room_fk: $("#room_fk").val(),
            startDate: $("#startDate").val(),
            endDate: $("#endDate").val(),
            responsable: $("#responsable").val(),
            description: $("#description").val(),
            coffee: $("#coffee").val()
        };

        var self2 = $(this);
        $.ajax({
            url: '/Calendar/CreateEvent',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(booking),
            success: function (data) {
                if (data.success == true) {
                    $('.modal').modal('hide');
                    location.reload(false)
                } else {
                    $('#modal-content').html(data);
                    var element = document.getElementById('modal-content');
                    self.reapplyBindings(element);
                    self.selectedBranch(ModelSelectedBranch);
                    self.selectedRoom(ModelSelectedRoom);
                    self.hasCoffee(ModelNeedCoffee);
                }
            }
        });
    }

    self.reapplyBindings = function (element) {
        var vm = ko.dataFor(element);
        if (vm) {
            ko.cleanNode(element);
            ko.applyBindings(vm, element);
        }
    };
}

// View model da página Index.cshtml, reponsável por renderizar e popular o calendário
function CalendarViewModel() {
    var self = this;

    self.isVisible = ko.observable(false);

    self.applyBindingsOrReapply = function () {
        var element = document.getElementById('modal-content');

        var vm = ko.dataFor(element);
        if (vm.branches != null) {
            ko.cleanNode(element);
            ko.applyBindings(vm, element);
        } else {
            ko.applyBindings(new CreateEventViewModel(self.isVisible), element);
        }
    };

    self.onCreateClicked = function (date) {
        // Formatando a data para retirar o bug do próprio framework que não suporta timezones no dayClick:
        date = date.format();
        var start = { start: date };
        $.ajax({
            url: '/Calendar/OpenModalCreate',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(start),
            success: function (data) {
                $('#modal-content').html(data);
                $('.datetimepicker').datetimepicker(); // Inicializa os datetimepickers, tive que chamar depois de renderizar o modal, não sei porque não funcionou chamando na própria partial view
                self.applyBindingsOrReapply();
                self.isVisible(true);
            }
        });
    }

    self.onEditClicked = function (event) {
        var id = { id: event.id };
        $.ajax({
            url: '/Calendar/OpenModalEdit',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(id),
            success: function (data) {
                $('#modal-content').html(data);
                $('.datetimepicker').datetimepicker();
                self.applyBindingsOrReapply();
                self.isVisible(true);
            }
        });
    }

    self.initializeCalendar = function () {
        $('#calendar').fullCalendar({
            // Configurações de lingua para o portugues:
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            buttonText: {
                prev: 'anterior', next: 'próximo', prevYear: 'ano anterior', nextYear: 'próximo ano',
                today: 'Hoje', month: 'mês', week: 'semana', day: 'dia'
            },
            columnFormat: { week: 'ddd D/M' },
            allDayText: 'dia todo',
            axisFormat: 'H:mm',
            timeFormat: 'H(:mm)',
            // Fim da configuração de lingua
            timezone: 'local',
            eventStartEditable: false,

            media: "print",
            displayEventEnd: true,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay'
            },
            editable: true,
            eventLimit: true,
            events: ViewBagEvents,
            dayClick: function (date, jsEvent, view) {
                self.onCreateClicked(date);
            },
            eventClick: function (event, jsEvent, view) {
                self.onEditClicked(event);
            }
        });
    }

    self.initializeCalendar();
}


$(document).ready(function () {
    ko.applyBindings(new CalendarViewModel(), document.getElementById('calendar-body'));

    var reapplyBindings = function (element) {
        var vm = ko.dataFor(element);
        if (vm) {
            ko.cleanNode(element);
            ko.applyBindings(vm, element);
        }
    };
});
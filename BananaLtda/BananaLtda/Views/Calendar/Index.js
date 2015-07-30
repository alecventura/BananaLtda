function CalendarViewModel() {
    var self = this;

    self.isVisible = ko.observable(false);

    self.onCreateClicked = function (date) {
        $.get('/Calendar/CreateEvent', function (data) {
            $('#modal-content').html(data);
            self.isVisible(true);
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

            }
        });
    }

    self.initializeCalendar();
}


$(document).ready(function () {
    ko.applyBindings(new CalendarViewModel(), document.getElementById('calendar-body'));
});
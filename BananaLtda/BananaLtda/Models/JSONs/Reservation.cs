using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BananaLtda.Models.JSONs
{
    public class Reservation
    {
        public int id { get; set; }
        [Required]
        //[StringLength(30, MinimumLength = 3, ErrorMessage = "Invalid")]
        public int branch_fk { get; set; }
        [Required]
        public int room_fk { get; set; }
        [Required]
        public DateTime startdate { get; set; }
        [Required]
        public DateTime enddate { get; set; }
        public int starttime { get; set; }
        public int endtime { get; set; }
        [Required]
        public string responsible { get; set; }
        [Required]
        public string description { get; set; }
        public int coffee { get; set; }


        public static Reservation mapToJSON(booking item)
        {
            Reservation json = new Reservation();
            json.id = item.id;
            json.branch_fk = item.branch_fk;
            json.room_fk = item.room_fk;
            json.responsible = item.responsable;
            json.startdate = item.startDate;
            json.starttime = (item.startDate.Hour * 60) + item.startDate.Minute; // Conversao necessaria já que as horas sao usadas em minutos no client-side.
            json.endtime = (item.endDate.Hour * 60) + item.endDate.Minute;
            json.enddate = item.endDate;
            json.description = item.description;
            if (item.coffee != null)
                json.coffee = (int)item.coffee;

            return json;
        }

        internal static booking map(Reservation json)
        {
            booking b = new booking();
            b.branch_fk = json.branch_fk;
            b.room_fk = json.room_fk;
            b.responsable = json.responsible;

            // Calcula o startDate (tem que pegar o dia do json.startdate e as horas do json.starttime e converter esses 2 valores em um unico DateTime)
            DateTime sd = json.startdate;
            TimeSpan tsSd = new TimeSpan(Convert.ToInt32(json.starttime / 60), Convert.ToInt32(json.starttime % 60), 0);
            sd = sd.Date + tsSd;

            // Calcula o endDate
            DateTime ed = json.enddate;
            TimeSpan tsEd = new TimeSpan(Convert.ToInt32(json.endtime / 60), Convert.ToInt32(json.endtime % 60), 0);
            sd = sd.Date + tsEd;

            b.startDate = sd;
            b.endDate = ed;
            b.description = json.description;
            if (json.coffee != null && json.coffee > 0)
                b.coffee = json.coffee;

            return b;
        }
    }
}
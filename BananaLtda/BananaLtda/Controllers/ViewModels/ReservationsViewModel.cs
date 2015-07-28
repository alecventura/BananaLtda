using BananaLtda.Models.JSONs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BananaLtda.Controllers.ViewModels
{
    public class ReservationsViewModel
    {
        public List<Reservation> reservations { get; set; }
        public List<SelectListItem> rooms { get; set; }
        public List<SelectListItem> branches { get; set; }

        internal static List<SelectListItem> map(List<Room> rooms)
        {
            List<SelectListItem> select = new List<SelectListItem>();
            foreach (var room in rooms)
            {
                SelectListItem item = new SelectListItem() { Text = room.name, Value = room.id.ToString() };
                select.Add(item);
            }
            return select;
        }

        internal static List<SelectListItem> map(List<Branch> branches)
        {
            List<SelectListItem> select = new List<SelectListItem>();
            foreach (var branch in branches)
            {
                SelectListItem item = new SelectListItem() { Text = branch.name, Value = branch.id.ToString() };
                select.Add(item);
            }
            return select;
        }
    }
}
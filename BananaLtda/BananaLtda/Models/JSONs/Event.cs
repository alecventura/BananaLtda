using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Models.JSONs
{
    public class Event
    {
        public DateTime start { get; set; }
        public DateTime end { get; set; }
        public string title { get; set; }

        internal static List<Event> map(List<booking> list)
        {
            List<Event> eventList = new List<Event>();
            foreach (booking item in list)
            {
                eventList.Add(Event.map(item));
            }
            return eventList;
        }

        internal static Event map(booking item)
        {
            Event e = new Event();
            e.start = item.startDate;
            e.end = item.endDate;
            e.title = item.description;
            return e;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Models.JSONs
{
    public class Room
    {
        public int id { get; set; }
        public string name { get; set; }
        public int branch_fk { get; set; }

        public static Room mapToJSON(room item)
        {
            Room json = new Room();
            json.id = item.id;
            json.name = item.name;
            json.branch_fk = (int)item.branch_fk;
            return json;
        }
    }
}
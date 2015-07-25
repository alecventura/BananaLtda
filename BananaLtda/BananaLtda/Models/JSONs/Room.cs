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
    }
}
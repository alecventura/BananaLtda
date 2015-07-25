using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Models.JSONs
{
    public class Branch
    {
        public int id { get; set; }
        public string name { get; set; }

        public static Branch mapToJSON(branch item)
        {
            Branch json = new Branch();
            json.id = item.id;
            json.name = item.name;
            return json;
        }
    }
}
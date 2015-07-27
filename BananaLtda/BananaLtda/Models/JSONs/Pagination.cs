using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Models.JSONs
{
    public class Pagination
    {
        public List<GenericItemJSON> list { get; set; }
        public int total { get; set; }
        public int offset { get; set; }

        public Pagination(List<GenericItemJSON> list, int total, int offset)
        {
            this.list = list;
            this.total = total;
            this.offset = offset;
        }
    }
}
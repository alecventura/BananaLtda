using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Controllers
{
    public class ValidationError
    {
        public string path { get; set; }
        public string error { get; set; }

        public ValidationError(string path, string error)
        {
            this.path = path;
            this.error = error;
        }
    }
}
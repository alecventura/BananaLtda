using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BananaLtda.Controllers
{
    public class Answer
    {
        public Answer(int status, string message)
        {
            this.status = status;
            this.message = message;
        }

        public Answer(int status, string message, List<ValidationError> validationErrors)
        {
            this.status = status;
            this.message = message;
            this.validationErrors = validationErrors;
        }

        public Answer() { }

        public int status { get; set; }

        public string message { get; set; }

        public List<ValidationError> validationErrors { get; set; }
    }
}
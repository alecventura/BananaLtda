using BananaLtda.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BananaLtda.Controllers
{
    public class HomeController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        public ActionResult Index()
        {
            return View();
        }

    }
}
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BananaLtda.Models;
using BananaLtda.Models.JSONs;

namespace BananaLtda.Controllers
{
    public class BranchesController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // Web Services para retornar a lista de matriz + filiais
        // GET: Branches
        public JsonResult GetBranches()
        {
            List<branch> branchesFromModel = db.branches.ToList();
            List<Branch> branchesJSON = new List<Branch>();

            foreach (var item in branchesFromModel)
            {
                branchesJSON.Add(mapToJSON(item));
            }
            return Json(branchesJSON, JsonRequestBehavior.AllowGet);
        }

        private Branch mapToJSON(branch item)
        {
            Branch json = new Branch();
            json.id = item.id;
            json.name = item.name;
            return json;
        }

        // Abaixo tem os outros Web Services criados pelo framework MVC, que foram comentados pois não nos interessa neste momento criar ou editar novas branches pela App,
        // só é possível fazer isso pelo banco atualmente.

        //// GET: Branches/Details/5
        //public ActionResult Details(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    branch branch = db.branches.Find(id);
        //    if (branch == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(branch);
        //}

        //// GET: Branches/Create
        //public ActionResult Create()
        //{
        //    return View();
        //}

        //// POST: Branches/Create
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Create([Bind(Include = "id,name")] branch branch)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.branches.Add(branch);
        //        db.SaveChanges();
        //        return RedirectToAction("Index");
        //    }

        //    return View(branch);
        //}

        //// GET: Branches/Edit/5
        //public ActionResult Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    branch branch = db.branches.Find(id);
        //    if (branch == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(branch);
        //}

        //// POST: Branches/Edit/5
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Edit([Bind(Include = "id,name")] branch branch)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Entry(branch).State = EntityState.Modified;
        //        db.SaveChanges();
        //        return RedirectToAction("Index");
        //    }
        //    return View(branch);
        //}

        //// GET: Branches/Delete/5
        //public ActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    branch branch = db.branches.Find(id);
        //    if (branch == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(branch);
        //}

        //// POST: Branches/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public ActionResult DeleteConfirmed(int id)
        //{
        //    branch branch = db.branches.Find(id);
        //    db.branches.Remove(branch);
        //    db.SaveChanges();
        //    return RedirectToAction("Index");
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}
    }
}

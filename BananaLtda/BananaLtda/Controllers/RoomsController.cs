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
    public class RoomsController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // Web Services para retornar a lista de salas
        // GET: Rooms
        public JsonResult GetList()
        {
            //var rooms = db.rooms.Include(r => r.branch);

            List<room> roomsFromModel = db.rooms.ToList();
            List<Room> roomsJSON = new List<Room>();

            foreach (var item in roomsFromModel)
            {
                roomsJSON.Add(Room.mapToJSON(item));
            }
            return Json(roomsJSON, JsonRequestBehavior.AllowGet);
        }

        // Abaixo tem os outros Web Services criados pelo framework MVC, que foram comentados pois não nos interessa neste momento criar ou editar novas branches pela App,
        // só é possível fazer isso pelo banco atualmente.

        //// GET: Rooms/Details/5
        //public ActionResult Details(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    room room = db.rooms.Find(id);
        //    if (room == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(room);
        //}

        //// GET: Rooms/Create
        //public ActionResult Create()
        //{
        //    ViewBag.branch_fk = new SelectList(db.branches, "id", "name");
        //    return View();
        //}

        //// POST: Rooms/Create
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Create([Bind(Include = "id,branch_fk,name")] room room)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.rooms.Add(room);
        //        db.SaveChanges();
        //        return RedirectToAction("Index");
        //    }

        //    ViewBag.branch_fk = new SelectList(db.branches, "id", "name", room.branch_fk);
        //    return View(room);
        //}

        //// GET: Rooms/Edit/5
        //public ActionResult Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    room room = db.rooms.Find(id);
        //    if (room == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    ViewBag.branch_fk = new SelectList(db.branches, "id", "name", room.branch_fk);
        //    return View(room);
        //}

        //// POST: Rooms/Edit/5
        //// To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        //// more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public ActionResult Edit([Bind(Include = "id,branch_fk,name")] room room)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Entry(room).State = EntityState.Modified;
        //        db.SaveChanges();
        //        return RedirectToAction("Index");
        //    }
        //    ViewBag.branch_fk = new SelectList(db.branches, "id", "name", room.branch_fk);
        //    return View(room);
        //}

        //// GET: Rooms/Delete/5
        //public ActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    room room = db.rooms.Find(id);
        //    if (room == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(room);
        //}

        //// POST: Rooms/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public ActionResult DeleteConfirmed(int id)
        //{
        //    room room = db.rooms.Find(id);
        //    db.rooms.Remove(room);
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

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BananaLtda.Models;
using Newtonsoft.Json;
using BananaLtda.Models.JSONs;

namespace BananaLtda.Controllers
{
    public class ReservationController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // GET: Reservation
        public ActionResult Index()
        {
            var bookings = db.bookings.Include(b => b.branch).Include(b => b.room);
            return View(bookings.ToList());
        }

        // GET: Reservation/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            booking booking = db.bookings.Find(id);
            if (booking == null)
            {
                return HttpNotFound();
            }
            return View(booking);
        }

        // GET: Reservation/Create
        public ActionResult Create()
        {
            ViewBag.branches = LoadBranches();
            ViewBag.rooms = LoadRooms();

            return View();
        }

        // POST: Reservation/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "id,branch_fk,room_fk,startDate,endDate,responsable,description,coffee")] booking booking)
        {
            if (ModelState.IsValid)
            {
                db.bookings.Add(booking);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.branches = LoadBranches();
            ViewBag.rooms = LoadRooms();
            return View(booking);
        }

        // GET: Reservation/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            booking booking = db.bookings.Find(id);
            if (booking == null)
            {
                return HttpNotFound();
            }
            ViewBag.branch_fk = new SelectList(db.branches, "id", "name", booking.branch_fk);
            ViewBag.room_fk = new SelectList(db.rooms, "id", "name", booking.room_fk);
            return View(booking);
        }

        // POST: Reservation/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "id,branch_fk,room_fk,startDate,endDate,responsable,description,coffee")] booking booking)
        {
            if (ModelState.IsValid)
            {
                db.Entry(booking).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.branch_fk = new SelectList(db.branches, "id", "name", booking.branch_fk);
            ViewBag.room_fk = new SelectList(db.rooms, "id", "name", booking.room_fk);
            return View(booking);
        }

        // GET: Reservation/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            booking booking = db.bookings.Find(id);
            if (booking == null)
            {
                return HttpNotFound();
            }
            return View(booking);
        }

        // POST: Reservation/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            booking booking = db.bookings.Find(id);
            db.bookings.Remove(booking);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private List<Branch> LoadBranches()
        {
            List<branch> branchesFromModel = db.branches.ToList();
            List<Branch> branchesJSON = new List<Branch>();

            foreach (var item in branchesFromModel)
            {
                branchesJSON.Add(Branch.mapToJSON(item));
            }
            return branchesJSON;
        }

        private List<Room> LoadRooms()
        {
            List<room> roomsFromModel = db.rooms.ToList();
            List<Room> roomsJSON = new List<Room>();

            foreach (var item in roomsFromModel)
            {
                roomsJSON.Add(Room.mapToJSON(item));
            }
            return roomsJSON;
        }
    }
}

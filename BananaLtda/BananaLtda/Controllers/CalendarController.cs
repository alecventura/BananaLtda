using BananaLtda.Models;
using BananaLtda.Models.JSONs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BananaLtda.Controllers
{
    public class CalendarController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // GET: Calendar
        public ActionResult Index()
        {
            //// Pega a lista de reservas futuras e disponibiliza para a view
            ViewBag.events = Event.map(db.bookings.ToList());
            return View();
        }


        // POST: Calendar/OpenModalCreate
        [HttpPost]
        public ActionResult OpenModalCreate(DateTime start)
        {
            booking b = new booking();
            b.startDate = start;
            b.endDate = start.AddMinutes(30);
            b.branch_fk = 0;
            b.room_fk = 0;

            ViewBag.branches = LoadBranches();
            ViewBag.rooms = LoadRooms();
            ViewBag.IsRoomFree = true;
            return PartialView("_CreateEvent", b);
        }

        // POST: Calendar/OpenModalEdit
        [HttpPost]
        public ActionResult OpenModalEdit(int id)
        {
            booking b = db.bookings.Where(i => i.id == id).Single();

            ViewBag.branches = LoadBranches();
            ViewBag.rooms = LoadRooms();
            ViewBag.IsRoomFree = true;
            return PartialView("_CreateEvent", b);
        }

        // POST: Calendar/CreateEvent
        [HttpPost]
        public ActionResult CreateEvent([Bind(Include = "id,branch_fk,room_fk,startDate,endDate,responsable,description,coffee")] booking booking)
        {
            ViewBag.IsRoomFree = true;
            if (ModelState.IsValid)
            {
                if (!IsRoomFree(booking))
                {
                    ViewBag.IsRoomFree = false;
                }
                else
                {
                    db.bookings.Add(booking);
                    db.SaveChanges();
                    return Json(new { success = true });
                }
            }

            ViewBag.branches = LoadBranches();
            ViewBag.rooms = LoadRooms();
            return PartialView("_CreateEvent", booking);
        }

        // POST: Calendar/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // POST: Calendar/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        #region Private Methods
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
        private bool IsRoomFree(booking reservation)
        {
            // Logica de validação para ver se a sala ja esta reservada:
            // TODO: revisar a logica para checar o choque de horarios

            var query = from b in db.bookings
                        where b.branch_fk == reservation.branch_fk
                        && b.room_fk == reservation.room_fk
                        && ((reservation.startDate >= b.startDate && reservation.startDate <= b.endDate)
                        || (reservation.endDate >= b.startDate && reservation.endDate <= b.endDate)
                        || (reservation.endDate >= b.endDate && reservation.startDate <= b.startDate)
                        || (reservation.endDate <= b.endDate && reservation.startDate >= b.startDate))
                        select b;

            // Se só tiver o próprio id naquele horario então deixa atualizar
            if (reservation.id > 0)
            {
                query = query.Where(x => x.id != reservation.id);
            }
            bool valid = query.Count() == 0 ? true : false;
            return valid;
        }
        #endregion

    }
}

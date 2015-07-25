using BananaLtda.Models;
using BananaLtda.Models.JSONs;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace BananaLtda.Controllers
{
    public class BookController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // GET: Retorna a lista com todas as reservas.
        public JsonResult GetList()
        {
            List<booking> bookingsFromModel = db.bookings.ToList();
            List<Reservation> reservationsJSON = new List<Reservation>();

            foreach (var item in bookingsFromModel)
            {
                reservationsJSON.Add(Reservation.mapToJSON(item));
            }
            return Json(reservationsJSON, JsonRequestBehavior.AllowGet);
        }

        // GET: Book/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // POST: Web-services para criar uma reserva.
        [HttpPost]
        public JsonResult Create(Reservation json)
        {
            try
            {
                // Valida as anotations dos attributos do objeto de entrada (se é required, maxlenght e etc)
                if (!ModelState.IsValid)
                {
                    List<ValidationError> answerValidationErrors = new List<ValidationError>();
                    var modelStateErrors = this.ModelState.Keys.SelectMany(key => this.ModelState[key].Errors);
                    foreach (var key in this.ModelState.Keys)
                    {
                        if (this.ModelState[key].Errors != null && this.ModelState[key].Errors.Count > 0)
                        {
                            foreach (var error in this.ModelState[key].Errors)
                            {
                                answerValidationErrors.Add(new ValidationError(key, error.ErrorMessage));
                            }
                        }
                    }
                    return Json(new Answer(400, "Validation Error!", answerValidationErrors), JsonRequestBehavior.AllowGet);

                }

                // Transforma o objeto json em um objeto do modelo:
                booking reservation = Reservation.map(json);

                // Verifica se a sala já está reservada naquele período
                if (!IsRoomFree(reservation))
                {
                    return Json(new Answer(200, "Esta sala já está reservada!"), JsonRequestBehavior.AllowGet);
                }

                // Efetua a reserva da sala no banco de dados:
                SaveReservation(reservation);
                return Json(new Answer(200, "OK"));
            }
            catch (DbEntityValidationException dbEx)
            {
                // Se acaso ocorrer algum erro que foi detectado pelo EF e não pelo objeto JSON de entrada:
                List<ValidationError> answerValidationErrors = new List<ValidationError>();
                foreach (var validationErrors in dbEx.EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        answerValidationErrors.Add(new ValidationError(validationError.PropertyName, validationError.ErrorMessage));
                    }
                }
                return Json(new Answer(400, "Validation Error!", answerValidationErrors), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new Answer(500, "Something went wrong: " + ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        private void SaveReservation(booking reservation)
        {
            db.bookings.Add(reservation);
            db.SaveChanges();
        }

        private bool IsRoomFree(booking reservation)
        {
            // Logica de validação para ver se a sala ja esta reservada:
            // TODO: falta checar no intervalo de tempo

            var query = from b in db.bookings
                        where b.branch_fk == reservation.branch_fk
                        && b.room_fk == reservation.room_fk
                        select b;
            bool valid = query.Count() == 0 ? true : false;
            return valid;
        }

        // POST: Book/Edit/5
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

        // POST: Book/Delete/5
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
    }
}

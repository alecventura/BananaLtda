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
    public class ReservationKOController : Controller
    {
        private bananaltdaEntities db = new bananaltdaEntities();

        // GET: ReservationKO/Index
        public ActionResult Index()
        {
            return View();
        }

        // GET: Retorna a lista com todas as reservas.
        // GET: ReservationKO/GetList
        public JsonResult GetList(int limit, int offset)
        {
            if (limit == null || limit == 0)
                limit = 100;

            offset = (offset != null ? offset : 0);

            List<booking> bookingsFromModel = db.bookings.Skip(offset).Take(limit).ToList();
            List<Reservation> reservationsJSON = new List<Reservation>();

            foreach (var item in bookingsFromModel)
            {
                reservationsJSON.Add(Reservation.mapToJSON(item));
            }
            return Json(new Pagination(reservationsJSON.Cast<GenericItemJSON>().ToList(), db.bookings.ToList().Count, offset), JsonRequestBehavior.AllowGet);
        }

        // POST: Web-services para criar uma reserva.
        // POST: ReservationKO/Save
        [HttpPost]
        public JsonResult Save(Reservation json)
        {
            try
            {
                // Valida as anotations dos attributos do json de entrada (se é required, maxlenght e etc)
                if (!ModelState.IsValid)
                {
                    List<ValidationError> answerValidationErrors = GetJSONValidationErrorsList();
                    return Json(new Answer(400, "Validation Error!", answerValidationErrors), JsonRequestBehavior.AllowGet);
                }

                // Transforma o objeto json em um objeto do modelo:
                booking reservation = Reservation.map(json);

                // Verifica se a sala já está reservada naquele período
                if (!IsRoomFree(reservation))
                {
                    return Json(new Answer(400, "Esta sala já está reservada neste horário!"), JsonRequestBehavior.AllowGet);
                }

                if (reservation.id > 0)
                    // Efetua a reserva da sala no banco de dados:
                    UpdateReservation(reservation);
                else
                    SaveReservation(reservation);
                return Json(new Answer(200, "OK"));
            }
            catch (DbEntityValidationException dbEx)
            {
                List<ValidationError> answerValidationErrors = GetModelValidationErrorsList(dbEx);
                return Json(new Answer(400, "Validation Error!", answerValidationErrors), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new Answer(500, "Something went wrong: " + ex.Message), JsonRequestBehavior.AllowGet);
            }
        }

        // POST: ReservationKO/Delete/5
        [HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                DeleteReservation(id);
                return Json(new Answer(200, "OK"));
            }
            catch (Exception ex)
            {
                return Json(new Answer(500, "Something went wrong: " + ex.Message), JsonRequestBehavior.AllowGet);
            }
        }


        #region Private Methods

        private void DeleteReservation(int id)
        {
            var query = from it in db.bookings
                        where it.id == id
                        select it;
            booking b = query.FirstOrDefault();
            db.bookings.Remove(b);
            db.SaveChanges();
        }
        private void SaveReservation(booking reservation)
        {
            db.bookings.Add(reservation);
            db.SaveChanges();
        }
        private void UpdateReservation(booking reservation)
        {
            var query = from it in db.bookings
                        where it.id == reservation.id
                        select it;
            booking b = query.FirstOrDefault();
            b.branch_fk = reservation.branch_fk;
            b.room_fk = reservation.room_fk;
            b.startDate = reservation.startDate;
            b.endDate = reservation.endDate;
            b.responsable = reservation.responsable;
            b.description = reservation.description;
            b.coffee = reservation.coffee;
            db.SaveChanges();
        }
        private List<ValidationError> GetJSONValidationErrorsList()
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
            return answerValidationErrors;
        }

        private List<ValidationError> GetModelValidationErrorsList(DbEntityValidationException dbEx)
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
            return answerValidationErrors;
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
            if (reservation.id != null && reservation.id > 0)
            {
                query = query.Where(x => x.id != reservation.id);
            }
            bool valid = query.Count() == 0 ? true : false;
            return valid;
        }
        #endregion
    }
}

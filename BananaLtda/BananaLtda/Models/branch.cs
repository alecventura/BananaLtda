//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BananaLtda.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class branch
    {
        public branch()
        {
            this.bookings = new HashSet<booking>();
            this.rooms = new HashSet<room>();
        }
    
        public int id { get; set; }
        public string name { get; set; }
    
        public virtual ICollection<booking> bookings { get; set; }
        public virtual ICollection<room> rooms { get; set; }
    }
}

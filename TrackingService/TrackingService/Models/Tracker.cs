using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingService.Models
{
    public class Tracker
    {
        public string Name {get;set;}
        public string Action { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }

    }
}

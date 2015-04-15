using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingService.Models;

namespace TrackingService.Services
{
    public interface ITrackerService
    {
        void SaveTrackerAction(Tracker tracker);
    }
}

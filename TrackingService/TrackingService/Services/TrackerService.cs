using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingService.Models;
using TrackingService.Repository;

namespace TrackingService.Services
{
    public class TrackerService: ITrackerService
    {
        private IRepository<Tracker> trackerRepository;
        public TrackerService() {
            trackerRepository = new ParseObjectRepository<Tracker>();
        }
        public void SaveTrackerAction(Tracker tracker)
        {
            trackerRepository.Add(tracker);
        }
    }
}

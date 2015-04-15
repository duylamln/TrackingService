using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingService
{
    public interface ILogger
    {
        void WriteLog(string message);

    }

    public class FileLogger : ILogger
    {
        
        private StreamWriter sw = null;

        public FileLogger() {
            sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\LogFile.txt", true);
        }

        public void WriteLog(string message)
        {
            var log = String.Format("{0} - {1}: {2}", DateTime.Now, InstallerSetting.Username, message);
            sw.WriteLine(log);
            sw.Flush();
        }
    }

    public class EventLogger : ILogger
    {
        private EventLog eventLog;

        public EventLogger()
        {
            eventLog = new EventLog();
            if (!EventLog.SourceExists("TrackingSource")) {
                EventLog.CreateEventSource("TrackingServiceSource", "TrackingLog");

            }
            eventLog.Source = "TrackingServiceSource";

        }

        public void WriteLog(string message)
        {
            var log = String.Format("{0}: {1}", DateTime.Now, message);
            eventLog.WriteEntry(log);
        }
    }
}

using Microsoft.Win32;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using TrackingService.Models;
using TrackingService.Services;

namespace TrackingService
{
    public partial class TrackingService : ServiceBase
    {
        private ILogger MyLogger;
        private ITrackerService trackerService;

        public TrackingService(ILogger logger, ITrackerService trackerSvc)
        {
            InitializeComponent();
            MyLogger = logger;
            trackerService = trackerSvc;
        }

        protected override void OnStart(string[] args)
        {
            MyLogger.WriteLog("Tracking Service start !");
            trackerService.SaveTrackerAction(new Tracker
            {
                Action = "Tracking Service start !",
                Date = DateTime.Now,
                Description = "Tracking Service start !",
                Name = InstallerSetting.Username
            });
        }

        protected override void OnStop()
        {
            MyLogger.WriteLog("Tracking Service stop !");
            trackerService.SaveTrackerAction(new Tracker
            {
                Action = "Tracking Service stop !",
                Date = DateTime.Now,
                Description = "Tracking Service stop !",
                Name = InstallerSetting.Username
            });
        }


        protected override void OnSessionChange(SessionChangeDescription changeDescription)
        {
            string action = "";

            switch (changeDescription.Reason)
            {
                case SessionChangeReason.ConsoleConnect:
                    action = "Console Connect";
                    break;
                case SessionChangeReason.ConsoleDisconnect:
                    action = "Console Disconnect";
                    break;
                case SessionChangeReason.RemoteConnect:
                    action = "Remote Connect";
                    break;
                case SessionChangeReason.RemoteDisconnect:
                    action = "Remote Disconnect";
                    break;
                case SessionChangeReason.SessionLock:
                    action = "Session Lock";
                    break;
                case SessionChangeReason.SessionLogoff:
                    action = "Session Log off";
                    break;
                case SessionChangeReason.SessionLogon:
                    action = "Session Log on";
                    break;
                case SessionChangeReason.SessionRemoteControl:
                    action = "Session Remote Control";
                    break;
                case SessionChangeReason.SessionUnlock:
                    action = "Session Unlock";
                    break;
                default:
                    break;

            }

            MyLogger.WriteLog(action);
            trackerService.SaveTrackerAction(new Tracker
            {
                Action = action,
                Date = DateTime.Now,
                Description = action,
                Name = InstallerSetting.Username
            });
        }

    }
}

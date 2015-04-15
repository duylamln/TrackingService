using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration.Install;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using TrackingService.Services;

namespace TrackingService
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main(string[] args)
        {
            InstallerSetting.GetInstallerSetting();
            if (Environment.UserInteractive)
            {
                string parameter = string.Concat(args);
                switch (parameter)
                {
                    case "--install":
                        ManagedInstallerClass.InstallHelper(new[] { Assembly.GetExecutingAssembly().Location });
                        break;
                    case "--uninstall":
                        ManagedInstallerClass.InstallHelper(new[] { "/u", Assembly.GetExecutingAssembly().Location });
                        break;
                }
            }
            else
            {
                ILogger logger = new FileLogger();
                ITrackerService trackerService = new TrackerService();


                ServiceBase[] servicesToRun = new ServiceBase[] 
                          { 
                              new TrackingService(logger, trackerService) 
                          };
                ServiceBase.Run(servicesToRun);
            }
        }
    }

    public static class InstallerSetting
    {
        public static string Username { get; set; }
        public static string Password { get; set; }
        public static void GetInstallerSetting()
        {
            StreamReader sr = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + "\\appConfig.txt", true);
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                var lineArr = line.Split('=');
                if (lineArr.Length < 1 && lineArr.Length > 2)
                {
                    return;
                }
                switch (lineArr[0])
                {
                    case "Username":
                        Username = lineArr[1];
                        break;
                    case "Password":
                        Password = lineArr[1];
                        break;
                }

            }

        }
    }
}

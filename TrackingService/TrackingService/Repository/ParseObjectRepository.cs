using Parse;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrackingService.Utils;

namespace TrackingService.Repository
{
   public class ParseObjectRepository<T>: IRepository<T> where T: class
    {
        public ParseObjectRepository() {
            string applicationId = ConfigurationManager.AppSettings["applicationId"];
            string dotNetKey = ConfigurationManager.AppSettings["dotNetKey"];
            ParseClient.Initialize(applicationId, dotNetKey);
        }
        public IEnumerable<T> GetAll
        {
            get { throw new NotImplementedException(); }
        }

        public T GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Add(T entity)
        {
            ParseObject tracker = Utilities.MapModelToParseObject<T>(entity);
            tracker.SaveAsync();
        }

        public void Delete(T entity)
        {
            throw new NotImplementedException();
        }

        public void Update(T entity)
        {
            throw new NotImplementedException();
        }
    }
}

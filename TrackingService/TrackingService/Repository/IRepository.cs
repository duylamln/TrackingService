using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingService.Repository
{
    public interface IRepository<T> where T: class
    {
        IEnumerable<T> GetAll { get; }
        T GetById(int id);
        void Add(T entity);
        void Delete(T entity);
        void Update(T entity);

    }
}

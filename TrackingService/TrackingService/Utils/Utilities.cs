using Parse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackingService.Utils
{
    public static class Utilities
    {
        public static ParseObject MapModelToParseObject<T>(T baseModel) where T : class
        {
            ParseObject parseModel = new ParseObject(baseModel.GetType().Name);
            foreach (var prop in baseModel.GetType().GetProperties())
            {
                parseModel[prop.Name] = prop.GetValue(baseModel);
            }
            return parseModel;
        }

    }
}

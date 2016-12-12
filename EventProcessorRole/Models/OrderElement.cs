/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

using Newtonsoft.Json;

namespace EventProcessorRole.Models
{
    class OrderElement
    {
        [JsonProperty(PropertyName = "size")]
        public int Size { get; set; }

        [JsonProperty(PropertyName = "type")]
        public string Type { get; set; }

        [JsonProperty(PropertyName = "value")]
        public int Value { get; set; }
    }
}

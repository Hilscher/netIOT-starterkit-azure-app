/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

using Newtonsoft.Json;

namespace EventProcessorRole.Models
{
    class OrderInputData
    {
        [JsonProperty(PropertyName = "Order number")]
        public OrderElement OrderNumber { get; set; }

        [JsonProperty(PropertyName = "Serial number")]
        public OrderElement SerialNumber { get; set; }

        [JsonProperty(PropertyName = "Function")]
        public OrderElement Function { get; set; }

        [JsonProperty(PropertyName = "Result")]
        public OrderElement Result { get; set; }

        [JsonProperty(PropertyName = "Error")]
        public OrderElement Error { get; set; }

        [JsonProperty(PropertyName = "Uptime")]
        public OrderElement Uptime { get; set; }

        [JsonProperty(PropertyName = "Duration")]
        public OrderElement Duration { get; set; }
    }
}

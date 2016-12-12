/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

using Microsoft.Azure.Documents;
using Newtonsoft.Json;

namespace EventProcessorRole.Models
{
    class Order : Resource
    {
        [JsonProperty(PropertyName = "Order Input Data")]
        public OrderInputData OrderInputData { get; set; }

        [JsonProperty(PropertyName = "sender")]
        public string Sender { get; set; }

        [JsonProperty(PropertyName = "deviceId")]
        public string DeviceId = "";
    }
}

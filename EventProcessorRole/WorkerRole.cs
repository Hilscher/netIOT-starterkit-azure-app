/*******************************************************************************
* Copyright (c) 2016 Hilscher Gesellschaft fuer Systemautomation mbH
* See LICENCE
********************************************************************************/

using EventProcessorRole.Models;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure.ServiceRuntime;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace EventProcessorRole
{
    public class WorkerRole : RoleEntryPoint
    {
        private readonly CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
        private readonly ManualResetEvent runCompleteEvent = new ManualResetEvent(false);

        /**
         * IoT Hub
         * */
        private string iotHubConnectionString;
        private string consumerGroupName;
        private DateTime startTime;
        private EventHubClient eventHubClient;
        private string[] eventHubPartitionIds;
        private EventHubReceiver[] eventHubReceivers;

        /**
         * DocumentDB
         * */
        private const string docDbEndpointUri = "https://enterYourDBHost.documents.azure.com:443/";
        private const string docDbPrimaryKey = "enterYourDocumentDBPrimaryKey"; //Please enter your documentDb primary key
        private DocumentClient dbClient;
        private string docDbId = "StarterkitDB"; //Please enter your documentDb database id
        private string docDbCollectionId = "MainCollection"; //Please enter your documentDb collection name

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections
            ServicePointManager.DefaultConnectionLimit = 12;

            // Set IOT Hub related config
            iotHubConnectionString = "HostName=yourHostName.azure-devices.net;SharedAccessKeyName=yourKeyName;SharedAccessKey=yourAccessKey"; //Please enter your azure iot hub connection string
            consumerGroupName = "$Default";
            //eventHubPartition = "1";
            startTime = DateTime.Now;

            // Create event hub client
            eventHubClient = EventHubClient.CreateFromConnectionString(iotHubConnectionString, "messages/events");
            eventHubPartitionIds = eventHubClient.GetRuntimeInformation().PartitionIds;
            eventHubReceivers = new EventHubReceiver[eventHubPartitionIds.Length];

            for (var i = 0; i < eventHubPartitionIds.Length; i++)
            {
                eventHubReceivers[i] = eventHubClient.GetConsumerGroup(consumerGroupName).CreateReceiver(eventHubPartitionIds[i], startTime);
            }

            // Create document db client
            dbClient = new DocumentClient(new Uri(docDbEndpointUri), docDbPrimaryKey);

            bool result = base.OnStart();

            Trace.TraceInformation("EventProcessorRole has been started");

            return result;
        }

        public override void Run()
        {
            Trace.TraceInformation("EventProcessorRole is running");

            try
            {
                this.RunAsync(this.cancellationTokenSource.Token).Wait();
            }
            finally
            {
                this.runCompleteEvent.Set();
            }
        }

        public override void OnStop()
        {
            Trace.TraceInformation("EventProcessorRole is stopping");

            eventHubClient.Close();

            foreach (EventHubReceiver ehReceiver in eventHubReceivers)
            {
                ehReceiver.Close();
            }

            this.cancellationTokenSource.Cancel();
            this.runCompleteEvent.WaitOne();

            base.OnStop();

            Trace.TraceInformation("EventProcessorRole has stopped");
        }

        /**
         * Receive current events in a loop
         * */
        private async Task RunAsync(CancellationToken cancellationToken)
        {


            while (!cancellationToken.IsCancellationRequested)
            {
                var tasks = new List<Task>();

                foreach (EventHubReceiver ehReceiver in eventHubReceivers)
                {
                    tasks.Add(ReceiveCurrentEventsAsync(ehReceiver));
                }

                await Task.WhenAll(tasks.ToArray());

                Trace.TraceInformation("Working");
            }
        }

        /**
         * Receive current events
         * */
        private async Task ReceiveCurrentEventsAsync(EventHubReceiver eventHubReceiver)
        {
            var eventData = await eventHubReceiver.ReceiveAsync(TimeSpan.FromSeconds(1));

            if (eventData != null)
            {
                // read event message and create an order object
                string message = Encoding.UTF8.GetString(eventData.GetBytes());
                Order order = JsonConvert.DeserializeObject<Order>(message);

                order.DeviceId = eventData.SystemProperties["iothub-connection-device-id"].ToString();

                // write to database
                Database database = GetOrCreateDatabaseAsync(dbClient, docDbId).Result;
                DocumentCollection collection = GetOrCreateDocumentCollectionAsync(dbClient, database, docDbCollectionId).Result;
                await CreateDocumentIfNotExistingAsync(dbClient, collection.DocumentsLink, order);

                eventData.Dispose();
            }
        }

        /**
         * DocumentDb Helpers
         * */
        private async Task<Database> GetOrCreateDatabaseAsync(DocumentClient client, string id)
        {
            // Get the database by name, or create a new one if one with the name provided doesn't exist
            // Create a query object for database, filter by name.
            IEnumerable<Database> query = from db in client.CreateDatabaseQuery()
                                          where db.Id == id
                                          select db;

            // Run the query and get the database (there should be only one) or null if the query didn't return anything.
            // Note: this will run synchronously. If async exectution is preferred, use IDocumentServiceQuery<T>.ExecuteNextAsync

            Database database = query.FirstOrDefault();

            if (database == null)
            {
                // Create the database
                database = await client.CreateDatabaseAsync(new Database { Id = id });
            }

            return database;
        }

        private async Task<DocumentCollection> GetOrCreateDocumentCollectionAsync(DocumentClient client, Database database, string collectionId)
        {
            // Check if collection already exists
            DocumentCollection collection =
              client.CreateDocumentCollectionQuery(database.CollectionsLink)
                .Where(c => c.Id == collectionId)
                .AsEnumerable()
                .FirstOrDefault();

            if (collection == null)
            {
                // Create collection
                collection = await client.CreateDocumentCollectionAsync(
                  database.CollectionsLink,
                  new DocumentCollection { Id = collectionId });
            }

            return collection;
        }

        private async Task CreateDocumentIfNotExistingAsync(DocumentClient client, string documentsLink, Order starterKit)
        {
            // Check if the document already exists
            Document document = client.CreateDocumentQuery(documentsLink)
              .Where(d => d.Id == starterKit.Id)
              .AsEnumerable()
              .FirstOrDefault();

            if (document == null)
            {
                // Create the document
                document = await client.CreateDocumentAsync(documentsLink, starterKit);
            }
        }
    }
}

namespace MONATE.Web.Server.Helpers.ComfyUI
{
    using Newtonsoft.Json.Linq;
    using System.Net.WebSockets;
    using System.Text;

    public class WebSocketHelper
    {
        public static async Task HandleWebSocketAsync(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;

            try
            {
                while (webSocket.State == WebSocketState.Open)
                {
                    result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        Console.WriteLine($"Message from client: {message}");

                        var responseMessage = "Message received";
                        var responseBuffer = Encoding.UTF8.GetBytes(responseMessage);
                        await webSocket.SendAsync(new ArraySegment<byte>(responseBuffer), WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                    else if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing connection", CancellationToken.None);
                        Console.WriteLine("Connection closed.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        public static void TrackProgress(WebSocketSharp.WebSocket ws, JObject prompt, string promptId)
        {
            var nodeIds = new List<string>(prompt.Properties().Select(p => p.Name));
            var finishedNodes = new HashSet<string>();

            ws.OnMessage += (sender, e) =>
            {
                var message = e.Data;
                if (!string.IsNullOrEmpty(message))
                {
                    var jsonMessage = JObject.Parse(message);

                    if (jsonMessage.ContainsKey("type"))
                    {
                        var messageType = jsonMessage["type"].ToString();
                        if (messageType == "progress")
                        {
                            var data = jsonMessage["data"].ToObject<JObject>();
                            var currentStep = data["value"].Value<int>();
                            var maxStep = data["max"].Value<int>();
                            Console.WriteLine($"In K-Sampler -> Step: {currentStep} of: {maxStep}");
                        }
                        else if (messageType == "execution_cached")
                        {
                            var data = jsonMessage["data"].ToObject<JObject>();
                            var nodes = data["nodes"].ToObject<List<string>>();

                            foreach (var itm in nodes)
                            {
                                if (!finishedNodes.Contains(itm))
                                {
                                    finishedNodes.Add(itm);
                                    Console.WriteLine($"Progress: {finishedNodes.Count}/{nodeIds.Count} Tasks done");
                                }
                            }
                        }
                        else if (messageType == "executing")
                        {
                            var data = jsonMessage["data"].ToObject<JObject>();
                            var node = data["node"].ToString();

                            if (!finishedNodes.Contains(node))
                            {
                                finishedNodes.Add(node);
                                Console.WriteLine($"Progress: {finishedNodes.Count}/{nodeIds.Count} Tasks done");
                            }

                            if (node == null && data["prompt_id"].ToString() == promptId)
                            {
                                Console.WriteLine("Execution is done.");
                                ws.Close();
                            }
                        }
                    }
                }
            };

            ws.OnClose += (sender, e) =>
            {
                Console.WriteLine("WebSocket connection closed.");
            };

            ws.OnError += (sender, e) =>
            {
                Console.WriteLine($"WebSocket error: {e.Message}");
            };

            ws.Connect();
        }
    }
}
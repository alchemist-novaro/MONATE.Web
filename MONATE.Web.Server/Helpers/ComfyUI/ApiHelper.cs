namespace MONATE.Web.Server.Helpers.ComfyUI
{
    using MONATE.Web.Server.Logics;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Net.Http;
    using System.Text;
    using System.Web;

    public class ApiHelper
    {
        public class OutputImage
        {
            public string FileName { get; set; }
            public string Type { get; set; }
            public object ImageData { get; set; }
        }

        private static readonly HttpClient client = new HttpClient();

        public static async Task<JObject?> QueuePrompt(JObject prompt, string clientId, string serverAddress)
        {
            using (var client = new HttpClient())
            {
                var data = new
                {
                    prompt = prompt,
                    client_id = clientId
                };

                string jsonData = JsonConvert.SerializeObject(data);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync($"http://{serverAddress}/prompt", content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<JObject>(responseBody);
            }
        }

        public static async Task<string> UploadImage(string image, string name, string serverAddress, string imageType = "input", bool overwrite = false)
        {
            using (var client = new HttpClient())
            {
                using (var form = new MultipartFormDataContent())
                {
                    var fileContent = new ByteArrayContent(Convert.FromBase64String(image.Split(',')[1]));

                    fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");

                    form.Add(fileContent, "image", name);

                    form.Add(new StringContent(imageType), "type");
                    form.Add(new StringContent(overwrite.ToString().ToLower()), "overwrite");

                    HttpResponseMessage response = await client.PostAsync($"http://{serverAddress}/upload/image", form);

                    response.EnsureSuccessStatusCode();

                    return await response.Content.ReadAsStringAsync();
                }
            }
        }

        public static async Task<string> InterruptPromptAsync(string serverAddress)
        {
            var url = $"http://{serverAddress}/interrupt";
            var response = await client.PostAsync(url, new StringContent(""));
            return await response.Content.ReadAsStringAsync();
        }

        public static async Task<byte[]> GetImageAsync(string filename, string subfolder, string folderType, string serverAddress)
        {
            var data = new Dictionary<string, string>
            {
                { "filename", filename },
                { "subfolder", subfolder },
                { "type", folderType }
            };

            var queryString = HttpUtility.ParseQueryString(string.Empty);
            foreach (var pair in data)
            {
                queryString[pair.Key] = pair.Value;
            }

            var url = $"http://{serverAddress}/view?{queryString.ToString()}";
            var response = await client.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsByteArrayAsync();
            }
            else
            {
                throw new Exception($"Failed to get image: {response.StatusCode}");
            }
        }

        public static async Task<dynamic> GetHistoryAsync(string promptId, string serverAddress)
        {
            var url = $"http://{serverAddress}/history/{promptId}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<List<OutputImage>> DownloadImages(string clientId, string serverAddress, bool allowPreview = false)
        {
            var outputImages = new List<OutputImage>();
            string promptId = "";
            lock (Globals.globalLock)
            {
                if (Globals.PromptIds.ContainsKey(clientId))
                    promptId = Globals.PromptIds[clientId];
            }
            if (promptId == null)
                return new List<OutputImage>();

            var history = await GetHistoryAsync(promptId, serverAddress);

            if (history.ContainsKey(promptId))
            {
                var nodeOutputs = history[promptId]["outputs"];

                foreach (var nodeId in nodeOutputs)
                {
                    var nodeOutput = nodeId.Value;
                    var outputData = new Dictionary<string, object>();

                    if (nodeOutput.ContainsKey("images"))
                    {
                        foreach (var image in nodeOutput["images"])
                        {
                            if (allowPreview && image["type"].ToString() == "temp")
                            {
                                var previewData = await GetImageAsync(image["filename"].ToString(), image["subfolder"].ToString(), image["type"].ToString(), serverAddress);
                                outputData["image_data"] = previewData;
                            }
                            if (image["type"].ToString() == "output")
                            {
                                var imageData = await GetImageAsync(image["filename"].ToString(), image["subfolder"].ToString(), image["type"].ToString(), serverAddress);
                                outputData["image_data"] = imageData;
                            }

                            outputData["file_name"] = image["filename"].ToString();
                            outputData["type"] = image["type"].ToString();
                            outputImages.Add(new OutputImage
                            {
                                FileName = image["filename"].ToString(),
                                Type = image["type"].ToString(),
                                ImageData = outputData.ContainsKey("image_data") ? outputData["image_data"] : null
                            });
                        }
                    }
                }
            }

            return outputImages;
        }

        public static async Task<dynamic> GetNodeInfoByClassAsync(string nodeClass, string serverAddress)
        {
            var url = $"http://{serverAddress}/object_info/{nodeClass}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
        }

        public static async Task<string> ClearComfyCacheAsync(string serverAddress, bool unloadModels = false, bool freeMemory = false)
        {
            var clearData = new
            {
                unload_models = unloadModels,
                free_memory = freeMemory
            };

            var json = JsonConvert.SerializeObject(clearData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var url = $"http://{serverAddress}/free";
            var response = await client.PostAsync(url, content);
            return await response.Content.ReadAsStringAsync();
        }
    }
}
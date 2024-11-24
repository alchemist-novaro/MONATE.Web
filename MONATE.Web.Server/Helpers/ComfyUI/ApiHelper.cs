namespace MONATE.Web.Server.Helpers.ComfyUI
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System.Text;

    public class ApiHelper
    {
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
            var url = $"http://{serverAddress}/view?filename={filename}&subfolder={subfolder}&type={folderType}";
            var response = await client.GetAsync(url);
            return await response.Content.ReadAsByteArrayAsync();
        }

        public static async Task<dynamic> GetHistoryAsync(string promptId, string serverAddress)
        {
            var url = $"http://{serverAddress}/history/{promptId}";
            var response = await client.GetAsync(url);
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<dynamic>(responseContent);
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
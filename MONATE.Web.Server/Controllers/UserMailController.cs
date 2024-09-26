namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Data;

    [ApiController]
    [Route("[controller]")]
    public class UserMailController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<UserMailController> _logger;

        public UserMailController(ILogger<UserMailController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUserMail")]
        public UserMail Get()
        {
            return new UserMail
            {
                Email = "monate615@gmail.com",
                Password = "wkdwktks",
            };
        }

        [HttpPost(Name = "PostUserMail")]
        public IActionResult Post([FromBody] UserMail userMail)
        {
            if (userMail == null)
            {
                return BadRequest(new { message = "Invalid email data.", data = new UserMail() });
            }
            return Ok(new { message = "User email received.", data = userMail });
        }
    }
}

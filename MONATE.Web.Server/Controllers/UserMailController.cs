namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Data;
    using MONATE.Web.Server.Helpers;

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
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var email = cryptor.Decrypt(userMail.Email);
                var password = cryptor.Decrypt(userMail.Password);

                return Ok(new { email = email, password = password });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

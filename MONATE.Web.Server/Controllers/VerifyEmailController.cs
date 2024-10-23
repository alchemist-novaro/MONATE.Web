namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using MONATE.Web.Server.Data;
    using MONATE.Web.Server.Helpers;

    [ApiController]
    [Route("[controller]")]
    public class VerifyEmailController : ControllerBase
    {
        private readonly ILogger<VerifyEmailController> _logger;

        public VerifyEmailController(ILogger<VerifyEmailController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetUserMail")]
        public VerifyEmail Get()
        {
            return new VerifyEmail
            {
                Email = "monate615@gmail.com",
            };
        }

        [HttpPost(Name = "PostUserMail")]
        public IActionResult Post([FromBody] VerifyEmail email)
        {
            if (email == null || string.IsNullOrEmpty(email.Email))
            {
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var emailAddr = cryptor.Decrypt(email.Email);

                if (VerifyEmailHelper.SendVerificationCode(emailAddr))
                    return Ok();
                else
                    return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

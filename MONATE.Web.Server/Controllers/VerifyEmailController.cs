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

        [HttpPost(Name = "PostVerifyMail")]
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

        [HttpPost(Name = "PostVerifyMail/VerifyCode")]
        public IActionResult PostVerifyCode([FromBody] VerifyData data)
        {
            if (data == null || string.IsNullOrEmpty(data.Email) || data.Code.Length != 6)
            {
                return BadRequest(new { message = "Invalid verification data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var emailAddr = cryptor.Decrypt(data.Email);
                var code = cryptor.Decrypt(data.Code);

                if (VerifyEmailHelper.VerifyEmail(emailAddr, code))
                    return Ok();
                else
                    return BadRequest(new { message = "Verify code is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

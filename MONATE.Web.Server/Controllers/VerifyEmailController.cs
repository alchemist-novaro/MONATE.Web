namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Logics;

    [ApiController]
    [Route("[controller]")]
    public class VerifyEmailController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public VerifyEmailController(MonateDbContext context)
        {
            _context = context;
        }

        [HttpPost(Name = "PostVerifyMail")]
        public async Task<IActionResult> Post([FromBody] VerifyEmail email)
        {
            if (email == null || string.IsNullOrEmpty(email.Email))
            {
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var emailAddr = cryptor.Decrypt(email.Email);

                var userPassword = await GetUserPasswordByEmailAsync(emailAddr);
                if (userPassword != null)
                    return BadRequest(new { message = "Your email is already used for signup." });

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

        [HttpPost("VerifyCode", Name = "PostVerifyMail/VerifyCode")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyData data)
        {
            if (data == null || string.IsNullOrEmpty(data.Email) || string.IsNullOrEmpty(data.Code))
            {
                return BadRequest(new { message = "Invalid verification data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var emailAddr = cryptor.Decrypt(data.Email);
                var code = cryptor.Decrypt(data.Code);

                if (VerifyEmailHelper.VerifyEmail(emailAddr, code))
                {
                    var newPassword = CryptionHelper.RandomPassword;
                    var cryptedNewPassword = cryptor.Encrypt(newPassword);

                    var userPassword = await GetUserPasswordByEmailAsync(emailAddr);
                    if (userPassword == null)
                    {
                        _context.UserPasswords.Add(new UserPassword
                        {
                            Email = emailAddr,
                            Password = newPassword,
                        });
                    }
                    else
                    {
                        return BadRequest(new { message = "Your email is already verified." });

                        userPassword.Password = newPassword;
                        Console.WriteLine(newPassword);
                    }
                    await _context.SaveChangesAsync();

                    return Ok(new { password = cryptedNewPassword });
                }
                else
                    return BadRequest(new { message = "Verify code is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private async Task<UserPassword> GetUserPasswordByEmailAsync(string email)
        {
            return await _context.UserPasswords.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}

namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Packets.MailInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Logics;
    using MONATE.Web.Server.Data.Models;

    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MonateDbContext _context;

        public UserController(MonateDbContext context)
        {
            _context = context;
        }
        
        [HttpPost(Name = "Post /User")]
        public async Task<IActionResult> Post([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var emailAddr = cryptor.Decrypt(email);

                var user = await GetUserByEmailAsync(emailAddr);
                if (user != null)
                    return BadRequest(new { message = "Your email is already used for signup." });

                if (VerifyEmailHelper.SendVerificationCode(emailAddr))
                    return Ok();
                else
                    return BadRequest(new { message = "Faild sending verify code to your email."});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Login", Name = "Post /User/Login")]
        public async Task<IActionResult> Login([FromBody] LoginData loginData)
        {
            if (loginData == null || string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
            {
                return BadRequest(new { message = "Invalid login data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var email = cryptor.Decrypt(loginData.Email);
                var password = cryptor.Decrypt(loginData.Password);

                var user = await GetUserByEmailAsync(email);
                if (user == null)
                    return BadRequest(new { message = "This email is not registered." });

                if (password == user.Password)
                {
                    var newToken = TokenHelper.GeneralToken;
                    var cryptedNewToken = cryptor.Encrypt(newToken);
                    user.Token = newToken;
                    user.ExpireDate = DateTime.Now.AddHours(1);
                    await _context.SaveChangesAsync();

                    return Ok(new { token = cryptedNewToken });
                }
                else
                    return BadRequest(new { message = "Password is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("VerifyCode", Name = "Post /User/VerifyCode")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifyData data)
        {
            if (data == null || string.IsNullOrEmpty(data.Email) || string.IsNullOrEmpty(data.Code))
            {
                return BadRequest(new { message = "Invalid verification data." });
            }

            try
            {
                var cryptor = new CryptionHelper();
                var email = cryptor.Decrypt(data.Email);
                var password = cryptor.Decrypt(data.Password);
                var code = cryptor.Decrypt(data.Code);

                if (VerifyEmailHelper.VerifyEmail(email, code))
                {
                    var token = TokenHelper.GeneralToken;
                    var cryptedToken = cryptor.Encrypt(token);

                    var user = await GetUserByEmailAsync(email);
                    if (user == null)
                    {
                        _context.Users.Add(new User
                        {
                            Email = email,
                            Password = password,
                            Token = token,
                            ExpireDate = DateTime.Now.AddHours(1),
                        });
                    }
                    else
                    {
                        return BadRequest(new { message = "Your email is already registered." });

                        user.Token = token;
                        user.Password = password;
                        user.ExpireDate = DateTime.Now.AddHours(1);
                    }
                    await _context.SaveChangesAsync();

                    return Ok(new { token = cryptedToken });
                }
                else
                    return BadRequest(new { message = "Verify code is not correct." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}

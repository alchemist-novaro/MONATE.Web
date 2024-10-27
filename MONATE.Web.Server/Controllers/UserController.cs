namespace MONATE.Web.Server.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using MONATE.Web.Server.Data.Packets.MailInfo;
    using MONATE.Web.Server.Helpers;
    using MONATE.Web.Server.Logics;
    using MONATE.Web.Server.Data.Models;
    using MONATE.Web.Server.Data.Packets.UserInfo;
    using MailKit.Net.Imap;

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
        public async Task<IActionResult> Post([FromBody] EmailData email)
        {
            if (email == null || string.IsNullOrEmpty(email.Email))
            {
                return BadRequest(new { message = "Invalid email data." });
            }

            try
            {
                var emailAddr = Globals.Cryptor.Decrypt(email.Email);

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

        [HttpPost("ValidateToken", Name = "Post /User/ValidateToken")]
        public async Task<IActionResult> ValidateToken([FromBody] GeneralTokenData token)
        {
            if (token == null || string.IsNullOrEmpty(token.Email) || string.IsNullOrEmpty(token.Token))
            {
                return BadRequest(new { message = "Invalid token data." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(token.Email);
                var _token = Globals.Cryptor.Decrypt(token.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This token is not valid." });

                if (_user.ExpireDate < DateTime.Now)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (_user.Location == null)
                        return Ok(new { state = "location", token = _cryptedNewToken });
                    if (_user.Profile == null)
                        return Ok(new { state = "profile", token = _cryptedNewToken });
                    return Ok(new { state = "success", token = _cryptedNewToken });
                }
                else
                {
                    return BadRequest(new { message = "Your token is not registered." });
                }
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
                var email = Globals.Cryptor.Decrypt(loginData.Email);
                var password = Globals.Cryptor.Decrypt(loginData.Password);

                var user = await GetUserByEmailAsync(email);
                if (user == null)
                    return BadRequest(new { message = "This email is not registered." });

                if (password == user.Password)
                {
                    var newToken = TokenHelper.GeneralToken;
                    var cryptedNewToken = Globals.Cryptor.Encrypt(newToken);
                    user.Token = newToken;
                    user.ExpireDate = DateTime.UtcNow.AddHours(1);
                    await _context.SaveChangesAsync();

                    if (user.Location == null)
                        return Ok(new { state = "location", token = cryptedNewToken });
                    if (user.Profile == null)
                        return Ok(new { state = "profile", token = cryptedNewToken });
                    return Ok(new { state = "success", token = cryptedNewToken });
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
                var email = Globals.Cryptor.Decrypt(data.Email);
                var password = Globals.Cryptor.Decrypt(data.Password);
                var code = Globals.Cryptor.Decrypt(data.Code);

                if (VerifyEmailHelper.VerifyEmail(email, code))
                {
                    var token = TokenHelper.GeneralToken;
                    var cryptedToken = Globals.Cryptor.Encrypt(token);

                    var user = await GetUserByEmailAsync(email);
                    if (user == null)
                    {
                        _context.Users.Add(new User
                        {
                            Email = email,
                            Password = password,
                            Token = token,
                            ExpireDate = DateTime.UtcNow.AddHours(1),
                        });
                    }
                    else
                    {
                        return BadRequest(new { message = "Your email is already registered." });

                        user.Token = token;
                        user.Password = password;
                        user.ExpireDate = DateTime.UtcNow.AddHours(1);
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

        [HttpPost("SaveLocation", Name = "Post /User/SaveLocation")]
        public async Task<IActionResult> SaveLocation([FromBody] LocationData location)
        {
            if (location == null || string.IsNullOrEmpty(location.Email) || string.IsNullOrEmpty(location.Token))
            {
                return BadRequest(new { message = "Invalid token infomation." });
            }

            try
            {
                var _email = Globals.Cryptor.Decrypt(location.Email);
                var _token = Globals.Cryptor.Decrypt(location.Token);

                var _user = await GetUserByEmailAsync(_email);
                if (_user == null)
                    return BadRequest(new { message = "This user is not registered." });

                if (_user.ExpireDate < DateTime.Now)
                {
                    return BadRequest(new { message = "Your current token is expired. Please log in again." });
                }

                if (_user.Token == _token)
                {
                    var _firstName = Globals.Cryptor.Decrypt(location.FirstName);
                    var _lastName = Globals.Cryptor.Decrypt(location.LastName);
                    var _address1 = Globals.Cryptor.Decrypt(location.Address1);
                    var _address2 = Globals.Cryptor.Decrypt(location.Address2);
                    var _city = Globals.Cryptor.Decrypt(location.City);
                    var _state = Globals.Cryptor.Decrypt(location.State);
                    var _zipCode = Globals.Cryptor.Decrypt(location.ZipCode);
                    var _country = Globals.Cryptor.Decrypt(location.Country);

                    var _newToken = TokenHelper.GeneralToken;
                    var _cryptedNewToken = Globals.Cryptor.Encrypt(_newToken);

                    _user.Token = _newToken;
                    _user.ExpireDate = DateTime.UtcNow.AddHours(1);

                    if (_user.Location == null)
                    {
                        _context.Locations.Add(new UserLocation
                        {
                            FirstName = _firstName,
                            LastName = _lastName,
                            AddressLine1 = _address1,
                            AddressLine2 = _address2,
                            City = _city,
                            State = _state,
                            ZipCode = int.Parse(_zipCode),
                            Country = _country,
                            User = _user,
                        });
                    }
                    else
                    {
                        var _location = await GetLocationByUserAsync(_user);
                        _location.FirstName = _firstName;
                        _location.LastName = _lastName;
                        _location.City = _city;
                        _location.State = _state;
                        _location.ZipCode = int.Parse(_zipCode);
                        _location.Country = _country;
                    }
                    await _context.SaveChangesAsync();

                    if (_user.Location == null)
                        return Ok(new { state = "location", token = _cryptedNewToken });
                    if (_user.Profile == null)
                        return Ok(new { state = "profile", token = _cryptedNewToken });
                    return Ok(new { state = "success", token = _cryptedNewToken });
                }
                else
                {
                    return BadRequest(new { message = "Your token is not registered." });
                }
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

        private async Task<UserLocation> GetLocationByUserAsync(User user)
        {
            return await _context.Locations.FirstOrDefaultAsync(l => l.User == user);
        }
    }
}

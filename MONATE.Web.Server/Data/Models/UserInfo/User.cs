namespace MONATE.Web.Server.Data.Models.UserInfo
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string EmailPassword { get; set; }
        public string Password { get; set; }

        public UserLocation UserLocation { get; set; }
    }
}

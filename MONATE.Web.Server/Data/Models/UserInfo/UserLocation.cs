namespace MONATE.Web.Server.Data.Models.UserInfo
{
    public class UserLocation
    {
        public int Id { get; set; }
        public int UserPasswordId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int ZipCode { get; set; }
        public string Country { get; set; }

        public User UserPassword { get; set; }
    }
}

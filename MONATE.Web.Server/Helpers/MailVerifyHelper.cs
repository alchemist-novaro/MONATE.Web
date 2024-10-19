namespace MONATE.Web.Server.Helpers
{
    public class VerifyEmailHelper
    {
        public readonly Dictionary<string, string> verifyValueDict = new Dictionary<string, string>();
        public object lockVerifyValueDict = new object();
    }
}

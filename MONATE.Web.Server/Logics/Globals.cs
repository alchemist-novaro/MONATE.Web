namespace MONATE.Web.Server.Logics
{
    using MONATE.Web.Server.Helpers;

    public static class Globals
    {
        private static readonly CryptionHelper _cryptor = new CryptionHelper();
        public static CryptionHelper Cryptor
        {
            get => _cryptor;
        }
    }
}

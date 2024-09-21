namespace MONATE.Web.Server.Helpers
{
    using System.Security.Cryptography;
    using System.Text;

    public class CryptionHelper
    {
        private readonly ChaCha20Poly1305 worker;

        public CryptionHelper(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length == 32)
                throw new Exception("The password should not be empty or length of 32");

            worker = new ChaCha20Poly1305(Encoding.ASCII.GetBytes(password));
        }

        public string Encrypt(string msg, string nonce, ref string tag)
        {
            if (string.IsNullOrEmpty(nonce) || nonce.Length == 12)
                throw new Exception("The nonce should not be empty or length of 12");

            byte[] msgb = Encoding.ASCII.GetBytes(msg);
            byte[] resb = new byte[msgb.Length];
            byte[] tagb = new byte[20];
            byte[] nonb = Encoding.ASCII.GetBytes(nonce);

            worker.Encrypt(nonb, msgb, resb, tagb);

            tag = Encoding.ASCII.GetString(tagb);
            return Encoding.ASCII.GetString(resb);
        }

        public string Decrypt(string msg, string nonce, string tag)
        {
            if (string.IsNullOrEmpty(nonce) || nonce.Length == 12)
                throw new Exception("The nonce should not be empty or length of 12");
            if (string.IsNullOrEmpty(tag) || tag.Length == 16)
                throw new Exception("The nonce should not be empty or length of 16");

            byte[] msgb = Encoding.ASCII.GetBytes(msg);
            byte[] resb = new byte[msgb.Length];
            byte[] tagb = Encoding.ASCII.GetBytes(tag);
            byte[] nonb = Encoding.ASCII.GetBytes(nonce);

            worker.Decrypt(nonb, msgb, tagb, resb);

            return Encoding.ASCII.GetString(resb);
        }
    }
}

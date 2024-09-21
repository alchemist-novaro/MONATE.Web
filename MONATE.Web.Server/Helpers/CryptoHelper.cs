namespace MONATE.Web.Server.Helpers
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    public class CryptoHelper
    {
        private const int NonceSize = 12; // IV size for ChaCha20
        private const int TagSize = 16;   // Poly1305 tag size
        private const int AssocDataSize = 16; // Associated data size

        // Environment.GetEnvironmentVariable("PASSWORD") must be 32 byte hex string.
        private readonly string key = Environment.GetEnvironmentVariable("PASSWORD") ?? string.Empty;
        private readonly Encoding encoding = Encoding.UTF8;

        public string Encrypt(string plaintext)
        {
            try
            {
                var keyBytes = Convert.FromHexString(key);
                var nonce = RandomNumberGenerator.GetBytes(NonceSize);
                var assocData = RandomNumberGenerator.GetBytes(AssocDataSize);

                using var cipher = new ChaCha20Poly1305(keyBytes);
                var plaintextBytes = encoding.GetBytes(plaintext);
                var encryptedData = new byte[plaintextBytes.Length];
                var tag = new byte[TagSize];

                cipher.Encrypt(nonce, plaintextBytes, encryptedData, tag, assocData);

                // Combine nonce, associated data, encrypted data, and tag into a single string
                return $"{Convert.ToHexString(nonce)}{Convert.ToHexString(assocData)}{Convert.ToHexString(encryptedData)}{Convert.ToHexString(tag)}";
            }
            catch (Exception e)
            {
                throw new Exception($"Encryption failed: {e.Message}");
            }
        }

        public string Decrypt(string cipherText)
        {
            try
            {
                // Split cipherText into IV, associated data, encrypted data, and tag
                var iv = Convert.FromHexString(cipherText[..(NonceSize << 1)]);
                var assocData = Convert.FromHexString(cipherText[(NonceSize << 1)..((NonceSize + AssocDataSize) << 1)]);
                var encryptedData = Convert.FromHexString(cipherText[((NonceSize + AssocDataSize) << 1)..(cipherText.Length - (TagSize << 1))]);
                var tag = Convert.FromHexString(cipherText[(cipherText.Length - (TagSize << 1))..]);
                var keyBytes = Convert.FromHexString(key);

                using var cipher = new ChaCha20Poly1305(keyBytes);
                var decryptedData = new byte[encryptedData.Length];

                cipher.Decrypt(iv, encryptedData, tag, decryptedData, assocData);
                return encoding.GetString(decryptedData);
            }
            catch (Exception e)
            {
                throw new Exception($"Decryption failed: {e.Message}");
            }
        }
    }
}
import sodium from 'libsodium-wrappers-sumo';

class CryptionHelper {
    encoding = 'hex';
    key = null;

    async initialize() {
        await sodium.ready; // Ensure libsodium is ready
        const passwordHex = sessionStorage.getItem('password');
        if (!passwordHex) {
            throw new Error("Password not found in session storage.");
        }
        this.key = sodium.from_hex(passwordHex); // Convert hex string to Uint8Array
    }

    async encrypt(plaintext) {
        if (!this.key) {
            throw new Error("Key not initialized. Ensure libsodium is ready and key is set.");
        }
        try {
            const iv = sodium.randombytes_buf(12); // Random 12-byte nonce
            const assocData = sodium.randombytes_buf(16); // Random associated data

            const cipherText = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
                sodium.from_string(plaintext), // Message to encrypt
                assocData,                     // Associated data (optional)
                null,                          // No additional data used
                iv,                            // Nonce (IV)
                this.key                       // Secret key
            );

            return sodium.to_hex(iv) + sodium.to_hex(assocData) + sodium.to_hex(cipherText);
        } catch (e) {
            console.error(e);
        }
    }

    async decrypt(cipherText) {
        if (!this.key) {
            throw new Error("Key not initialized. Ensure libsodium is ready and key is set.");
        }
        try {
            const iv = sodium.from_hex(cipherText.slice(0, 24)); // First 12 bytes for nonce
            const assocData = sodium.from_hex(cipherText.slice(24, 56)); // Next 16 bytes for AAD
            const encryptedData = sodium.from_hex(cipherText.slice(56)); // Remaining bytes for encrypted data

            const decrypted = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
                null,                // No additional data
                encryptedData,      // Encrypted message
                assocData,          // Associated data (AAD)
                iv,                 // Nonce (IV)
                this.key            // Secret key
            );

            return sodium.to_string(decrypted); // Convert decrypted Uint8Array back to string
        } catch (e) {
            console.error(e);
        }
    }
}

export default CryptionHelper;

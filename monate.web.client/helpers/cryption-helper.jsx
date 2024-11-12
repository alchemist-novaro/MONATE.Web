import { useState, useEffect } from 'react';
import sodium from 'libsodium-wrappers-sumo';
import initialState from '../src/globals/initialState';

const useCryptionHelper = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    const initialize = async () => {
        await sodium.ready;
        setIsInitialized(true);
    };

    useEffect(() => {
        initialize();
    }, []);

    const encrypt = async (plaintext) => {
        if (!isInitialized) {
            await initialize();
        }
        try {
            const key = sodium.from_hex(initialState.key);
            const iv = sodium.randombytes_buf(12);
            const assocData = sodium.randombytes_buf(16);

            const cipherText = sodium.crypto_aead_chacha20poly1305_ietf_encrypt(
                sodium.from_string(plaintext),
                assocData,
                null,
                iv,
                key
            );

            return sodium.to_hex(iv) + sodium.to_hex(assocData) + sodium.to_hex(cipherText);
        } catch (e) {
            console.error('Encryption failed:', e);
        }
    };

    const decrypt = async (cipherText) => {
        if (!isInitialized) {
            await initialize();
        }
        try {
            const key = sodium.from_hex(initialState.key);
            const iv = sodium.from_hex(cipherText.slice(0, 24));
            const assocData = sodium.from_hex(cipherText.slice(24, 56));
            const encryptedData = sodium.from_hex(cipherText.slice(56));

            const decrypted = sodium.crypto_aead_chacha20poly1305_ietf_decrypt(
                null,
                encryptedData,
                assocData,
                iv,
                key
            );

            return sodium.to_string(decrypted);
        } catch (e) {
            console.error('Decryption failed:', e);
        }
    };

    return { encrypt, decrypt };
};

export default useCryptionHelper;

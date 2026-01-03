import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

function genKey(key) {
    return crypto.createHash('sha256').update(key).digest();
}

function encrypt(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, genKey(key), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData, key) {
    const parts = encryptedData.split(':');
    if(parts.length !== 2) throw new Error('Invalid encrypted data');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, genKey(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { encrypt, decrypt };
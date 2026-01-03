


let data = "today i went to the jungle and i have seen a lion";
let answer = "";
data.split(" ").slice(3, 7).forEach(word => answer += word.length);

// Encrypt the answer
const encrypted = encrypt(answer, "secret_key");
console.log("Encrypted:", encrypted);

// Decrypt the encrypted answer
const decrypted = decrypt(encrypted, "secret_key");
console.log("Decrypted:", decrypted);

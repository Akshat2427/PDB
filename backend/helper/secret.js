import { encrypt, decrypt } from './encrypt.js';

const generateSecretString = async () => {
    const skip = Math.floor(Math.random() * 1400);
    const res = await fetch(`https://dummyjson.com/quotes?skip=${skip}&limit=1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    return data.quotes[0].quote;
};

const generateSecretPassword = (data) => {
    let answer = "";
    data.split(" ").slice(3, 7).forEach(word => answer += word.length);
    const encrypt_secret_password = encrypt(answer, process.env.SECRET_KEY);
    return encrypt_secret_password;
};

export { generateSecretString, generateSecretPassword };
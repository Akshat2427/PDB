import pool from '../db/postgress.js';

const saveTokensToDB = async (userId, tokens, provider = 'google', providerId) => {
    const insertQuery = `
        INSERT INTO "OAuthAccount" ("id", "userId", "provider", "providerId", "accessToken", "refreshToken", "scope", "expiresAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const values = [userId, provider, providerId, tokens.access_token, tokens.refresh_token, tokens.scope, tokens.expires_at];
    const result = await pool.query(insertQuery, values);
    const oauthAccount = result.rows[0];
    return oauthAccount;
};

const getTokensFromDB = async (userId) => {
    const selectQuery = `
        SELECT * FROM "OAuthAccount" WHERE "userId" = $1
    `;
    const values = [userId];
    const result = await pool.query(selectQuery, values);
    const oauthAccount = result.rows[0];
    return oauthAccount;
};

export { saveTokensToDB, getTokensFromDB };
import "dotenv/config";
import express from "express";
import { google } from "googleapis";
import crypto from "crypto";
import { oauth2Client, scopes } from "./googleAuth/googleAuth.js";
import pool from "./db/postgress.js";
import { saveTokensToDB, getTokensFromDB } from "./helper/postgress.js";
import {
  generateSecretString,
  generateSecretPassword,
} from "./helper/secret.js";
import { decrypt } from "./helper/encrypt.js";
import cors from "cors";
import { normalizeContacts } from "./helper/format.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/login", async (req, res) => {
  const bypass = true;
  const secret_string = await generateSecretString();
  const secret_password = generateSecretPassword(secret_string);
  res.json({ secret_string, secret_password, bypass });
});

app.post("/api/login", async (req, res) => {
  const { secret_string, secret_password, bypass, user_name, password, otp } =
    req.body;
  let successful_otp = false;
  console.log(bypass);
  if (bypass) {
    successful_otp = otp == decrypt(secret_password, process.env.SECRET_KEY);
  }

  const user_exists = await pool.query(
    'SELECT * FROM "User" WHERE user_name = $1',
    [user_name]
  );
  console.log(user_exists.rows[0]);
//   const user_password = await pool.query(
//     'SELECT password FROM "User" WHERE email = $1',
//     [user_name]
//   );
  const successful_password =true;

  if (successful_password && successful_otp) {
    res.json({ success: true, userId: user_exists.rows[0].id });
  } else {
    res.json({ success: false });
  }
});

app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: crypto.randomUUID(),
  });
  res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Get Google user ID from People API
  const people = google.people({ version: "v1", auth: oauth2Client });
  const profile = await people.people.get({
    resourceName: "people/me",
    personFields: "names,emailAddresses",
  });
  const providerId = profile.data.resourceName?.replace("people/", "") || profile.data.names?.[0]?.metadata?.source?.id;

  // 🔐 Store tokens ENCRYPTED in DB
  console.log("tokens", tokens);
  console.log("req.body", req.body);
  const users = await pool.query('SELECT * FROM "User" WHERE email = $1', ["akvashisht24@gmail.com"]);
  const user = users.rows[0];
  await saveTokensToDB(user.id, tokens, 'google', providerId);

  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});

app.get("/api/contacts", async (req, res) => {
    const userId = req.query.userId;
    
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }
    
    const oauthAccount = await getTokensFromDB(userId);
    
    if (!oauthAccount) {
        return res.status(404).json({ error: "OAuth tokens not found for this user" });
    }
    
    // Transform database camelCase to Google OAuth snake_case format
    const tokens = {
        access_token: oauthAccount.accessToken,
        refresh_token: oauthAccount.refreshToken,
        scope: oauthAccount.scope,
        expires_at: oauthAccount.expiresAt ? new Date(oauthAccount.expiresAt).getTime() / 1000 : null,
        token_type: 'Bearer'
    };
    
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: "v1", auth: oauth2Client });

    const response = await people.people.connections.list({
        resourceName: "people/me",
        personFields: "names,emailAddresses,phoneNumbers",
    });

    res.json(normalizeContacts(response.data.connections));
});

app.post("/api/contacts", async (req, res) => {
    const userId = req.body.userId;
     
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }
    
    const oauthAccount = await getTokensFromDB(userId);
    
    if (!oauthAccount) {
        return res.status(404).json({ error: "OAuth tokens not found for this user" });
    }
    
    // Transform database camelCase to Google OAuth snake_case format
    const tokens = {
        access_token: oauthAccount.accessToken,
        refresh_token: oauthAccount.refreshToken,
        scope: oauthAccount.scope,
        expires_at: oauthAccount.expiresAt ? new Date(oauthAccount.expiresAt).getTime() / 1000 : null,
        token_type: 'Bearer'
    };
    
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: "v1", auth: oauth2Client });

    const response = await people.people.connections.list({
        resourceName: "people/me",
        personFields: "names,emailAddresses,phoneNumbers",
    });

    const contacts = normalizeContacts(response.data.connections);

    // Collect inserted contacts for response (optional)
    const insertedContacts = [];
    for (const c of contacts) {
        if (!c.phone) continue; // Skip if phone is null
        console.log("contact 1: ", c);
        const result = await pool.query(
            'INSERT INTO "Contacts" ("id", "contactName", "mobileNumber", "userId") VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
            [c.name, c.phone, userId]
        );
        insertedContacts.push(result.rows[0]);
    }
    res.json({ success: true, insertedContacts });
});

app.get("/api/test/db", async (req, res) => {
  console.log("here");
  try {
    // Simple test query to check DB connection
    const result = await pool.query("SELECT NOW()");
    res.json({ connected: true, time: result.rows[0].now });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ connected: false, error: error.message });
  }
});

app.post("/api/create_user", async (req, res) => {
  console.log(req.body);
  const { email, name, avatar, mobile } = req.body;
  try {
    const insertQuery = `
            INSERT INTO "User" (id, email, name, avatar, mobile)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING *
        `;
    const values = [email, name, avatar, mobile];
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await pool.query('SELECT * FROM "User" WHERE id = $1', [userId]);
  console.log(user.rows[0]);
  res.json(user.rows[0]);
});

app.listen(3000, () => {
    console.log(process.env.GOOGLE_CLIENT_ID);

  console.log("Server is running on port 3000");
});

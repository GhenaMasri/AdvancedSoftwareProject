const fs = require('fs').promises;
const path = require('path');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const express = require('express');

const router = express.Router();

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function sendEmails(recipients) {
  try {
    const auth = await authorize();

    const gmail = google.gmail({ version: 'v1', auth });

    for (const recipient of recipients) {
      const rawEmail = createRawEmail(recipient);
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: rawEmail,
        },
      });
    }

    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

function createRawEmail(recipient) {
  const emailLines = [];

  emailLines.push(`To: ${recipient}`);
  emailLines.push('Content-Type: text/html; charset=utf-8');
  emailLines.push('MIME-Version: 1.0');
  emailLines.push('Subject: Start Interviewing');
  emailLines.push('');
  emailLines.push('Congratulations! You have been chosen to have your first Interview! ');

  const rawEmail = emailLines.join('\r\n');
  const encodedEmail = Buffer.from(rawEmail).toString('base64');

  return encodedEmail;
}


module.exports = {
    sendEmails,
  };

const fs = require("fs");
const { google } = require("googleapis");
const http = require("http");
const url = require("url");
require("dotenv").config();

const scopes = process.env.SCOPES;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const TOKEN_PATH = "token.json";

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Start HTTP server
http
  .createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === "/oauth2callback") {
      const code = reqUrl.query.code;
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("No code found in query");
        return;
      }
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Authentication successful! You can close this window.");
        // Replace with your actual fileId and newOwnerEmail
        const fileId = "1NO-K8nLWiTeMS2mAjmZ0_b0-QukLULSG";
        const newOwnerEmail = "avila.april.angelo@gmail.com";
        if (fileId && newOwnerEmail) {
          initiateOwnershipTransfer(fileId, newOwnerEmail);
        }
      } catch (err) {
        console.error("Error retrieving access token", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Authentication failed");
      }
      return;
    }

    // Default response for other routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  })
  .listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    checkToken();
  });

// Check if we have previously stored a token
function checkToken() {
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getAccessToken(oauth2Client);
    } else {
      oauth2Client.setCredentials(JSON.parse(token));
      // Replace with your actual fileId and newOwnerEmail
      const fileId = "1vL_XTv85mWfLtjf0ap35eve13WSDZFGN";
      const newOwnerEmail = "avila.april.angelo@gmail.com";
      if (fileId && newOwnerEmail) {
        initiateOwnershipTransfer(fileId, newOwnerEmail);
      }
    }
  });
}

// Function to get access token if it's not stored
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
}

/**
 * Initiate ownership transfer by the current owner.
 * @param {string} fileId - The ID of the file you want to transfer ownership of.
 * @param {string} newOwnerEmail - The email address of the new prospective owner.
 */
function initiateOwnershipTransfer(fileId, newOwnerEmail) {
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  drive.permissions.create(
    {
      fileId: fileId,
      requestBody: {
        role: "writer",
        type: "user",
        emailAddress: newOwnerEmail,
      },
      fields: "id",
      sendNotificationEmail: true,
    },
    (err, res) => {
      if (err) {
        console.error("Error creating writer permission:", err);
        return;
      }
      const permissionId = res.data.id;
      console.log(`Writer permission created. Permission ID: ${permissionId}`);

      drive.permissions.update(
        {
          fileId: fileId,
          permissionId: permissionId,
          requestBody: {
            role: "writer",
            pendingOwner: true,
          },
          fields: "id",
        },
        (err, res) => {
          if (err) {
            console.error("Error updating permission with pendingOwner:", err);
            return;
          }
          console.log(
            "Ownership transfer initiated with pendingOwner set to true."
          );

          drive.permissions.list(
            {
              fileId: fileId,
              fields: "permissions(id, type, emailAddress, role, pendingOwner)",
            },
            (err, res) => {
              if (err) {
                console.error("Error retrieving permissions:", err);
                return;
              }
              console.log("Permissions:", res.data.permissions);
            }
          );
        }
      );
    }
  );
}

const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} = require("@simplewebauthn/server");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

const CLIENT_URL = process.env.CLIENT_URL;
const RP_ID = process.env.RP_ID;

app.get("/", (req, res) => {
  res.send(
    `<h2 style="text-align: center">The server of webauthn-passkey-auth project</h2>`,
  );
});

app.get("/init-registration", async (req, res) => {
  const email = req.query.email;

  if (!email) return res.status(400).json({ error: "Email is required" });

  // todo: check if email is in the database, return 'error: 'user already exists'

  // generateRegistrationOptions automatically generates challenge and user id
  const options = await generateRegistrationOptions({
    rpID: RP_ID,
    rpName: "webauthn passkey auth",
    userName: email,
  });

  res.cookie(
    "regInfo",
    JSON.stringify({
      userId: options.user.id,
      email,
      challenge: options.challenge,
    }),
    { httpOnly: true, maxAge: 60000, secure: true },
  );

  res.json(options);
});

app.post("/verify-registration", async (req, res) => {
  const regInfo = JSON.parse(req.cookies.regInfo);

  if (!regInfo) res.status(400).json({ error: "Registration info not found " });

  const verification = await verifyRegistrationResponse({
    response: req.body,
    expectedChallenge: regInfo.challenge,
    expectedOrigin: CLIENT_URL,
    expectedRPID: RP_ID,
  });

  if (verification.verified) {
    // todo: create user in database:
    const registrationInfo = verification.registrationInfo;
    const userDataToSave = {
      id: registrationInfo.credential.id,
      publicKey: registrationInfo.credential.publicKey,
      counter: registrationInfo.counter,
      deviceType: registrationInfo.credentialDeviceType,
      backedUp: verification.registrationInfo.credentialBackedUp,
      transport: req.body.transport,
    };
    res.clearCookie("regInfo");

    return res.json({ verified: verification.verified });
  } else {
    res.status(400).json({ verified: false, error: "Verification failed" });
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

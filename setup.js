const fs = require("fs");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const configTemplate = {
  mongodb: {
    uri: "MONGODB_URI",
  },
  discord: {
    clientId: "DISCORD_CLIENT_ID",
    clientSecret: "DISCORD_CLIENT_SECRET",
    botToken: "DISCORD_BOT_TOKEN",
    serverId: "DISCORD_SERVER_ID",
    logChannelId: "DISCORD_LOG_CHANNEL_ID",
  },
  nextAuth: {
    secret: "NEXTAUTH_SECRET",
    url: "NEXTAUTH_URL",
  },
  port: {
    website: 3000,
    bot: 3001,
  },
};

const envTemplate = `MONGODB_URI=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_SERVER_ID=
DISCORD_LOG_CHANNEL_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
BOT_PORT=3001
`;

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  console.log("Welcome to Discord Bot List setup!");
  console.log("This script will help you configure your application.\n");

  const mongodbUri = await askQuestion("Enter your MongoDB URI: ");

  const discordClientId = await askQuestion("Enter your Discord Client ID: ");
  const discordClientSecret = await askQuestion(
    "Enter your Discord Client Secret: "
  );
  const discordBotToken = await askQuestion("Enter your Discord Bot Token: ");
  const discordServerId = await askQuestion("Enter your Discord Server ID: ");
  const discordLogChannelId = await askQuestion(
    "Enter your Discord Log Channel ID: "
  );

  const nextAuthSecret = await askQuestion(
    "Enter your NextAuth Secret (or press Enter to generate one): "
  );
  const generatedSecret =
    nextAuthSecret ||
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

  const envContent = envTemplate
    .replace("MONGODB_URI=", `MONGODB_URI=${mongodbUri}`)
    .replace("DISCORD_CLIENT_ID=", `DISCORD_CLIENT_ID=${discordClientId}`)
    .replace(
      "DISCORD_CLIENT_SECRET=",
      `DISCORD_CLIENT_SECRET=${discordClientSecret}`
    )
    .replace("DISCORD_BOT_TOKEN=", `DISCORD_BOT_TOKEN=${discordBotToken}`)
    .replace("DISCORD_SERVER_ID=", `DISCORD_SERVER_ID=${discordServerId}`)
    .replace(
      "DISCORD_LOG_CHANNEL_ID=",
      `DISCORD_LOG_CHANNEL_ID=${discordLogChannelId}`
    )
    .replace("NEXTAUTH_SECRET=", `NEXTAUTH_SECRET=${generatedSecret}`);

  fs.writeFileSync(".env.local", envContent);
  console.log("\n.env.local file created successfully!");

  fs.writeFileSync("config.json", JSON.stringify(configTemplate, null, 2));
  console.log("config.json file created successfully!");

  console.log("\nSetup complete! You can now run the application with:");
  console.log("npm run dev");

  rl.close();
}

setup().catch((err) => {
  console.error("Error during setup:", err);
  rl.close();
});

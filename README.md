# AquaList - Discord Bot Directory

![AquaList Logo](./public/logo.jpg)

AquaList is a modern Discord bot directory platform that helps users discover and manage Discord bots. It provides a user-friendly interface for browsing, submitting, and managing Discord bots.

## 🌟 Features

- 🎯 Modern and responsive UI
- 🔍 Advanced bot search and filtering
- 📊 Bot statistics and analytics
- ⭐ Voting system for bots
- 🔐 Secure bot submission process
- 📱 Mobile-friendly design
- 🌐 Multi-language support
- 🔔 Discord notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Discord Bot Token
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/M7mdJs/aqua-list.git
cd aqua-list
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_uri
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Create a `config.ts` file in the root directory:

```typescript
export default {
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/aqualist",
  },
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN,
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    serverId: "your_discord_server_id",
    logChannelId: "your_log_channel_id",
  },
  website: {
    baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
};
```

5. Start the development server:

```bash
npm run dev
```

### Discord Bot Setup

1. Create a new Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot user and get the token
3. Enable required intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
4. Add the bot to your server with proper permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Discord Integration**: discord.js
- **Deployment**: Vercel

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **M7mdJs** - _Initial work_ - [M7mdJs](https://github.com/M7mdJs)

## 🙏 Acknowledgments

- Thanks to all contributors
- Discord.js community
- Next.js team
- MongoDB team

## 📞 Support

For support, join our [Discord Server](https://discord.gg/BQrPPR8xWq) or open an issue in the repository.

## 🔗 Links

- [Website](aqua-list.vercel.app)
- [Discord Server](https://discord.gg/BQrPPR8xWq)

---

Made with ❤️ by the AquaList Team


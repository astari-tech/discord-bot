import { Client, GatewayIntentBits, Collection } from "discord.js"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import fs from "fs"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] })
client.commands = new Collection()

const __dirname = dirname(fileURLToPath(import.meta.url))

// Carregar comandos
const commandsPath = join(__dirname, "commands")
fs.readdirSync(commandsPath).forEach(async file => {
    const command = await import(`file://${join(__dirname, 'commands', file)}`)

    client.commands.set(command.data.name, command)
})

// Carregar eventos
const eventsPath = join(__dirname, 'events')
fs.readdirSync(eventsPath).forEach(async file => {
  const event = (await import(`file://${join(eventsPath, file)}`)).default
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
})

// Login do bot
client.login(process.env.DISCORD_TOKEN)
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

//Evento: quando bot estiver online
client.once('ready', () => {
    console.log(`Bot está online como ${client.user.tag}`)
})

// Evento: mensagens
client.on('messageCreate', async message => {
    if(!message.content.startsWith(process.env.BOT_PREFIX) || message.author.bot) return

    const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = client.commands.get(commandName)
    if(!command) return

    try {
        await command.execute(message, args)
    } catch (error) {
        console.error(error)
        await message.reply({ content: 'Houve um erro ao executar esse comando!', ephemeral: true })
    }
})

client.login(process.env.DISCORD_TOKEN)
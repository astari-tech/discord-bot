import dotenv from 'dotenv'
dotenv.config()

export default {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.content.startsWith(process.env.BOT_PREFIX)) return

    const args = message.content.slice(process.env.BOT_PREFIX.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command = message.client.commands.get(commandName)
    if (!command) return

    try {
      await command.execute(message, args)
    } catch (error) {
      console.error(error)
      message.reply('❌ Erro ao executar o comando.')
    }
  }
}

export const data = {
    name: "ping",
    description: "Responde com Pong!",
}

export async function execute(message) {
    await message.reply("Pong!")
}
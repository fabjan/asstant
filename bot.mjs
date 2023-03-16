import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

export function start(token, answerFun) {

    async function answerQuestion(interaction) {
        const question = interaction.options.getString("question");
        const answer = await answerFun(question);

        if (answer.error) {
            console.error("Error from AI:", answer.error);
        }

        interaction.reply(answer.result);
    }

    const commands = {
        "question": answerQuestion
    };

    const client = new Client({
        intents: [GatewayIntentBits.Guilds]
    });

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;
        const { commandName } = interaction;
        if (!commands[commandName]) return;

        console.log("Executing command:", commandName);
        await commands[commandName](interaction);
    });

    client.login(token).then(() => {
        console.log("Logged in");
    });
}

export async function deploy(appId, token) {
    const rest = new REST({ version: "9" }).setToken(token);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationCommands(appId),
            { body: [questionCommand()] },
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}

function questionCommand() {
    return new SlashCommandBuilder()
        .setName("question")
        .setDescription("Ask a question to the AI")
        .addStringOption(option =>
            option.setName("question")
                .setDescription("The question to ask")
                .setRequired(true)
        )
        .toJSON();
}

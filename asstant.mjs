import * as dotenv from "dotenv";

import { deploy, start } from "./bot.mjs";
import { init, answer } from "./ai.mjs";

dotenv.config();

const discordAppId = process.env.DISCORD_APP_ID;
const discordToken = process.env.DISCORD_TOKEN;
const openAIKey = process.env.OPENAI_API_KEY

if (!discordAppId || !discordToken || !openAIKey) {
    console.error("Missing environment variables");
    console.error("Copy .env.example to .env and fill in the values");
    process.exit(1);
}

const commands = {
    "deploy": () => deploy(discordAppId, discordToken),
    "start": () => {
        init(openAIKey);
        start(discordToken, answer)
    }
}

const argc = process.argv.length;
const selectCommand = process.argv[argc - 1].trim();

if (commands[selectCommand]) {
    commands[selectCommand]();
} else {
    console.error("Unknown command:", selectCommand);
    console.error("Usage: node asstant.mjs [deploy|start]");
    process.exit(1);
}


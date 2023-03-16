import { Configuration, OpenAIApi } from "openai";

let openai;

export function init(apiKey) {
    const config = new Configuration({ apiKey });
    openai = new OpenAIApi(config);
}

function generateMessages(question) {
    return [
        {
            "role": "system",
            "content":
                "You are a witty super-AI whose sole purpose is to help humans with their questions." +
                "Your answers are brief, but witty and entertaining."
        },
        {
            "role": "user",
            "content": "What is the meaning of life?"
        },
        {
            "role": "assistant",
            "content": "42"
        },
        {
            "role": "user",
            "content": "Which is the best programming language?"
        },
        {
            "role": "assistant",
            "content": "Gleam"
        },
        {
            "role": "user",
            "content": question
        },
    ];
}

export async function answer(question) {
    question = question || '';

    if (question.trim().length === 0) {
        return {
            error: "Empty question"
        }
    }

    const model = "gpt-3.5-turbo";
    const messages = generateMessages(question);

    let completion;
    try {
        completion = await openai.createChatCompletion({ model, messages, });
    } catch (error) {
        return handleError(error);
    }

    console.log("Question:", question);
    console.log("Completion:", JSON.stringify(completion.data));

    return {
        result: completion.data.choices[0]?.message?.content
    }
}

function handleError(error) {
    if (error.response) {
        console.error(error.response.status, error.response.data);
        return {
            error: error.response.data
        }
    } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        return {
            error: "An error occurred during your request."
        }
    }
}

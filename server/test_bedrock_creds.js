const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

const token = process.env.AWS_BEARER_TOKEN_BEDROCK;

const client = new BedrockRuntimeClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: token,
        secretAccessKey: token
    }
});

async function test() {
    try {
        const command = new ConverseCommand({
            modelId: 'openai.gpt-oss-120b-1:0',
            messages: [{ role: 'user', content: [{ text: "Hello" }] }]
        });
        const response = await client.send(command);
        console.log("Success:", JSON.stringify(response, null, 2));
    } catch (e) {
        console.error("Error:", e.name, e.message);
    }
}
test();

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

async function test() {
    try {
        const command = new ConverseCommand({
            modelId: 'openai.gpt-oss-120b-1:0',
            messages: [{ role: 'user', content: [{ text: "Hello" }] }]
        });
        const response = await client.send(command);
        console.log("Success:", response);
    } catch (e) {
        console.error("Error:", e.name, e.message);
    }
}
test();

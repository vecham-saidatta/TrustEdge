const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

const client = new BedrockRuntimeClient({ region: 'us-west-2' });

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

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

async function test() {
    try {
        const payload = {
            prompt: "Hello",
            maxTokens: 100,
            temperature: 0.7
        };
        const command = new InvokeModelCommand({
            modelId: 'openai.gpt-oss-120b-1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(payload)
        });
        const response = await client.send(command);
        console.log("Success:", new TextDecoder().decode(response.body));
    } catch (e) {
        console.error("Error:", e.name, e.message);
    }
}
test();

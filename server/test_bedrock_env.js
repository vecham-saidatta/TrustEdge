const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
require('dotenv').config();

const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
const encodedStr = token.substring(4); // Remove ABSK
const decodedStr = Buffer.from(encodedStr, 'base64').toString('utf8');
const [accessKeyId, secretAccessKey] = decodedStr.split(':');

// Set them globally so the SDK picks them up and the proxy validates them
process.env.AWS_ACCESS_KEY_ID = accessKeyId;
process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;

const client = new BedrockRuntimeClient({
    region: 'us-east-1'
});

async function test() {
    try {
        const command = new ConverseCommand({
            modelId: 'openai.gpt-oss-120b-1',
            messages: [{ role: 'user', content: [{ text: "Hello" }] }]
        });
        const response = await client.send(command);
        console.log("Success:", JSON.stringify(response, null, 2));
    } catch (e) {
        console.error("Error:", e.name, e.message);
    }
}
test();

require('dotenv').config();

const token = process.env.AWS_BEARER_TOKEN_BEDROCK;

async function test() {
    try {
        const url = 'https://api.openai.com/v1/chat/completions';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                model: 'openai.gpt-oss-120b-1:0',
                messages: [{ role: "user", content: "Hello" }]
            })
        });
        console.log("Status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
test();

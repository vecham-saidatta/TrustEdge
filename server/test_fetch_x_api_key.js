const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
async function test() {
    try {
        const url = 'https://bedrock-runtime.us-east-1.amazonaws.com/model/openai.gpt-oss-120b-1:0/converse';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': token
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: "Hello" }] }]
            })
        });
        console.log("Status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
test();

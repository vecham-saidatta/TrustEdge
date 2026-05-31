const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
async function test() {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            model: "openai.gpt-oss-120b-1:0",
            messages: [{ role: "user", content: "Hello" }]
        })
    });
    console.log(await res.text());
}
test();

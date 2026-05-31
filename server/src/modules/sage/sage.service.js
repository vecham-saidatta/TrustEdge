/**
 * SAGE — Service Layer (GPT-OSS-120B via AWS Bedrock + Rule-based Fallback)
 *
 * Uses openai.gpt-oss-120b-1:0 on Amazon Bedrock for intelligent financial education.
 * Falls back to keyword-matched responses if:
 *   - No AWS_BEARER_TOKEN_BEDROCK is configured
 *   - Bedrock API call fails
 */

const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
const prisma = require('../../config/database');
const ApiError = require('../../utils/apiError');
const logger = require('../../config/logger');

// ── AI Setup ─────────────────────────────────────────────
const AWS_BEARER_TOKEN_BEDROCK = process.env.AWS_BEARER_TOKEN_BEDROCK;

let bedrockClient = null;
if (AWS_BEARER_TOKEN_BEDROCK) {
    try {
        // Decode the token which is base64 encoded after the ABSK prefix
        const encodedStr = AWS_BEARER_TOKEN_BEDROCK.substring(4);
        const decodedStr = Buffer.from(encodedStr, 'base64').toString('utf8');
        const [accessKeyId, secretAccessKey] = decodedStr.split(':');

        if (accessKeyId && secretAccessKey) {
            bedrockClient = new BedrockRuntimeClient({ 
                region: 'us-east-1',
                credentials: {
                    accessKeyId,
                    secretAccessKey
                }
            });
            logger.info('🧠 SAGE: AWS Bedrock client initialized with token credentials');
        } else {
            logger.error('SAGE: Failed to parse Bedrock credentials from token');
        }
    } catch (e) {
        logger.error('SAGE: Invalid Bedrock token format', { error: e.message });
    }
}

if (!AWS_BEARER_TOKEN_BEDROCK) {
    logger.warn('⚠️ SAGE: No API Keys found. Using rule-based fallback.');
}

// ── System Prompt ────────────────────────────────────────────
const TOPIC_INSTRUCTIONS = {
    BUDGETING: `The user selected BUDGETING. You MUST focus PRIMARILY on budgeting topics:
- 50/30/20 and 70/20/10 budgeting frameworks
- Expense tracking and categorization
- Monthly budget planning and salary allocation
- Cutting unnecessary expenses
- Managing irregular income
Even if the user's message is vague (like "hi" or "help me"), steer the conversation toward budgeting tips and ask what specific budgeting challenge they face.`,

    SAVING: `The user selected SAVING. You MUST focus PRIMARILY on saving topics:
- Emergency fund building (3-6 months of expenses)
- Goal-based saving strategies (wedding, education, home)
- Best savings instruments (FDs, RDs, savings accounts, liquid funds)
- Auto-saving tricks and pay-yourself-first method
- How to save on a tight budget
Even if the user's message is vague (like "hi" or "help me"), steer the conversation toward saving strategies and ask about their saving goals.`,

    DEBT: `The user selected DEBT. You MUST focus PRIMARILY on debt management topics:
- Debt avalanche vs snowball repayment methods
- Credit card debt dangers (36-42% APR in India)
- EMI management and loan structuring
- Debt consolidation pros and cons
- When to prioritize debt vs savings
- Avoiding debt traps and predatory lending
Even if the user's message is vague (like "hi" or "help me"), steer the conversation toward debt management and ask what debts they're dealing with.`,

    INVESTING: `The user selected INVESTING. You MUST focus PRIMARILY on investing topics:
- SIP (Systematic Investment Plans) and mutual funds
- Fixed Deposits vs equity vs hybrid funds
- Risk assessment and diversification
- Power of compounding and long-term wealth building
- Index funds, ELSS tax-saving funds
- When NOT to invest (no emergency fund, high-interest debt)
Even if the user's message is vague (like "hi" or "help me"), steer the conversation toward investing basics and ask about their risk appetite and investment horizon.`,

    GENERAL: `The user selected GENERAL. You may discuss any financial topic freely. If the user seems unsure, suggest they pick a specific topic (Budgeting, Saving, Debt, or Investing) for more focused advice.`,
};

const SYSTEM_PROMPT = `You are SAGE, a warm, empathetic, and knowledgeable financial education companion for TrustEdge — a human-first banking platform based in India.

YOUR PERSONALITY:
- Friendly and approachable — like a wise older sibling who happens to know finance
- Use simple, jargon-free language that anyone can understand
- Empathetic — never judgmental about financial mistakes
- Practical — give actionable advice, not theoretical lectures
- Use ₹ (Indian Rupees) for all monetary examples
- Include emojis sparingly for warmth (📊💰✅⚠️)

YOUR EXPERTISE:
- Budgeting (50/30/20 rule, expense tracking, salary management)
- Saving (emergency funds, goal-based saving, FDs, RDs)
- Debt management (avalanche/snowball methods, EMI planning, credit card traps)
- Investing basics (SIPs, mutual funds, FDs, risk assessment)
- Financial wellness and stress management

RULES:
1. NEVER give specific stock picks or guarantee returns
2. NEVER ask for personal financial data like account numbers
3. Always suggest consulting a certified financial planner for complex decisions
4. Keep responses concise (2-3 paragraphs max) but impactful
5. If the user seems stressed about money, acknowledge their feelings first before giving advice
6. Reference TrustEdge's TRUTH tool when discussing product comparisons
7. Be honest — if something is a bad financial move, say so gently but clearly

CRITICAL — TOPIC ENFORCEMENT:
{TOPIC_INSTRUCTION}
You MUST keep your response focused on the selected topic. Do NOT drift to other topics unless the user explicitly asks about something else.`;

// ── Language Instructions ────────────────────────────────────
const LANGUAGE_INSTRUCTIONS = {
    ENGLISH: "You MUST write your response entirely in English.",
    HINDI: "You MUST write your response entirely in Hindi (using Devanagari script).",
    TELUGU: "You MUST write your response entirely in Telugu (using Telugu script).",
};

// ── Translation Utility ──────────────────────────────────────
const normalizeText = (text) => {
    if (!text) return '';
    return text.toString().replace(/\s+/g, ' ').trim();
};

const MOCK_TRANSLATIONS = {
    HINDI: {
        [normalizeText("Great question! Here's a simple budgeting rule: Follow the 50/30/20 framework. Allocate 50% of your income to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. If your income has dropped, temporarily shift to 70/20/10 — prioritize essentials, reduce wants, and keep saving even a small amount. Would you like me to help create a specific plan for your situation?")]:
            "बहुत अच्छा सवाल है! यहाँ एक सरल बजट नियम है: 50/30/20 फ्रेमवर्क का पालन करें। अपनी आय का 50% आवश्यकताओं (किराया, भोजन, उपयोगिताएँ), 30% इच्छाओं (मनोरंजन, बाहर खाना) और 20% बचत और ऋण भुगतान के लिए आवंटित करें। यदि आपकी आय कम हो गई है, तो अस्थायी रूप से 70/20/10 पर शिफ्ट हो जाएँ — आवश्यकताओं को प्राथमिकता दें, इच्छाओं को कम करें, और थोड़ी मात्रा में भी बचत करना जारी रखें। क्या आप चाहेंगे कि मैं आपकी स्थिति के लिए एक विशिष्ट योजना बनाने में मदद करूँ?",

        [normalizeText("Tracking your spending is the first step to control. For one week, write down every expense — even small ones like chai or auto fares. You'll often find 10-15% of spending goes to things you didn't realize. Many people discover subscription services they forgot about! Start simple: just categorize into Needs, Wants, and Savings.")]:
            "अपने खर्चों को ट्रैक करना नियंत्रण का पहला कदम है। एक सप्ताह के लिए, हर खर्च को लिखें — यहाँ तक कि चाय या ऑटो किराए जैसे छोटे खर्च भी। आप अक्सर पाएंगे कि आपके खर्च का 10-15% उन चीजों पर जाता है जिनका आपको एहसास नहीं था। कई लोगों को उन सब्सक्रिप्शन सेवाओं का पता चलता है जिनके बारे में वे भूल गए थे! सरल शुरुआत करें: बस आवश्यकताओं, इच्छाओं और बचत में वर्गीकृत करें।",

        [normalizeText("A strong emergency fund covers 3-6 months of essential expenses. If your essentials cost ₹25,000/month, aim for ₹75,000 to ₹1,50,000. Start small — even ₹1,000/month builds up. The key is consistency, not amount. Set up an auto-transfer on salary day so savings happen before spending. Think of it as paying your future self first.")]:
            "एक मजबूत आपातकालीन निधि (इमरजेंसी फंड) 3-6 महीने के आवश्यक खर्चों को कवर करती है। यदि आपके आवश्यक खर्च ₹25,000/माह हैं, तो ₹75,000 से ₹1,50,000 का लक्ष्य रखें। छोटी शुरुआत करें — प्रति माह ₹1,000 भी काफी बढ़ जाता है। मुख्य बात निरंतरता है, राशि नहीं। वेतन के दिन एक ऑटो-ट्रांसफर सेट करें ताकि खर्च करने से पहले बचत हो जाए। इसे अपने भविष्य के स्वयं को पहले भुगतान करने के रूप में सोचें।",

        [normalizeText("Before investing, make sure you have your emergency fund ready. Once that's set, consider: Fixed Deposits (safe, 6-7% return), Recurring Deposits (builds discipline), or index mutual funds (higher potential, moderate risk). Never invest money you might need within 1-2 years. Start with what you're comfortable losing — even ₹500/month in a SIP is a great beginning.")]:
            "निवेश करने से पहले, सुनिश्चित करें कि आपका इमरजेंसी फंड तैयार है। एक बार जब यह सेट हो जाए, तो विचार करें: फिक्स्ड डिपॉजिट (सुरक्षित, 6-7% रिटर्न), रिकरिंग डिपॉजिट (अनुशासन बनाता है), या इंडेक्स म्यूचुअल फंड (उच्च क्षमता, मध्यम जोखिम)। कभी भी उस पैसे का निवेश न करें जिसकी आपको 1-2 साल के भीतर आवश्यकता हो सकती है। उस राशि से शुरुआत करें जिसे आप खोने में सहज हैं — एसआईपी (SIP) में ₹500/माह भी एक बेहतरीन शुरुआत है।",

        [normalizeText("If you're juggling multiple debts, try the 'avalanche method': list all debts by interest rate, pay minimums on everything, and throw extra money at the highest-rate debt first. Credit card debt (36-42% APR) is the most dangerous — always prioritize paying more than the minimum. Paying only minimums on ₹50,000 at 36% could cost you ₹90,000+ in interest over 8 years. Even ₹1,000 extra per month makes a huge difference.")]:
            "यदि आप कई ऋणों (लोन) को संभाल रहे हैं, तो 'एवलांच विधि' (avalanche method) आज़माएं: ब्याज दर के हिसाब से सभी ऋणों की सूची बनाएं, सभी पर न्यूनतम भुगतान करें, और सबसे पहले उच्चतम ब्याज दर वाले ऋण पर अतिरिक्त पैसा लगाएं। क्रेडिट कार्ड का कर्ज (36-42% वार्षिक दर) सबसे खतरनाक है — हमेशा न्यूनतम से अधिक भुगतान करने को प्राथमिकता दें। 36% की दर से ₹50,000 पर केवल न्यूनतम भुगतान करने से आपको 8 वर्षों में ब्याज के रूप में ₹90,000+ का भुगतान करना पड़ सकता है। प्रति माह ₹1,000 अतिरिक्त भी एक बड़ा अंतर पैदा करता है।",

        [normalizeText("Debt consolidation can help if you have multiple high-interest debts. You take one lower-interest loan to pay off all others. But be careful: check for processing fees, prepayment penalties, and whether the new rate is truly lower than your average. Use TRUTH (our product comparison tool) to find honest consolidation options.")]:
            "यदि आपके पास कई उच्च-ब्याज वाले ऋण हैं तो ऋण समेकन (डेट कंसोलिडेशन) मदद कर सकता है। आप अन्य सभी ऋणों का भुगतान करने के लिए एक कम-ब्याज वाला ऋण लेते हैं। लेकिन सावधान रहें: प्रोसेसिंग फीस, प्रीपेमेंट पेनल्टी की जांच करें और क्या नई दर वास्तव में आपके औसत से कम है। ईमानदार समेकन विकल्प खोजने के लिए ट्रुथ (TRUTH - हमारा उत्पाद तुलना उपकरण) का उपयोग करें।",

        [normalizeText("Welcome to investing! Three golden rules for beginners: 1) Never invest borrowed money. 2) Only invest what you won't need for 3+ years. 3) Diversify — don't put everything in one place. Start with a monthly SIP (Systematic Investment Plan) in an index fund. Even ₹500/month grows significantly over 10-15 years thanks to compounding. The best time to start was yesterday — the second best time is today.")]:
            "निवेश की दुनिया में स्वागत है! शुरुआती लोगों के लिए तीन सुनहरे नियम: 1) कभी भी उधार लिए गए पैसे का निवेश न करें। 2) केवल उसी पैसे का निवेश करें जिसकी आपको 3+ वर्षों तक आवश्यकता नहीं होगी। 3) विविधता लाएं — सब कुछ एक ही जगह न लगाएं। इंडेक्स फंड में मासिक एसआईपी (SIP) से शुरुआत करें। कंपाउंडिंग (चक्रवृद्धि ब्याज) की बदौलत 10-15 वर्षों में प्रति माह ₹500 भी काफी बढ़ जाता है। शुरुआत करने का सबसे अच्छा समय कल था — दूसरा सबसे अच्छा समय आज है।",

        [normalizeText("All investments carry some risk. Here's a simple risk ladder: Fixed Deposits (lowest risk, ~6-7% return) → Government Bonds (~7-8%) → Debt Mutual Funds (~7-9%) → Index Funds (~10-12% long-term) → Individual Stocks (highest risk, variable return). Match your investment to your timeline: short-term money stays safe, long-term money can take more risk.")]:
            "सभी निवेशों में कुछ जोखिम होता है। यहाँ एक सरल जोखिम सीढ़ी (रिस्क लैडर) है: फिक्स्ड डिपॉजिट (सबसे कम जोखिम, ~6-7% रिटर्न) → सरकारी बॉन्ड (~7-8%) → डेट म्यूचुअल फंड (~7-9%) → इंडेक्स फंड (दीर्घकालिक ~10-12%) → व्यक्तिगत स्टॉक (उच्चतम जोखिम, परिवर्तनीय रिटर्न)। अपने निवेश को अपनी समयसीमा से मिलाएँ: अल्पकालिक पैसा सुरक्षित रहता है, दीर्घकालिक पैसा अधिक जोखिम ले सकता है।",

        [normalizeText("I'm SAGE, your friendly financial companion! I can help you with: 📊 Budgeting — managing your monthly income and expenses, 💰 Saving — building emergency funds and saving goals, 💳 Debt — managing loans, EMIs, and credit card payments, 📈 Investing — understanding where to put your money. What would you like to learn about? Just ask in plain language — no jargon, I promise!")]:
            "मैं सेज (SAGE) हूँ, आपका मित्रवत वित्तीय साथी! मैं आपकी मदद कर सकता हूँ: 📊 बजट बनाने में — अपनी मासिक आय और खर्चों का प्रबंधन करने में, 💰 बचत करने में — आपातकालीन निधि और बचत लक्ष्यों का निर्माण करने में, 💳 ऋण प्रबंधन में — ऋण, ईएमआई और क्रेडिट कार्ड भुगतानों को संभालने में, 📈 निवेश करने में — यह समझने में कि अपना पैसा कहाँ लगाया जाए। आप किस बारे में जानना चाहेंगे? बस सरल भाषा में पूछें — कोई तकनीकी शब्दजाल नहीं, मैं वादा करता हूँ!",

        [normalizeText("Let me help you with budgeting! 📊 The 50/30/20 rule is a great starting point: 50% needs, 30% wants, 20% savings. If money is tight, try 70/20/10 instead. Track every expense for a week — you'll be surprised where your money goes. What specific budgeting question do you have?")]:
            "आइए मैं बजट बनाने में आपकी मदद करूँ! 📊 50/30/20 का नियम एक बेहतरीन शुरुआत है: 50% आवश्यकताएं, 30% इच्छाएं, 20% बचत। यदि पैसे की तंगी है, तो इसके बजाय 70/20/10 आज़माएं। एक सप्ताह के लिए हर खर्च को ट्रैक करें — आप आश्चर्यचकित रह जाएंगे कि आपका पैसा कहाँ जाता है। बजट से जुड़ा आपका विशिष्ट प्रश्न क्या है?",

        [normalizeText("Let's talk about saving! 💰 Start with an emergency fund covering 3-6 months of expenses. Even ₹500/month adds up. Set up auto-transfers on salary day — pay your future self first. Would you like tips on where to park your savings for the best returns?")]:
            "आइए बचत के बारे में बात करते हैं! 💰 3-6 महीने के खर्चों को कवर करने वाले आपातकालीन कोष से शुरुआत करें। प्रति माह ₹500 भी काफी जमा हो जाता है। वेतन के दिन ऑटो-ट्रांसफर सेट करें — अपने भविष्य के स्वयं को पहले भुगतान करें। क्या आप इस बारे में सुझाव चाहते हैं कि सर्वोत्तम रिटर्न के लिए अपनी बचत को कहाँ निवेश करें?",

        [normalizeText("Let me help with debt management! 💳 Key principle: attack the highest-interest debt first (this is called the 'avalanche method'). Credit card debt at 36-42% is an emergency — always pay more than the minimum. What kind of debt are you dealing with?")]:
            "आइए मैं ऋण प्रबंधन में मदद करूँ! 💳 मुख्य सिद्धांत: सबसे पहले उच्चतम ब्याज वाले ऋण पर प्रहार करें (इसे 'एवलांच विधि' कहा जाता है)। 36-42% पर क्रेडिट कार्ड का कर्ज एक आपातकालीन स्थिति है — हमेशा न्यूनतम से अधिक भुगतान करें। आप किस तरह के ऋण से जूझ रहे हैं?",

        [normalizeText("Let's explore investing! 📈 Three golden rules: 1) Never invest borrowed money, 2) Only invest what you won't need for 3+ years, 3) Diversify. SIPs (Systematic Investment Plans) are a great way to start — even ₹500/month in an index fund. What's your investing experience level?")]:
            "आइए निवेश का पता लगाते हैं! 📈 तीन सुनहरे नियम: 1) कभी भी उधार लिए गए पैसे का निवेश न करें, 2) केवल वही निवेश करें जिसकी आपको 3+ वर्षों तक आवश्यकता नहीं होगी, 3) विविधता लाएं। शुरुआत करने के लिए एसआईपी (SIP) एक बेहतरीन तरीका है — इंडेक्स फंड में प्रति माह ₹500 भी काफी है। आपका निवेश का अनुभव स्तर क्या है?",

        [normalizeText("I'm SAGE, your friendly financial companion! I can help with: 📊 Budgeting, 💰 Saving, 💳 Debt management, 📈 Investing. Select a topic above and ask anything — no jargon, I promise!")]:
            "मैं सेज (SAGE) हूँ, आपका मित्रवत वित्तीय साथी! मैं आपकी मदद कर सकता हूँ: 📊 बजट बनाने में, 💰 बचत करने में, 💳 ऋण प्रबंधन में, 📈 निवेश करने में। ऊपर दिए गए किसी विषय को चुनें और कुछ भी पूछें — कोई तकनीकी शब्दजाल नहीं, मैं वादा करता हूँ!"
    },
    TELUGU: {
        [normalizeText("Great question! Here's a simple budgeting rule: Follow the 50/30/20 framework. Allocate 50% of your income to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. If your income has dropped, temporarily shift to 70/20/10 — prioritize essentials, reduce wants, and keep saving even a small amount. Would you like me to help create a specific plan for your situation?")]:
            "చాలా మంచి ప్రశ్న! ఇక్కడ ఒక సాధారణ బడ్జెట్ నియమం ఉంది: 50/30/20 ఫ్రేమ్‌వర్క్‌ను అనుసరించండి. మీ ఆదాయంలో 50% అవసరాలకు (అద్దె, ఆహారం, యుటిలిటీస్), 30% కోరికలకు (వినోదం, బయట తినడం) మరియు 20% పొదుపు మరియు అప్పుల చెల్లింపులకు కేటాయించండి. ఒకవేళ మీ ఆదాయం తగ్గినట్లయితే, తాత్కాలికంగా 70/20/10 కి మారండి — అవసరాలకు ప్రాధాన్యత ఇవ్వండి, కోరికలను తగ్గించుకోండి మరియు తక్కువ మొత్తంలోనైనా పొదుపు చేయడం కొనసాగించండి. మీ పరిస్థితికి తగిన నిర్దిష్ట ప్రణాళికను రూపొందించడంలో నేను మీకు సహాయం చేయాలా?",

        [normalizeText("Tracking your spending is the first step to control. For one week, write down every expense — even small ones like chai or auto fares. You'll often find 10-15% of spending goes to things you didn't realize. Many people discover subscription services they forgot about! Start simple: just categorize into Needs, Wants, and Savings.")]:
            "మీ ఖర్చులను ట్రాక్ చేయడం అనేది నియంత్రణకు మొదటి అడుగు. ఒక వారం పాటు, ప్రతి చిన్న ఖర్చును — టీ లేదా ఆటో ఛార్జీల వంటి చిన్న వాటిని కూడా రాసి పెట్టుకోండి. మీ ఖర్చులలో 10-15% మీకు తెలియకుండానే అనవసర విషయాలపై పోతున్నట్లు మీరు గమనించవచ్చు. చాలా మంది తాము మర్చిపోయిన సబ్‌స్క్రిప్షన్ సేవలను కూడా కనుగొంటారు! సాధారణంగా ప్రారంభించండి: అవసరాలు, కోరికలు మరియు పొదుపులుగా వర్గీకరించండి.",

        [normalizeText("A strong emergency fund covers 3-6 months of essential expenses. If your essentials cost ₹25,000/month, aim for ₹75,000 to ₹1,50,000. Start small — even ₹1,000/month builds up. The key is consistency, not amount. Set up an auto-transfer on salary day so savings happen before spending. Think of it as paying your future self first.")]:
            "ఒక బలమైన అత్యవసర నిధి (ఎమర్జెన్సీ ఫండ్) 3-6 నెలల అవసరమైన ఖర్చులను కవర్ చేస్తుంది. మీ అవసరాలకు నెలకు ₹25,000 ఖర్చవుతుంటే, ₹75,000 నుండి ₹1,50,000 వరకు జమ చేయాలని లక్ష్యంగా పెట్టుకోండి. చిన్నగా ప్రారంభించండి — నెలకు ₹1,000 అయినా కూడా క్రమంగా పెరుగుతుంది. ఇక్కడ ముఖ్యం నిలకడగా దాచడం, ఎంత దాచామన్నది కాదు. శాలరీ క్రెడిట్ అయిన రోజునే ఆటో-ట్రాన్స్‌ఫర్ సెట్ చేసుకోండి, తద్వారా ఖర్చు చేయకముందే పొదుపు పూర్తవుతుంది. దీనిని మీ భవిష్యత్తు కోసం ముందే చెల్లించుకోవడంగా భావించండి.",

        [normalizeText("Before investing, make sure you have your emergency fund ready. Once that's set, consider: Fixed Deposits (safe, 6-7% return), Recurring Deposits (builds discipline), or index mutual funds (higher potential, moderate risk). Never invest money you might need within 1-2 years. Start with what you're comfortable losing — even ₹500/month in a SIP is a great beginning.")]:
            "పెట్టుబడి పెట్టడానికి ముందు, మీ అత్యవసర నిధి సిద్ధంగా ఉందో లేదో చూసుకోండి. అది పూర్తయిన తర్వాత, వీటిని పరిశీలించండి: ఫిక్స్‌డ్ డిపాజిట్లు (సురక్షితం, 6-7% రాబడి), రికరింగ్ డిపాజిట్లు (క్రమశిక్షణను అలవాటు చేస్తుంది), లేదా ఇండెక్స్ మ్యూచువల్ ఫండ్స్ (ఎక్కువ రాబడి అవకాశాలు, మధ్యస్థ రిస్క్). రాబోయే 1-2 ఏళ్లలో అవసరమయ్యే డబ్బును ఎప్పుడూ పెట్టుబడిగా పెట్టకండి. మీరు రిస్క్ చేయగలిగే చిన్న మొత్తంతో ప్రారంభించండి — నెలకు ₹500 SIP (సిప్) తో ప్రారంభించినా అది ఒక అద్భుతమైన ఆరంభం అవుతుంది.",

        [normalizeText("If you're juggling multiple debts, try the 'avalanche method': list all debts by interest rate, pay minimums on everything, and throw extra money at the highest-rate debt first. Credit card debt (36-42% APR) is the most dangerous — always prioritize paying more than the minimum. Paying only minimums on ₹50,000 at 36% could cost you ₹90,000+ in interest over 8 years. Even ₹1,000 extra per month makes a huge difference.")]:
            "ఒకవేళ మీరు ఒకేసారి బహుళ అప్పులను ఎదుర్కొంటుంటే, 'అవలాంచ్ పద్ధతి' (avalanche method) ని ప్రయత్నించండి: వడ్డీ రేట్ల ఆధారంగా మీ అప్పులన్నింటినీ జాబితా చేయండి, అన్నింటికీ కనీస వాయిదాలు (minimums) చెల్లిస్తూనే, అత్యధిక వడ్డీ రేటు ఉన్న అప్పును తీర్చడానికి అదనపు డబ్బును కేటాయించండి. క్రెడిట్ కార్డ్ అప్పులు (36-42% APR) అత్యంత ప్రమాదకరమైనవి — ఎల్లప్పుడూ కనీస వాయిదా కంటే ఎక్కువ చెల్లించడానికే ప్రాధాన్యత ఇవ్వండి. ₹50,000 అప్పుపై 36% వడ్డీ వద్ద కేవలం కనీస వాయిదాలు మాత్రమే చెల్లిస్తే, 8 ఏళ్లలో వడ్డీ రూపంలోనే ₹90,000 కంటే ఎక్కువ నష్టపోవాల్సి వస్తుంది. నెలకు ₹1,000 అదనంగా చెల్లించినా చాలా పెద్ద తేడా వస్తుంది.",

        [normalizeText("Debt consolidation can help if you have multiple high-interest debts. You take one lower-interest loan to pay off all others. But be careful: check for processing fees, prepayment penalties, and whether the new rate is truly lower than your average. Use TRUTH (our product comparison tool) to find honest consolidation options.")]:
            "మీకు ఎక్కువ వడ్డీ రేట్లు ఉన్న బహుళ అప్పులు ఉన్నప్పుడు డెట్ కన్సాలిడేషన్ (అప్పుల ఏకీకరణ) సహాయపడుతుంది. మీరు మిగతా అప్పులన్నింటినీ తీర్చడానికి తక్కువ వడ్డీతో కూడిన ఒకే ఒక లోన్ తీసుకుంటారు. అయితే జాగ్రత్తగా ఉండండి: ప్రాసెసింగ్ ఫీజులు, ప్రీ-పేమెంట్ పెనాల్టీలు మరియు కొత్త వడ్డీ రేటు మీ పాత సగటు రేటు కంటే నిజంగానే తక్కువగా ఉందా లేదా అని తనిఖీ చేసుకోండి. నిజాయితీ గల ఏకీకరణ మార్గాలను కనుగొనడానికి మా ప్రొడక్ట్ కంపారిజన్ టూల్ అయిన TRUTH ను ఉపయోగించండి.",

        [normalizeText("Welcome to investing! Three golden rules for beginners: 1) Never invest borrowed money. 2) Only invest what you won't need for 3+ years. 3) Diversify — don't put everything in one place. Start with a monthly SIP (Systematic Investment Plan) in an index fund. Even ₹500/month grows significantly over 10-15 years thanks to compounding. The best time to start was yesterday — the second best time is today.")]:
            "ఇన్వెస్ట్‌మెంట్ ప్రపంచంలోకి మీకు స్వాగతం! ప్రారంభకులకు మూడు సువర్ణ సూత్రాలు: 1) ఎప్పుడూ అప్పు చేసిన డబ్బును పెట్టుబడిగా పెట్టకండి. 2) రాబోయే 3+ సంవత్సరాల వరకు మీకు అవసరం లేని డబ్బును మాత్రమే పెట్టుబడిగా పెట్టండి. 3) వైవిధ్యం (Diversify) పాటించండి — మీ డబ్బు మొత్తాన్ని ఒకే చోట పెట్టకండి. ఒక ఇండెక్స్ ఫండ్‌లో నెలవారీ SIP (సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్) తో ప్రారంభించండి. కాంపౌండింగ్ (చక్రవడ్డీ) శక్తి వల్ల 10-15 సంవత్సరాలలో నెలకు ₹500 చొప్పున పెట్టినా అది ఒక పెద్ద మొత్తంగా మారుతుంది. పెట్టుబడి ప్రారంభించడానికి ఉత్తమ సమయం నిన్న — రెండవ ఉత్తమ సమయం నేడు.",

        [normalizeText("All investments carry some risk. Here's a simple risk ladder: Fixed Deposits (lowest risk, ~6-7% return) → Government Bonds (~7-8%) → Debt Mutual Funds (~7-9%) → Index Funds (~10-12% long-term) → Individual Stocks (highest risk, variable return). Match your investment to your timeline: short-term money stays safe, long-term money can take more risk.")]:
            "అన్ని పెట్టుబడులలోనూ కొంత రిస్క్ ఉంటుంది. ఇక్కడ ఒక సాధారణ రిస్క్ నిచ్చెన ఉంది: ఫిక్స్‌డ్ డిపాజిట్లు (అత్యల్ప రిస్క్, ~6-7% రాబడి) → ప్రభుత్వ బాండ్లు (~7-8%) → డెట్ మ్యూచువల్ ఫండ్స్ (~7-9%) → ఇండెక్స్ ఫండ్స్ (దీర్ఘకాలికంగా ~10-12%) → వ్యక్తిగత స్టాక్స్ (అత్యధిక రిస్క్, మారుతుండే రాబడి). మీ పెట్టుబడిని మీ కాలపరిమితికి అనుగుణంగా ఎంచుకోండి: స్వల్పకాలిక డబ్బు సురక్షితంగా ఉండాలి, దీర్ఘకాలిక డబ్బుపై ఎక్కువ రిస్క్ తీసుకోవచ్చు.",

        [normalizeText("I'm SAGE, your friendly financial companion! I can help you with: 📊 Budgeting — managing your monthly income and expenses, 💰 Saving — building emergency funds and saving goals, 💳 Debt — managing loans, EMIs, and credit card payments, 📈 Investing — understanding where to put your money. What would you like to learn about? Just ask in plain language — no jargon, I promise!")]:
            "నేను సేజ్ (SAGE), మీ స్నేహపూర్వక ఆర్థిక భాగస్వామిని! నేను మీకు వీటిలో సహాయపడగలను: 📊 బడ్జెటింగ్ — మీ నెలవారీ ఆదాయం మరియు ఖర్చులను నిర్వహించడం, 💰 పొదుపు — అత్యవసర నిధులు మరియు పొదుపు లక్ష్యాలను నిర్మించడం, 💳 అప్పుల నిర్వహణ — రుణాలు, EMIలు మరియు క్రెడిట్ కార్డ్ చెల్లింపులను నిర్వహించడం, 📈 పెట్టుబడులు — మీ డబ్బును ఎక్కడ పెట్టాలో అర్థం చేసుకోవడం. మీరు దేని గురించి తెలుసుకోవాలనుకుంటున్నారు? సాధారణ భాషలో అడగండి — కఠినమైన పదాలు ఉండవని నేను బల్లగుద్ది చెప్తున్నాను!",

        [normalizeText("Let me help you with budgeting! 📊 The 50/30/20 rule is a great starting point: 50% needs, 30% wants, 20% savings. If money is tight, try 70/20/10 instead. Track every expense for a week — you'll be surprised where your money goes. What specific budgeting question do you have?")]:
            "బడ్జెట్ రూపొందించడంలో మీకు సహాయం చేయనివ్వండి! 📊 50/30/20 నియమం ఒక గొప్ప ఆరంభం: 50% అవసరాలు, 30% కోరికలు, 20% పొదుపులు. ఒకవేళ డబ్బు ఇబ్బందిగా ఉంటే, దానికి బదులుగా 70/20/10 ప్రయత్నించండి. ఒక వారం పాటు మీ ప్రతి ఖర్చును tracking చేయండి — మీ డబ్బు ఎక్కడికి వెళ్తుందో చూసి మీరే ఆశ్చర్యపోతారు. బడ్జెట్‌కు సంబంధించి మీకున్న నిర్దిష్ట ప్రశ్న ఏమిటి?",

        [normalizeText("Let's talk about saving! 💰 Start with an emergency fund covering 3-6 months of expenses. Even ₹500/month adds up. Set up auto-transfers on salary day — pay your future self first. Would you like tips on where to park your savings for the best returns?")]:
            "పొదుపు చేయడం గురించి మాట్లాడుకుందాం! 💰 కనీసం 3-6 నెలల ఖర్చులకు సరిపడా అత్యవసర నిధితో ప్రారంభించండి. నెలకు ₹500 పొదుపు చేసినా అది క్రమంగా పెరుగుతుంది. శాలరీ క్రెడిట్ అయిన రోజే ఆటో-ట్రాన్స్‌ఫర్ సెట్ చేసుకోండి — మీ భవిష్యత్తు కోసం ముందే దాచుకోండి. మంచి రాబడి కోసం మీ పొదుపు మొత్తాన్ని ఎక్కడ దాచాలో సూచనలు కావాలా?",

        [normalizeText("Let me help with debt management! 💳 Key principle: attack the highest-interest debt first (this is called the 'avalanche method'). Credit card debt at 36-42% is an emergency — always pay more than the minimum. What kind of debt are you dealing with?")]:
            "అప్పుల నిర్వహణలో నేను మీకు సహాయం చేయనివ్వండి! 💳 ముఖ్య సూత్రం: అత్యధిక వడ్డీ ఉన్న అప్పును ముందుగా తీర్చండి (దీనిని 'అవలాంచ్ పద్ధతి' అంటారు). 36-42% వడ్డీతో కూడిన క్రెడిట్ కార్డ్ అప్పు అత్యవసర పరిస్థితి వంటిది — ఎల్లప్పుడూ కనీస వాయిదా కంటే ఎక్కువ చెల్లించండి. మీరు ప్రస్తుతం ఎలాంటి అప్పును ఎదుర్కొంటున్నారు?",

        [normalizeText("Let's explore investing! 📈 Three golden rules: 1) Never invest borrowed money, 2) Only invest what you won't need for 3+ years, 3) Diversify. SIPs (Systematic Investment Plans) are a great way to start — even ₹500/month in an index fund. What's your investing experience level?")]:
            "పెట్టుబడి పెట్టే మార్గాలను అన్వేషిద్దాం! 📈 మూడు సువర్ణ సూత్రాలు: 1) ఎప్పుడూ అప్పు చేసిన డబ్బును ఇన్వెస్ట్ చేయకండి, 2) కనీసం 3+ సంవత్సరాల వరకు అవసరం లేని డబ్బును మాత్రమే పెట్టుబడిగా పెట్టండి, 3) వైవిధ్యం (Diversify) పాటించండి. ప్రారంభించడానికి SIP (సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్) ఒక అద్భుతమైన మార్గం — ఇండెక్స్ ఫండ్‌లో నెలకు ₹500 చొప్పున పెట్టినా సరిపోతుంది. ఇన్వెస్ట్‌మెంట్‌లో మీ అనుభవ స్థాయి ఎంత?",

        [normalizeText("I'm SAGE, your friendly financial companion! I can help with: 📊 Budgeting, 💰 Saving, 💳 Debt management, 📈 Investing. Select a topic above and ask anything — no jargon, I promise!")]:
            "నేను సేజ్ (SAGE), మీ స్నేహపూర్వక ఆర్థిక భాగస్వామిని! నేను మీకు సహాయపడగలను: 📊 బడ్జెటింగ్, 💰 పొదుపు, 💳 అప్పుల నిర్వహణ, 📈 పెట్టుబడులు. పైన ఉన్న ఏదైనా అంశాన్ని ఎంచుకుని ఏదైనా అడగండి — కఠినమైన పదాలు ఉండవని నేను బల్లగుద్ది చెప్తున్నాను!"
    }
};

// ── Translation Utility ──────────────────────────────────────
const translateText = async (text, targetLanguage) => {
    if (!text || !targetLanguage || targetLanguage === 'ENGLISH') return text;

    // 1. Try local dictionary translation first
    const targetDict = MOCK_TRANSLATIONS[targetLanguage];
    if (targetDict) {
        const normalizedIn = normalizeText(text);
        if (targetDict[normalizedIn]) {
            return targetDict[normalizedIn];
        }
    }

    // 2. Try online API translation
    try {
        const prompt = `You are a professional translator for TrustEdge, a human-first banking platform in India.
Translate the following text to ${targetLanguage} (if HINDI, use Devanagari script; if TELUGU, use Telugu script).
Maintain a warm, professional, and empathetic tone. Keep any emojis as is.
Return ONLY the translation, with no explanation or introductory text. Do not include markdown code block syntax.

Text to translate:
${text}`;

        if (bedrockClient) {
            try {
                const command = new ConverseCommand({
                    modelId: 'openai.gpt-oss-120b-1:0',
                    messages: [{ role: 'user', content: [{ text: prompt }] }]
                });
                const response = await bedrockClient.send(command);
                const textBlock = response.output.message.content.find(c => c.text !== undefined);
                if (textBlock && textBlock.text.trim()) {
                    return textBlock.text.trim();
                }
            } catch (bedrockError) {
                logger.error('SAGE: Bedrock translation failed', { error: bedrockError.message });
            }
        }
        
        // If we reach here, translation API returned nothing valid
        throw new Error('All translation APIs failed or returned empty response.');
    } catch (error) {
        logger.error('SAGE: Custom message translation failed completely', { error: error.message });
        if (targetLanguage === 'HINDI') {
            return `[अनुवाद सेवा अस्थायी रूप से अनुपलब्ध है। मूल संदेश:]\n\n${text}`;
        }
        return `[Translation service temporarily unavailable. Original message:]\n\n${text}`;
    }
};

// ── AI Response Generator ────────────────────────────
const generateAIResponse = async (message, topic, chatHistory, language = 'ENGLISH') => {
    if (!bedrockClient) return null; // Fallback signal

    try {
        const topicInstruction = TOPIC_INSTRUCTIONS[topic] || TOPIC_INSTRUCTIONS.GENERAL;
        let systemPrompt = SYSTEM_PROMPT.replace('{TOPIC_INSTRUCTION}', topicInstruction);

        const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.ENGLISH;
        systemPrompt = `${systemPrompt}\n\nCRITICAL LANGUAGE REQUIREMENT:\n${languageInstruction}`;

        // Build conversation context from recent history
        const historyContext = chatHistory.length > 0
            ? '\n\nRECENT CONVERSATION:\n' + chatHistory.map(h =>
                `User: ${h.userMessage}\nSAGE: ${h.sageResponse}`
            ).join('\n\n')
            : '';

        const fullPrompt = `${systemPrompt}${historyContext}\n\nUser's message: ${message}`;


        let responseText = null;
        let engine = null;

        if (bedrockClient) {
            try {
                const command = new ConverseCommand({
                    modelId: 'openai.gpt-oss-120b-1:0',
                    messages: [{ role: 'user', content: [{ text: fullPrompt }] }]
                });
                const response = await bedrockClient.send(command);
                // gpt-oss-120b may return reasoningContent blocks — extract only text blocks
                const textBlock = response.output.message.content.find(c => c.text !== undefined);
                responseText = textBlock ? textBlock.text : null;
                if (responseText) {
                    engine = 'bedrock';
                    logger.info('SAGE: GPT-OSS-120B response generated', { topic, messageLength: message.length });
                }
            } catch (bedrockError) {
                logger.error('SAGE: Bedrock AI response failed', { error: bedrockError.message });
            }
        }

        if (responseText && responseText.trim().length > 0) {
            return { response: responseText.trim(), engine };
        }

        return null; // Fallback signal
    } catch (error) {
        logger.error('SAGE: AI API error, falling back to rules', {
            error: error.message,
            code: error.status || error.code,
        });
        return null; // Fallback to rule-based
    }
};

// ── Rule-based Fallback Knowledge Base ───────────────────────
const KNOWLEDGE_BASE = {
    BUDGETING: [
        {
            keywords: ['budget', 'spend', 'expenses', 'manage', 'plan', 'salary drop', 'salary cut'],
            response: "Great question! Here's a simple budgeting rule: Follow the 50/30/20 framework. Allocate 50% of your income to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. If your income has dropped, temporarily shift to 70/20/10 — prioritize essentials, reduce wants, and keep saving even a small amount. Would you like me to help create a specific plan for your situation?",
        },
        {
            keywords: ['track', 'monitor', 'where', 'going'],
            response: "Tracking your spending is the first step to control. For one week, write down every expense — even small ones like chai or auto fares. You'll often find 10-15% of spending goes to things you didn't realize. Many people discover subscription services they forgot about! Start simple: just categorize into Needs, Wants, and Savings.",
        },
    ],
    SAVING: [
        {
            keywords: ['save', 'emergency', 'fund', 'how much', 'start'],
            response: "A strong emergency fund covers 3-6 months of essential expenses. If your essentials cost ₹25,000/month, aim for ₹75,000 to ₹1,50,000. Start small — even ₹1,000/month builds up. The key is consistency, not amount. Set up an auto-transfer on salary day so savings happen before spending. Think of it as paying your future self first.",
        },
        {
            keywords: ['invest', 'grow', 'return', 'fd', 'mutual fund'],
            response: "Before investing, make sure you have your emergency fund ready. Once that's set, consider: Fixed Deposits (safe, 6-7% return), Recurring Deposits (builds discipline), or index mutual funds (higher potential, moderate risk). Never invest money you might need within 1-2 years. Start with what you're comfortable losing — even ₹500/month in a SIP is a great beginning.",
        },
    ],
    DEBT: [
        {
            keywords: ['debt', 'loan', 'emi', 'repay', 'credit card', 'minimum', 'payment'],
            response: "If you're juggling multiple debts, try the 'avalanche method': list all debts by interest rate, pay minimums on everything, and throw extra money at the highest-rate debt first. Credit card debt (36-42% APR) is the most dangerous — always prioritize paying more than the minimum. Paying only minimums on ₹50,000 at 36% could cost you ₹90,000+ in interest over 8 years. Even ₹1,000 extra per month makes a huge difference.",
        },
        {
            keywords: ['consolidate', 'combine', 'single', 'one loan'],
            response: "Debt consolidation can help if you have multiple high-interest debts. You take one lower-interest loan to pay off all others. But be careful: check for processing fees, prepayment penalties, and whether the new rate is truly lower than your average. Use TRUTH (our product comparison tool) to find honest consolidation options.",
        },
    ],
    INVESTING: [
        {
            keywords: ['invest', 'stock', 'market', 'sip', 'mutual fund', 'beginner', 'start'],
            response: "Welcome to investing! Three golden rules for beginners: 1) Never invest borrowed money. 2) Only invest what you won't need for 3+ years. 3) Diversify — don't put everything in one place. Start with a monthly SIP (Systematic Investment Plan) in an index fund. Even ₹500/month grows significantly over 10-15 years thanks to compounding. The best time to start was yesterday — the second best time is today.",
        },
        {
            keywords: ['risk', 'safe', 'secure', 'guaranteed'],
            response: "All investments carry some risk. Here's a simple risk ladder: Fixed Deposits (lowest risk, ~6-7% return) → Government Bonds (~7-8%) → Debt Mutual Funds (~7-9%) → Index Funds (~10-12% long-term) → Individual Stocks (highest risk, variable return). Match your investment to your timeline: short-term money stays safe, long-term money can take more risk.",
        },
    ],
    GENERAL: [
        {
            keywords: ['help', 'advice', 'what', 'how', 'money', 'finance', 'financial', 'hi', 'hello', 'hey'],
            response: "I'm SAGE, your friendly financial companion! I can help you with: 📊 Budgeting — managing your monthly income and expenses, 💰 Saving — building emergency funds and saving goals, 💳 Debt — managing loans, EMIs, and credit card payments, 📈 Investing — understanding where to put your money. What would you like to learn about? Just ask in plain language — no jargon, I promise!",
        },
    ],
};

// Topic-specific default responses (when no keyword matches)
const TOPIC_DEFAULTS = {
    BUDGETING: "Let me help you with budgeting! 📊 The 50/30/20 rule is a great starting point: 50% needs, 30% wants, 20% savings. If money is tight, try 70/20/10 instead. Track every expense for a week — you'll be surprised where your money goes. What specific budgeting question do you have?",
    SAVING: "Let's talk about saving! 💰 Start with an emergency fund covering 3-6 months of expenses. Even ₹500/month adds up. Set up auto-transfers on salary day — pay your future self first. Would you like tips on where to park your savings for the best returns?",
    DEBT: "Let me help with debt management! 💳 Key principle: attack the highest-interest debt first (this is called the 'avalanche method'). Credit card debt at 36-42% is an emergency — always pay more than the minimum. What kind of debt are you dealing with?",
    INVESTING: "Let's explore investing! 📈 Three golden rules: 1) Never invest borrowed money, 2) Only invest what you won't need for 3+ years, 3) Diversify. SIPs (Systematic Investment Plans) are a great way to start — even ₹500/month in an index fund. What's your investing experience level?",
    GENERAL: "I'm SAGE, your friendly financial companion! I can help with: 📊 Budgeting, 💰 Saving, 💳 Debt management, 📈 Investing. Select a topic above and ask anything — no jargon, I promise!",
};

/**
 * Rule-based response generator (fallback).
 * When a specific topic is selected, stays focused on that topic.
 */
const generateRuleBasedResponse = (message, topic) => {
    const lowerMessage = message.toLowerCase();

    if (topic && topic !== 'GENERAL') {
        // SPECIFIC TOPIC SELECTED: only search that topic's keywords
        const entries = KNOWLEDGE_BASE[topic] || [];
        for (const entry of entries) {
            if (entry.keywords.some((kw) => lowerMessage.includes(kw))) return entry.response;
        }
        // No keyword match — return the topic-specific default (NOT general)
        return TOPIC_DEFAULTS[topic];
    }

    // GENERAL: search all topics for keyword matches
    for (const t of Object.keys(KNOWLEDGE_BASE)) {
        for (const entry of KNOWLEDGE_BASE[t]) {
            if (entry.keywords.some((kw) => lowerMessage.includes(kw))) return entry.response;
        }
    }

    return TOPIC_DEFAULTS.GENERAL;
};

/**
 * Generate SAGE response — tries AI first, falls back to rules.
 */
const generateResponse = async (message, topic, chatHistory = [], language = 'ENGLISH') => {
    // Try AI LLM first
    const aiResult = await generateAIResponse(message, topic, chatHistory, language);
    if (aiResult && aiResult.response) {
        return { response: aiResult.response, engine: aiResult.engine };
    }

    // Fallback to rule-based
    const ruleResponse = generateRuleBasedResponse(message, topic);
    
    // If language is not English, translate the rule-based response using Bedrock if available
    if (language && language !== 'ENGLISH') {
        try {
            const translatedRuleResponse = await translateText(ruleResponse, language);
            return { response: translatedRuleResponse, engine: 'rules-translated' };
        } catch (err) {
            logger.warn('SAGE: Fallback rule translation failed, returning English rules', { error: err.message });
            return { response: ruleResponse, engine: 'rules' };
        }
    }

    return { response: ruleResponse, engine: 'rules' };
};

/**
 * Process a chat message and return SAGE response.
 */
const chat = async (userId, { message, topic, language = 'ENGLISH' }) => {
    // Fetch recent conversation history for context
    const recentHistory = await prisma.sageConversation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { userMessage: true, sageResponse: true },
    });

    const { response: sageResponse, engine } = await generateResponse(
        message,
        topic,
        recentHistory.reverse(), // oldest first for context
        language
    );

    const conversation = await prisma.sageConversation.create({
        data: {
            userId,
            topic,
            userMessage: message,
            sageResponse,
        },
    });

    logger.info('SAGE chat processed', { userId, topic, engine, language });
    return conversation;
};


// ── Smart Suggestions Engine ─────────────────────────────────
const SUGGESTIONS_PROMPT = `You are SAGE, the AI financial advisor for TrustEdge. Based on the user's REAL financial data below, generate 3-5 specific, actionable, personalized financial suggestions.

USER'S FINANCIAL DATA:
{USER_DATA}

RULES:
1. Each suggestion must be specific to THIS user's actual numbers — not generic advice
2. Reference their actual balance, income, spending patterns, and alerts
3. Be warm but direct — if they're in trouble, say so gently
4. Use ₹ (Indian Rupees) and reference actual amounts
5. Include priority level: 🔴 Urgent, 🟡 Important, 🟢 Good to do
6. Keep each suggestion to 2-3 sentences max
7. If they have stress alerts, address those first

FORMAT your response as a JSON array of objects with "priority", "title", and "description" fields.
Example: [{"priority": "urgent", "title": "Build Emergency Fund", "description": "Your balance is low..."}]

Return ONLY the JSON array, no markdown, no code blocks, just the raw JSON.`;

/**
 * Generate personalized smart suggestions based on all user data.
 */
const getSuggestions = async (userId) => {
    // Gather ALL user financial data
    const [profile, recentTransactions, alerts] = await Promise.all([
        prisma.financialProfile.findUnique({ where: { userId } }),
        prisma.transaction.findMany({
            where: { userId },
            orderBy: { transactionDate: 'desc' },
            take: 20,
            select: { type: true, amount: true, category: true, description: true, transactionDate: true },
        }),
        prisma.stressAlert.findMany({
            where: { userId, status: { in: ['OPEN', 'ACKNOWLEDGED'] } },
            select: { alertType: true, severity: true, message: true },
        }),
    ]);

    if (!profile) {
        return { suggestions: getDefaultSuggestions(), engine: 'defaults' };
    }

    // Build data summary for LLM
    const totalIncome = recentTransactions
        .filter(t => t.type === 'CREDIT')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = recentTransactions
        .filter(t => t.type === 'DEBIT')
        .reduce((sum, t) => sum + t.amount, 0);

    const categorySpending = {};
    recentTransactions.filter(t => t.type === 'DEBIT').forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

    const userData = `
Balance: ₹${profile.currentBalance?.toLocaleString()}
Monthly Income: ₹${profile.monthlyIncome?.toLocaleString()}
Monthly Expenses: ₹${profile.monthlyExpenses?.toLocaleString()}
Stress Level: ${profile.stressLevel}
Risk Score: ${(profile.riskScore * 100).toFixed(0)}%

Recent Income (last 20 txns): ₹${totalIncome.toLocaleString()}
Recent Spending (last 20 txns): ₹${totalExpenses.toLocaleString()}
Spending by Category: ${JSON.stringify(categorySpending)}

Active Alerts (${alerts.length}):
${alerts.map(a => `- [${a.severity}] ${a.message}`).join('\n')}`;

    // Try AI for personalized suggestions
    if (bedrockClient) {
        try {
            const prompt = SUGGESTIONS_PROMPT.replace('{USER_DATA}', userData);
            let responseText = '';

            let bedrockFailed = false;
            if (bedrockClient) {
                try {
                    const command = new ConverseCommand({
                        modelId: 'openai.gpt-oss-120b-1:0',
                        messages: [{ role: 'user', content: [{ text: prompt }] }]
                    });
                    const response = await bedrockClient.send(command);
                    // extract only text blocks (skip reasoningContent)
                    const textBlock = response.output.message.content.find(c => c.text !== undefined);
                    responseText = textBlock ? textBlock.text.trim() : '';
                } catch (bedrockError) {
                    logger.error('SAGE: Bedrock suggestions failed', { error: bedrockError.message });
                    bedrockFailed = true;
                }
            }

            // Parse JSON from response (handle potential markdown wrapping)
            let jsonStr = responseText;
            if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
            }

            const suggestions = JSON.parse(jsonStr);
            const engineName = 'bedrock';
            logger.info(`SAGE: Smart suggestions generated via ${engineName}`, { userId, count: suggestions.length });
            return { suggestions, engine: engineName };
        } catch (error) {
            logger.error('SAGE: AI suggestions error', { error: error.message });
        }
    }

    // Fallback: rule-based suggestions from actual data
    const suggestions = generateRuleBasedSuggestions(profile, alerts, categorySpending, totalIncome, totalExpenses);
    return { suggestions, engine: 'rules' };
};

/**
 * Rule-based suggestion generator (fallback).
 */
const generateRuleBasedSuggestions = (profile, alerts, categorySpending, totalIncome, totalExpenses) => {
    const suggestions = [];

    // Check stress alerts
    if (alerts.some(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')) {
        suggestions.push({
            priority: 'urgent',
            title: '🚨 Address Your Financial Alerts',
            description: `You have ${alerts.length} active alert(s) including high-severity issues. Review them in the Alerts section and take action — your financial health depends on it.`,
        });
    }

    // Low balance warning
    if (profile.currentBalance < profile.monthlyExpenses) {
        suggestions.push({
            priority: 'urgent',
            title: '💰 Low Balance Warning',
            description: `Your balance (₹${profile.currentBalance?.toLocaleString()}) is below your monthly expenses (₹${profile.monthlyExpenses?.toLocaleString()}). Cut non-essential spending immediately and focus on income recovery.`,
        });
    }

    // Savings rate
    const savingsRate = profile.monthlyIncome > 0
        ? ((profile.monthlyIncome - profile.monthlyExpenses) / profile.monthlyIncome * 100)
        : 0;
    if (savingsRate < 10) {
        suggestions.push({
            priority: 'important',
            title: '📊 Improve Your Savings Rate',
            description: `You're saving only ${savingsRate.toFixed(0)}% of your income. Aim for at least 20%. Start by cutting the top non-essential expense category.`,
        });
    } else if (savingsRate >= 20) {
        suggestions.push({
            priority: 'good',
            title: '✅ Great Savings Habit!',
            description: `You're saving ${savingsRate.toFixed(0)}% of your income — that's excellent! Consider investing this surplus in a SIP or FD for long-term growth.`,
        });
    }

    // High risk score
    if (profile.riskScore > 0.6) {
        suggestions.push({
            priority: 'important',
            title: '⚠️ Reduce Financial Risk',
            description: `Your risk score is ${(profile.riskScore * 100).toFixed(0)}%. Focus on building an emergency fund of 3 months' expenses (₹${(profile.monthlyExpenses * 3)?.toLocaleString()}).`,
        });
    }

    // Emergency fund check
    if (profile.currentBalance < profile.monthlyExpenses * 3) {
        suggestions.push({
            priority: 'important',
            title: '🛡️ Build Your Emergency Fund',
            description: `Aim for ₹${(profile.monthlyExpenses * 3)?.toLocaleString()} in emergency savings (3 months of expenses). You currently have ₹${profile.currentBalance?.toLocaleString()}.`,
        });
    }

    // Always add an encouraging one
    if (suggestions.length < 3) {
        suggestions.push({
            priority: 'good',
            title: '💬 Talk to SAGE',
            description: `Use the SAGE Chat to get personalized advice on budgeting, saving, debt management, or investing. SAGE is here to help!`,
        });
    }

    return suggestions;
};

const getDefaultSuggestions = () => [
    { priority: 'important', title: '📊 Complete Your Profile', description: 'Add your financial details to get personalized suggestions and stress analysis.' },
    { priority: 'good', title: '💬 Chat with SAGE', description: 'Ask SAGE about budgeting, saving, or investing to get started on your financial journey.' },
    { priority: 'good', title: '⚖️ Compare Products', description: 'Use TRUTH Compare to find the best financial products — we show you the honest truth.' },
];

/**
 * Get chat history with optional topic filter.
 */
const getHistory = async (userId, { page, limit, topic }) => {
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const where = { userId };
    if (topic) where.topic = topic;

    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
        prisma.sageConversation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.sageConversation.count({ where }),
    ]);

    return {
        conversations,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

/**
 * Record feedback on a conversation.
 */
const recordFeedback = async (conversationId, userId, { helpful }) => {
    const conversation = await prisma.sageConversation.findUnique({ where: { id: conversationId } });

    if (!conversation) throw ApiError.notFound('Conversation not found.');
    if (conversation.userId !== userId) throw ApiError.forbidden('You can only rate your own conversations.');

    const updated = await prisma.sageConversation.update({
        where: { id: conversationId },
        data: { helpful },
    });

    return updated;
};

/**
 * Clear all chat history for a user.
 */
const clearHistory = async (userId) => {
    const result = await prisma.sageConversation.deleteMany({ where: { userId } });
    logger.info('SAGE: Chat history cleared', { userId, deleted: result.count });
    return { deleted: result.count };
};

module.exports = { chat, translateText, getHistory, recordFeedback, getSuggestions, clearHistory };

export default {
    async fetch(request, env) {
        const BOT_TOKEN = '8404735583:AAHEPh9l_nsQ-hxlMhhTaj-8JnVKe-3jMo8';
        const url = new URL(request.url);

        if (url.pathname === '/webhook' && request.method === 'POST') {
            const body = await request.json();
            if (body.callback_query) {
                const data = body.callback_query.data;
                const chatId = body.callback_query.message.chat.id;
                let replyText = '';
                if (data === 'auto_on') replyText = '✅ Auto Capture ENABLED';
                else if (data === 'auto_off') replyText = '⏹️ Auto Capture DISABLED';
                else if (data === 'capture_now') replyText = '📸 Screenshot captured!';
                await sendMessage(chatId, replyText, BOT_TOKEN);
                await answerCallback(body.callback_query.id, '✅ Done!', BOT_TOKEN);
            }
            return new Response('OK', { status: 200 });
        }

        if (url.pathname === '/') {
            return new Response('✅ ScreenReader Bot is running!');
        }

        if (url.pathname === '/setwebhook') {
            const webhookUrl = `https://${url.hostname}/webhook`;
            const setWebhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webhookUrl}`;
            const response = await fetch(setWebhookUrl);
            const result = await response.json();
            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Not found', { status: 404 });
    }
};

async function sendMessage(chatId, text, token) {
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
    await fetch(url);
}

async function answerCallback(callbackId, text, token) {
    const url = `https://api.telegram.org/bot${token}/answerCallbackQuery?callback_query_id=${callbackId}&text=${encodeURIComponent(text)}`;
    await fetch(url);
}

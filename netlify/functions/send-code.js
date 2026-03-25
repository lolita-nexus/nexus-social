const { Resend } = require('resend');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }
    
    try {
        const { email, code } = JSON.parse(event.body);
        
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
            from: 'Nexus <onboarding@resend.dev>',
            to: [email],
            subject: 'Код подтверждения Nexus',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 48px;">✨</span>
                        <h1 style="color: #8b5cf6; margin: 0;">NEXUS</h1>
                    </div>
                    <h2>Добро пожаловать!</h2>
                    <p>Ваш код подтверждения:</p>
                    <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
                        ${code}
                    </div>
                    <p style="margin-top: 20px;">Введите этот код на сайте для завершения регистрации.</p>
                    <hr>
                    <small style="color: #888;">Nexus — ваша социальная сеть</small>
                </div>
            `
        });
        
        if (error) {
            console.error('Resend error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: error.message })
            };
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Код отправлен' })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
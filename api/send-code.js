module.exports = async (req, res) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (req.method === 'OPTIONS') {
        return res.status(204).set(headers).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).set(headers).json({ error: 'Method not allowed' });
    }
    
    try {
        const { email, code } = req.body;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        
        if (!RESEND_API_KEY) {
            return res.status(500).set(headers).json({ error: 'Missing API key' });
        }
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Nexus <noreply@nexusssocial.online>',
                to: [email],
                subject: 'Код подтверждения Nexus',
                html: `<h1>Код: ${code}</h1><p>Введите его на сайте Nexus</p>`
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Resend error:', error);
            return res.status(500).set(headers).json({ error: 'Resend API error' });
        }
        
        return res.status(200).set(headers).json({ success: true });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).set(headers).json({ error: error.message });
    }
};

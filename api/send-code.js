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
        
        if (!response.ok) throw new Error('Resend error');
        
        return res.status(200).set(headers).json({ success: true });
        
    } catch (error) {
        return res.status(500).set(headers).json({ error: error.message });
    }
};

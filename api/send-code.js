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
        
        // Просто логируем и возвращаем успех (без отправки письма)
        console.log(`[TEST] Код для ${email}: ${code}`);
        
        return res.status(200).set(headers).json({ 
            success: true, 
            testMode: true,
            code: code 
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).set(headers).json({ error: error.message });
    }
};

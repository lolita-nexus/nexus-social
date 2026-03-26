module.exports = async (req, res) => {
    // Разрешаем CORS
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
        
        // Логируем для проверки
        console.log('Received:', { email, code });
        
        // Возвращаем успех (письмо не отправляем)
        return res.status(200).set(headers).json({ 
            success: true, 
            message: 'Test mode: code would be sent to ' + email,
            code: code
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).set(headers).json({ error: error.message });
    }
};

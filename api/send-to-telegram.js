export default async function handler(req, res) {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Метод не разрешен' });
    }
    
    const data = req.body;
    
    if (!data) {
        return res.status(400).json({ success: false, error: 'Нет данных' });
    }
    
    // Ваши данные Telegram
    const BOT_TOKEN = "8716919048:AAFbHDZI2EmhN1sWAxd6fs9QVXsUMrXqitE";
    const CHAT_ID = "8420827188";
    
    // Формируем сообщение
    const session = data.sessionType || 'консультации';
    const intensity = data.emotionIntensity || 5;
    const physical = data.physicalState || 5;
    const feelings = Array.isArray(data.feelings) ? data.feelings.join(', ') : 'не указаны';
    const notes = data.notes?.trim() || '—';
    const timestamp = data.timestamp || new Date().toLocaleString('ru-RU');
    const recordId = Math.floor(Date.now() / 1000).toString().slice(-6);
    
    // Функции
    const getMoodEmoji = (i) => {
        if (i <= 2) return "😔🌧️";
        if (i <= 4) return "😐🌥️";
        if (i <= 7) return "🙂☀️";
        return "😊🌈✨";
    };
    
    const getMoodDesc = (i) => {
        if (i <= 2) return "состояние нуждается в поддержке";
        if (i <= 4) return "нейтрально-сниженный фон";
        if (i <= 7) return "умеренно позитивный настрой";
        return "высокий эмоциональный ресурс";
    };
    
    const moodEmoji = getMoodEmoji(intensity);
    const moodDesc = getMoodDesc(intensity);
    const isAfter = session === "После консультации";
    const notesLabel = isAfter ? "💡 Инсайты после консультации:" : "🎯 Ожидания и заметки:";
    
    const message = `📊 *Новая запись в дневнике эмоций* #${recordId}

🕐 *Время:* ${timestamp}
📋 *Тип:* ${session}

😊 *Эмоциональное состояние:* ${intensity}/10 ${moodEmoji}
📝 *Описание:* ${moodDesc}

💭 *Преобладающие эмоции:* ${feelings}

🧘 *Физическое самочувствие:* ${physical}/10

${notesLabel} 
${notes}

---
_Отправлено автоматически через Дневник эмоций_`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('Telegram API error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

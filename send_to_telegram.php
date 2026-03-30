<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Ваши данные Telegram
$botToken = "8716919048:AAFbHDZI2EmhN1sWAxd6fs9QVXsUMrXqitE";
$chatId = "8420827188";

// Получаем данные из POST запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Нет данных']);
    exit;
}

// Формируем сообщение
$session = $input['sessionType'] ?? 'консультации';
$intensity = $input['emotionIntensity'] ?? 5;
$physical = $input['physicalState'] ?? 5;
$feelings = is_array($input['feelings']) ? implode(', ', $input['feelings']) : 'не указаны';
$notes = trim($input['notes'] ?? '—');
$timestamp = $input['timestamp'] ?? date('d.m.Y H:i:s');
$recordId = substr(time(), -6);

// Функция для эмодзи
function getMoodEmoji($intensity) {
    if ($intensity <= 2) return "😔🌧️";
    if ($intensity <= 4) return "😐🌥️";
    if ($intensity <= 7) return "🙂☀️";
    return "😊🌈✨";
}

function getMoodDesc($intensity) {
    if ($intensity <= 2) return "состояние нуждается в поддержке";
    if ($intensity <= 4) return "нейтрально-сниженный фон";
    if ($intensity <= 7) return "умеренно позитивный настрой";
    return "высокий эмоциональный ресурс";
}

$moodEmoji = getMoodEmoji($intensity);
$moodDesc = getMoodDesc($intensity);
$isAfter = $session === "После консультации";
$notesLabel = $isAfter ? "💡 Инсайты после консультации:" : "🎯 Ожидания и заметки:";

$message = "📊 *Новая запись в дневнике эмоций* #{$recordId}

🕐 *Время:* {$timestamp}
📋 *Тип:* {$session}

😊 *Эмоциональное состояние:* {$intensity}/10 {$moodEmoji}
📝 *Описание:* {$moodDesc}

💭 *Преобладающие эмоции:* {$feelings}

🧘 *Физическое самочувствие:* {$physical}/10

{$notesLabel} 
{$notes}

---
_Отправлено автоматически через Дневник эмоций_";

// Отправляем в Telegram
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$data = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === false) {
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки в Telegram']);
    exit;
}

$response = json_decode($result, true);

if ($response && $response['ok']) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $response['description'] ?? 'Неизвестная ошибка']);
}

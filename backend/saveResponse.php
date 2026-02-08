<?php
/* ═══════════════════════════════════════════════════
   💖 VALENTINE WEEK — PHP Backend (Alternative)
   Save responses, track NO attempts, send notifications
   ═══════════════════════════════════════════════════ */

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Data file path
$dataFile = __DIR__ . '/data.json';

// Initialize data file
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        'responses' => [],
        'noAttempts' => [],
        'pageVisits' => [],
        'notifications' => []
    ], JSON_PRETTY_PRINT));
}

// Read data
function readData() {
    global $dataFile;
    $raw = file_get_contents($dataFile);
    return json_decode($raw, true) ?: [
        'responses' => [],
        'noAttempts' => [],
        'pageVisits' => [],
        'notifications' => []
    ];
}

// Write data
function writeData($data) {
    global $dataFile;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
}

// Log notification
function logNotification($type, $message, $details) {
    $data = readData();
    $notification = [
        'type' => $type,
        'message' => $message,
        'details' => $details,
        'timestamp' => date('c')
    ];
    $data['notifications'][] = $notification;
    writeData($data);

    // Also log to file
    $logFile = __DIR__ . '/notifications.log';
    $logLine = "[" . date('c') . "] [$type] $message | " . json_encode($details) . "\n";
    file_put_contents($logFile, $logLine, FILE_APPEND);
}

// Get request body
$body = json_decode(file_get_contents('php://input'), true) ?: [];

// Simple routing based on query parameter
$action = $_GET['action'] ?? '';

switch ($action) {
    // Save YES response
    case 'response':
        $entry = [
            'id' => time(),
            'name' => $body['name'] ?? 'Aditi',
            'day' => $body['day'] ?? 'proposal',
            'response' => $body['response'] ?? 'YES',
            'noAttempts' => $body['noAttempts'] ?? 0,
            'timestamp' => $body['timestamp'] ?? date('c')
        ];

        $data = readData();
        $data['responses'][] = $entry;
        writeData($data);

        if ($body['response'] === 'YES') {
            logNotification('YES_RESPONSE',
                'Aditi clicked YES! She said YES to being your Valentine!',
                ['noAttempts' => $body['noAttempts'] ?? 0]
            );
        }

        echo json_encode(['success' => true, 'message' => 'Response saved!', 'data' => $entry]);
        break;

    // Track NO attempt
    case 'no-attempt':
        $attempt = [
            'id' => time(),
            'name' => $body['name'] ?? 'Aditi',
            'attemptNumber' => $body['attemptNumber'] ?? 1,
            'timestamp' => $body['timestamp'] ?? date('c')
        ];

        $data = readData();
        $data['noAttempts'][] = $attempt;
        writeData($data);

        logNotification('NO_ATTEMPT',
            "Aditi tried to click NO (attempt #" . ($body['attemptNumber'] ?? 1) . ")!",
            ['attemptNumber' => $body['attemptNumber'] ?? 1]
        );

        echo json_encode(['success' => true, 'totalAttempts' => count($data['noAttempts'])]);
        break;

    // Track page visit
    case 'page-visit':
        $visit = [
            'id' => time(),
            'name' => $body['name'] ?? 'Aditi',
            'day' => $body['day'] ?? '',
            'timestamp' => $body['timestamp'] ?? date('c')
        ];

        $data = readData();
        $data['pageVisits'][] = $visit;
        writeData($data);

        logNotification('PAGE_VISIT', "Aditi opened " . ($body['day'] ?? 'a page'), $visit);

        echo json_encode(['success' => true, 'message' => 'Visit tracked!']);
        break;

    // Get stats
    case 'stats':
        $data = readData();
        echo json_encode([
            'success' => true,
            'stats' => [
                'totalResponses' => count($data['responses']),
                'totalNoAttempts' => count($data['noAttempts']),
                'totalPageVisits' => count($data['pageVisits']),
                'totalNotifications' => count($data['notifications']),
                'recentNotifications' => array_slice(array_reverse($data['notifications']), 0, 10)
            ]
        ]);
        break;

    // Get notifications
    case 'notifications':
        $data = readData();
        echo json_encode([
            'success' => true,
            'count' => count($data['notifications']),
            'notifications' => array_reverse($data['notifications'])
        ]);
        break;

    default:
        echo json_encode(['error' => 'Unknown action. Use: response, no-attempt, page-visit, stats, notifications']);
        break;
}
?>

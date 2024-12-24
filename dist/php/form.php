<?php
// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Iniciar log de erros específico para o formulário
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/form_errors.log');

// Start session for CSRF and rate-limiting
session_start();

// Security headers
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('X-Content-Type-Options: nosniff');
header('Content-Type: application/json');

// CORS policy
header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://') . $_SERVER['HTTP_HOST']);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Email configuration
const EMAIL_CONFIG = [
    'recipients' => [
        'joao.goulart@tratamentes.pt' => 'João Goulart',
        'zendomus@gmail.com' => 'Administração'
    ],
    'from' => 'noreply@tratamentes.pt'
];

// Function to log errors
function logFormError($message, $context = []) {
    $logMessage = date('[Y-m-d H:i:s] ') . $message . "\n";
    if (!empty($context)) {
        $logMessage .= "Context: " . json_encode($context) . "\n";
    }
    error_log($logMessage, 3, __DIR__ . '/form_errors.log');
}

// Function to sanitize input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

// Function to validate form fields
function validateForm($data) {
    $errors = [];
    
    if (empty($data['name']) || strlen($data['name']) > 100) {
        $errors[] = 'O nome é obrigatório e deve ter no máximo 100 caracteres.';
    }
    
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL) || strlen($data['email']) > 100) {
        $errors[] = 'Um email válido é obrigatório.';
    }
    
    if (empty($data['phone']) || strlen($data['phone']) > 15) {
        $errors[] = 'O número de telemóvel é obrigatório e deve ter no máximo 15 dígitos.';
    }
    
    if (empty($data['message']) || strlen($data['message']) > 3000) {
        $errors[] = 'A mensagem é obrigatória e deve ter no máximo 3000 caracteres.';
    }
    
    return $errors;
}

// Rate-limiting check
if (isset($_SESSION['last_submission_time'])) {
    $time_elapsed = time() - $_SESSION['last_submission_time'];
    if ($time_elapsed < 60) { // 60 seconds cooldown
        logFormError('Rate limit exceeded', ['IP' => $_SERVER['REMOTE_ADDR']]);
        http_response_code(429);
        echo json_encode(['error' => 'Por favor, aguarde um minuto antes de enviar novamente.']);
        exit;
    }
}

// Process POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF validation
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        logFormError('Invalid CSRF token', ['IP' => $_SERVER['REMOTE_ADDR']]);
        http_response_code(400);
        echo json_encode(['error' => 'Token de segurança inválido. Por favor, recarregue a página.']);
        exit;
    }

    // Sanitize and validate form data
    $formData = [
        'name' => sanitizeInput($_POST['name']),
        'email' => sanitizeInput($_POST['email']),
        'phone' => sanitizeInput($_POST['phone']),
        'message' => sanitizeInput($_POST['message'])
    ];

    $errors = validateForm($formData);

    if (!empty($errors)) {
        logFormError('Form validation failed', ['errors' => $errors, 'data' => $formData]);
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit;
    }

    // Prepare email content
    $email_subject = "Nova Mensagem de Contato - Tratamentes";
    $email_body = "Nova mensagem recebida:\n\n" .
        "Nome: {$formData['name']}\n" .
        "Email: {$formData['email']}\n" .
        "Telefone: {$formData['phone']}\n" .
        "Mensagem:\n{$formData['message']}";

    $headers = [
        "From: " . EMAIL_CONFIG['from'],
        "Reply-To: {$formData['email']}",
        "X-Mailer: PHP/" . phpversion(),
        "Content-Type: text/plain; charset=UTF-8"
    ];

    // Send email to all recipients
    $email_sent = false;
    foreach (EMAIL_CONFIG['recipients'] as $email => $name) {
        if (mail($email, $email_subject, $email_body, implode("\r\n", $headers))) {
            $email_sent = true;
        } else {
            logFormError("Failed to send email to $email", ['formData' => $formData]);
        }
    }

    if ($email_sent) {
        $_SESSION['last_submission_time'] = time();
        echo json_encode(['success' => 'Mensagem enviada com sucesso!']);
    } else {
        logFormError('All email attempts failed', ['formData' => $formData]);
        http_response_code(500);
        echo json_encode(['error' => 'Não foi possível enviar a mensagem. Por favor, tente novamente mais tarde.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
}
?>
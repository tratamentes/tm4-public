<?php
// Verificar se existe alguma saída anterior
if (headers_sent($filename, $linenum)) {
    error_log("Headers already sent in $filename on line $linenum");
    http_response_code(500);
    exit('Internal Server Error');
}

// Iniciar a sessão se ainda não foi iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Gerar novo token CSRF se não existir
if (empty($_SESSION['csrf_token'])) {
    try {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    } catch (Exception $e) {
        error_log("Failed to generate CSRF token: " . $e->getMessage());
        http_response_code(500);
        exit('Internal Server Error');
    }
}

// Definir headers de segurança
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Enviar o token
echo json_encode(['csrf_token' => $_SESSION['csrf_token']]);
?>
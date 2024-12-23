// Suggested adjustments for form.js (to be included in home.html)

// 1. Add loading state handling
const form = document.getElementById('form01');
const submitButton = form.querySelector('button[type="submit"]');

async function handleFormSubmission(event) {
  event.preventDefault();
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  const feedback = document.getElementById('form-feedback');
  submitButton.disabled = true;
  feedback.classList.remove('hidden', 'text-red-500', 'text-green-500');
  feedback.classList.add('text-neutral-500');
  feedback.textContent = 'A enviar...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      feedback.textContent = 'Mensagem enviada com sucesso!';
      feedback.classList.remove('text-neutral-500');
      feedback.classList.add('text-green-500');
      form.reset();
    } else {
      throw new Error(result.error || 'Erro ao enviar mensagem');
    }
  } catch (error) {
    feedback.textContent = error.message;
    feedback.classList.remove('text-neutral-500');
    feedback.classList.add('text-red-500');
  } finally {
    submitButton.disabled = false;
  }
}

function validateForm() {
  const feedback = document.getElementById('form-feedback');
  const errors = [];
  
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  if (!name || name.length > 100) {
    errors.push('O nome é obrigatório e deve ter no máximo 100 caracteres.');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Por favor, insira um email válido.');
  }
  
  if (!phone || phone.length > 15) {
    errors.push('O número de telemóvel é obrigatório e deve ter no máximo 15 dígitos.');
  }
  
  if (!message || message.length > 3000) {
    errors.push('A mensagem é obrigatória e deve ter no máximo 3000 caracteres.');
  }

  if (errors.length > 0) {
    feedback.innerHTML = errors.join('<br>');
    feedback.classList.remove('hidden', 'text-neutral-500', 'text-green-500');
    feedback.classList.add('text-red-500');
    return false;
  }

  feedback.classList.add('hidden');
  return true;
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', () => {
  // Fetch CSRF token only when form is about to be used
  form.addEventListener('focusin', async () => {
    if (!document.getElementById('csrf_token').value) {
      try {
        const response = await fetch('get_csrf_token.php');
        const data = await response.json();
        document.getElementById('csrf_token').value = data.csrf_token;
      } catch (error) {
        console.error('Erro ao obter o token CSRF:', error);
      }
    }
  }, { once: true });

  form.addEventListener('submit', handleFormSubmission);
});

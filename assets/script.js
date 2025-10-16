document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');
    const submitButton = document.getElementById('submitButton');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const formFeedback = document.getElementById('form-feedback');

    const passwordRequirements = {
        length: document.getElementById('length'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };

    // --- UTILITY FUNCTIONS ---
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        input.classList.remove('success');
        input.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
    };

    const showSuccess = (input) => {
        const formGroup = input.parentElement;
        input.classList.remove('error');
        input.classList.add('success');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = '';
    };

    const updatePasswordRequirement = (requirement, isValid) => {
        requirement.classList.remove(isValid ? 'invalid' : 'valid');
        requirement.classList.add(isValid ? 'valid' : 'invalid');
    };
    
    // --- VALIDATION LOGIC ---
    const validateFullName = () => {
        const value = fullNameInput.value.trim();
        if (value === '') {
            showError(fullNameInput, 'O nome completo é obrigatório.');
            return false;
        }
        showSuccess(fullNameInput);
        return true;
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
            showError(emailInput, 'O email é obrigatório.');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailInput, 'O formato do email parece inválido.');
            return false;
        }
        showSuccess(emailInput);
        return true;
    };

    const validatePassword = () => {
        const value = passwordInput.value;
        const hasLength = value.length >= 8;
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        updatePasswordRequirement(passwordRequirements.length, hasLength);
        updatePasswordRequirement(passwordRequirements.number, hasNumber);
        updatePasswordRequirement(passwordRequirements.special, hasSpecial);
        
        if (!hasLength || !hasNumber || !hasSpecial) {
             showError(passwordInput, 'A senha não atende aos requisitos.');
             return false;
        }
        showSuccess(passwordInput);
        return true;
    };

    const validateConfirmPassword = () => {
        const passwordValue = passwordInput.value;
        const confirmValue = confirmPasswordInput.value;
        if (confirmValue === '') {
            showError(confirmPasswordInput, 'A confirmação de senha é obrigatória.');
            return false;
        } else if (passwordValue !== confirmValue) {
            showError(confirmPasswordInput, 'As senhas não coincidem.');
            return false;
        }
        showSuccess(confirmPasswordInput);
        return true;
    };
    
    const validateTerms = () => {
        if (!termsInput.checked) {
            const errorMessage = termsInput.parentElement.querySelector('.error-message');
            errorMessage.textContent = 'Você deve aceitar os termos.';
            return false;
        }
        const errorMessage = termsInput.parentElement.querySelector('.error-message');
        errorMessage.textContent = '';
        return true;
    };

    const validateForm = () => {
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const areTermsAccepted = validateTerms();
        
        const isFormValid = isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && areTermsAccepted;
        submitButton.disabled = !isFormValid;
        return isFormValid;
    };

    // --- EVENT LISTENERS ---
    form.addEventListener('input', validateForm);
    
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePasswordButton.textContent = type === 'password' ? '👁' : '🙈';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            formFeedback.textContent = 'Por favor, corrija os erros no formulário.';
            formFeedback.className = 'error';
            return;
        }

        // --- Heurística 1: Visibilidade do status do sistema ---
        const buttonText = submitButton.querySelector('.button-text');
        const spinner = submitButton.querySelector('.spinner');

        buttonText.textContent = 'Enviando...';
        spinner.style.display = 'block';
        submitButton.disabled = true;
        
        // Simular uma chamada de API
        setTimeout(() => {
            // Simular sucesso
            const isSuccess = true; // Mude para 'false' para testar o erro

            if (isSuccess) {
                form.style.display = 'none'; // Esconde o formulário
                document.querySelector('.login-link').style.display = 'none';
            formFeedback.textContent = `Cadastro realizado com sucesso! Um email de confirmação foi enviado para ${emailInput.value}.`;
                formFeedback.className = 'success';
            } else {
                // Simular erro do servidor
                formFeedback.textContent = 'Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.';
                formFeedback.className = 'error';
                buttonText.textContent = 'Cadastrar';
                spinner.style.display = 'none';
                submitButton.disabled = false; // Reabilita o botão em caso de erro
            }

        }, 2000); // 2 segundos de delay
    });
});
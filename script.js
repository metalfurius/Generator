document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM para Usuario
    const usernameOutput = document.getElementById('usernameOutput');
    const generateUsernameBtn = document.getElementById('generateUsernameBtn');
    const copyUsernameBtn = document.getElementById('copyUsernameBtn');

    // Elementos del DOM para Contraseña
    const passwordOutput = document.getElementById('passwordOutput');
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const copyPasswordBtn = document.getElementById('copyPasswordBtn');

    // Toast notification
    const toast = document.getElementById('toast');

    // Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- Lógica para generar Nombres de Usuario ---
    const adjectives = [
        "Agil", "Audaz", "Brillante", "Calmado", "Creativo", "Dinamico", "Eficaz", "Fuerte", "Genial",
        "Habil", "Innovador", "Jovial", "Leal", "Magico", "Noble", "Optimo", "Poderoso", "Rapido",
        "Sabio", "Tenaz", "Unico", "Veloz", "Valiente", "Zen"
    ];
    const nouns = [
        "Aguila", "Bosque", "Cometa", "Dragon", "Estrella", "Fenix", "Glaciar", "Horizonte", "Isla",
        "Jungla", "Kaiju", "Lobo", "Montana", "Nebula", "Oceano", "Planeta", "Quasar", "Rio",
        "Sol", "Tundra", "Universo", "Volcan", "Wendigo", "Xenon", "Yeti", "Zephyr"
    ];

    function generateUsername() {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 900) + 100; // Número de 3 dígitos
        return `${adj}${noun}${num}`;
    }

    generateUsernameBtn.addEventListener('click', () => {
        usernameOutput.value = generateUsername();
    });

    // --- Lógica para generar Contraseñas ---
    const charSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:',.<>/?`~"
    };

    function generatePassword() {
        const length = parseInt(lengthInput.value);
        let characterPool = "";
        let generatedPassword = "";

        if (uppercaseCheckbox.checked) characterPool += charSets.uppercase;
        if (lowercaseCheckbox.checked) characterPool += charSets.lowercase;
        if (numbersCheckbox.checked) characterPool += charSets.numbers;
        if (symbolsCheckbox.checked) characterPool += charSets.symbols;

        if (characterPool === "") {
            alert("Por favor, selecciona al menos un tipo de caracter para la contraseña.");
            return "";
        }

        // Asegurar al menos un caracter de cada tipo seleccionado si es posible
        let guaranteedChars = "";
        if (uppercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.uppercase);
        if (lowercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.lowercase);
        if (numbersCheckbox.checked) guaranteedChars += getRandomChar(charSets.numbers);
        if (symbolsCheckbox.checked) guaranteedChars += getRandomChar(charSets.symbols);
        
        // Si la longitud es menor que los caracteres garantizados, ajusta
        if (length < guaranteedChars.length) {
            // Esto es un caso borde, si el usuario pide longitud muy corta y muchos tipos.
            // Podrías alertar o simplemente usar los garantizados y truncar/ajustar.
            // Por ahora, usamos solo los caracteres garantizados y los mezclamos.
             generatedPassword = shuffleString(guaranteedChars.substring(0, length));
        } else {
            generatedPassword = guaranteedChars;
            for (let i = guaranteedChars.length; i < length; i++) {
                generatedPassword += getRandomChar(characterPool);
            }
            generatedPassword = shuffleString(generatedPassword);
        }
        
        return generatedPassword;
    }

    function getRandomChar(str) {
        return str[Math.floor(Math.random() * str.length)];
    }

    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        }
        return arr.join('');
    }

    generatePasswordBtn.addEventListener('click', () => {
        const pass = generatePassword();
        if (pass) passwordOutput.value = pass;
    });


    // --- Lógica para Copiar al Portapapeles ---
    function copyToClipboard(text, btnElement) {
        if (!text) return; // No copiar si no hay texto

        navigator.clipboard.writeText(text).then(() => {
            showToast();
            // Opcional: Cambiar el texto del botón temporalmente
            const originalIcon = btnElement.innerHTML;
            btnElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="green" class="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>`;
            setTimeout(() => {
                btnElement.innerHTML = originalIcon;
            }, 1500);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert('No se pudo copiar al portapapeles.');
        });
    }

    copyUsernameBtn.addEventListener('click', () => {
        copyToClipboard(usernameOutput.value, copyUsernameBtn);
    });

    copyPasswordBtn.addEventListener('click', () => {
        copyToClipboard(passwordOutput.value, copyPasswordBtn);
    });
    
    function showToast() {
        toast.className = "toast show";
        setTimeout(() => {
            toast.className = toast.className.replace("show", "");
        }, 2500); // La notificación desaparece después de 2.5 segundos (0.5s fade out)
    }

    // Generar un usuario y contraseña al cargar la página
    usernameOutput.value = generateUsername();
    passwordOutput.value = generatePassword();
});
(function (root, factory) {
    const api = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    } else {
        root.PasswordGenerator = api;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    "use strict";

    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 128;
    const UINT32_RANGE = 0x100000000;
    const CHARACTER_SETS = Object.freeze({
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:',.<>/?`~"
    });
    const CHARACTER_SET_NAMES = Object.freeze(Object.keys(CHARACTER_SETS));
    const LENGTH_ERROR_MESSAGE = "Password length must be a whole number between 8 and 128 characters.";

    class PasswordGenerationError extends Error {
        constructor(message, code, cause) {
            super(message);
            this.name = "PasswordGenerationError";
            this.code = code;
            if (cause !== undefined) this.cause = cause;
        }
    }

    function validatePasswordLength(value) {
        if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
            return { valid: false, code: "empty", message: LENGTH_ERROR_MESSAGE };
        }

        let length;
        try {
            length = typeof value === "number" ? value : Number(value);
        } catch (error) {
            return { valid: false, code: "not-finite", message: LENGTH_ERROR_MESSAGE };
        }

        if (!Number.isFinite(length)) {
            return { valid: false, code: "not-finite", message: LENGTH_ERROR_MESSAGE };
        }
        if (!Number.isInteger(length)) {
            return { valid: false, code: "not-integer", message: LENGTH_ERROR_MESSAGE };
        }
        if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
            return { valid: false, code: "out-of-range", message: LENGTH_ERROR_MESSAGE };
        }

        return { valid: true, length };
    }

    function createWebCryptoRandomSource(cryptoObject) {
        const source = cryptoObject === undefined
            ? (typeof globalThis !== "undefined" ? globalThis.crypto : undefined)
            : cryptoObject;

        if (!source || typeof source.getRandomValues !== "function") {
            throw new PasswordGenerationError(
                "Secure random number generation is unavailable in this browser.",
                "crypto-unavailable"
            );
        }

        return {
            getRandomValues(array) {
                try {
                    source.getRandomValues(array);
                    return array;
                } catch (error) {
                    throw new PasswordGenerationError(
                        "Secure random number generation failed. Please try again.",
                        "crypto-failure",
                        error
                    );
                }
            }
        };
    }

    function readRandomUint32(randomSource) {
        const values = new Uint32Array(1);

        try {
            randomSource.getRandomValues(values);
        } catch (error) {
            if (error instanceof PasswordGenerationError) throw error;
            throw new PasswordGenerationError(
                "Secure random number generation failed. Please try again.",
                "crypto-failure",
                error
            );
        }

        return values[0];
    }

    function randomIndex(maxExclusive, randomSource) {
        if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
            throw new RangeError("Random index bound must be a positive 32-bit integer.");
        }

        const rejectionLimit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
        let value;
        do {
            value = readRandomUint32(randomSource);
        } while (value >= rejectionLimit);

        return value % maxExclusive;
    }

    function getRandomCharacter(characterSet, randomSource) {
        if (!characterSet) return "";
        return characterSet[randomIndex(characterSet.length, randomSource)];
    }

    function shuffleCharacters(characters, randomSource) {
        const shuffled = characters.slice();

        for (let index = shuffled.length - 1; index > 0; index -= 1) {
            const swapIndex = randomIndex(index + 1, randomSource);
            [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
        }

        return shuffled;
    }

    function getSelectedCharacterSets(selection) {
        const selectedNames = CHARACTER_SET_NAMES.filter((name) => selection && selection[name]);

        if (selectedNames.length === 0) {
            throw new PasswordGenerationError(
                "Select at least one character type.",
                "no-character-types"
            );
        }

        return selectedNames.map((name) => ({ name, characters: CHARACTER_SETS[name] }));
    }

    function generatePassword(value, selection, randomSource) {
        const validation = validatePasswordLength(value);
        if (!validation.valid) {
            throw new PasswordGenerationError(validation.message, `invalid-length-${validation.code}`);
        }

        const source = randomSource || createWebCryptoRandomSource();
        const selectedSets = getSelectedCharacterSets(selection);
        const characterPool = selectedSets.map((set) => set.characters).join("");
        const characters = selectedSets.map((set) => getRandomCharacter(set.characters, source));

        while (characters.length < validation.length) {
            characters.push(getRandomCharacter(characterPool, source));
        }

        return shuffleCharacters(characters, source).join("");
    }

    return Object.freeze({
        CHARACTER_SETS,
        MAX_PASSWORD_LENGTH,
        MIN_PASSWORD_LENGTH,
        PasswordGenerationError,
        createWebCryptoRandomSource,
        generatePassword,
        getRandomCharacter,
        randomIndex,
        shuffleCharacters,
        validatePasswordLength
    });
}));

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const {
    CHARACTER_SETS,
    PasswordGenerationError,
    createWebCryptoRandomSource,
    generatePassword,
    randomIndex,
    validatePasswordLength
} = require('../password-generator.js');

const ALL_TYPES = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
};

class DeterministicRandomSource {
    constructor(values = []) {
        this.values = [...values];
    }

    getRandomValues(array) {
        for (let index = 0; index < array.length; index += 1) {
            array[index] = this.values.length > 0 ? this.values.shift() >>> 0 : 0;
        }
        return array;
    }
}

function selectedTypes(selection) {
    return Object.keys(selection).filter((name) => selection[name]);
}

test('validates password lengths without coercing invalid UI input into another length', () => {
    assert.deepEqual(validatePasswordLength(8), { valid: true, length: 8 });
    assert.deepEqual(validatePasswordLength(128), { valid: true, length: 128 });
    assert.equal(validatePasswordLength('').code, 'empty');
    assert.equal(validatePasswordLength('   ').code, 'empty');
    assert.equal(validatePasswordLength(NaN).code, 'not-finite');
    assert.equal(validatePasswordLength(Infinity).code, 'not-finite');
    assert.equal(validatePasswordLength(Symbol('invalid')).code, 'not-finite');
    assert.equal(validatePasswordLength(8.5).code, 'not-integer');
    assert.equal(validatePasswordLength(7).code, 'out-of-range');
    assert.equal(validatePasswordLength(129).code, 'out-of-range');
});

test('rejects invalid lengths with deterministic error codes', () => {
    for (const [value, code] of [['', 'invalid-length-empty'], [NaN, 'invalid-length-not-finite'], [129, 'invalid-length-out-of-range']]) {
        assert.throws(
            () => generatePassword(value, ALL_TYPES, new DeterministicRandomSource()),
            (error) => error instanceof PasswordGenerationError && error.code === code
        );
    }
});

test('uses rejection sampling instead of modulo bias', () => {
    const source = new DeterministicRandomSource([0xffffffff, 9]);
    assert.equal(randomIndex(10, source), 9);
    assert.throws(() => randomIndex(0, source), RangeError);
});

test('exports the same API for a browser global', () => {
    const source = fs.readFileSync(path.join(__dirname, '..', 'password-generator.js'), 'utf8');
    const browser = {};
    vm.runInNewContext(source, browser);
    assert.equal(typeof browser.PasswordGenerator.generatePassword, 'function');
});

test('generates exact boundary lengths and guarantees every selected type', () => {
    for (const length of [8, 128]) {
        const password = generatePassword(length, ALL_TYPES, new DeterministicRandomSource());
        assert.equal(password.length, length);
        assert.ok([...password].every((character) => Object.values(CHARACTER_SETS).join('').includes(character)));
        for (const type of selectedTypes(ALL_TYPES)) {
            assert.ok([...password].some((character) => CHARACTER_SETS[type].includes(character)), `missing ${type}`);
        }
    }
});

test('supports every non-empty character-type combination', () => {
    const typeNames = Object.keys(CHARACTER_SETS);

    for (let mask = 1; mask < 2 ** typeNames.length; mask += 1) {
        const selection = Object.fromEntries(typeNames.map((name, index) => [name, Boolean(mask & (1 << index))]));
        const password = generatePassword(8, selection, new DeterministicRandomSource());
        const pool = selectedTypes(selection).map((name) => CHARACTER_SETS[name]).join('');

        assert.equal(password.length, 8);
        assert.ok([...password].every((character) => pool.includes(character)));
        for (const type of selectedTypes(selection)) {
            assert.ok([...password].some((character) => CHARACTER_SETS[type].includes(character)), `missing ${type}`);
        }
    }
});

test('fails closed when secure randomness is unavailable or fails', () => {
    assert.throws(
        () => createWebCryptoRandomSource({}),
        (error) => error instanceof PasswordGenerationError && error.code === 'crypto-unavailable'
    );

    assert.throws(
        () => generatePassword(16, ALL_TYPES, { getRandomValues() { throw new Error('synthetic failure'); } }),
        (error) => error instanceof PasswordGenerationError && error.code === 'crypto-failure'
    );

    const failingCrypto = createWebCryptoRandomSource({
        getRandomValues() { throw new Error('synthetic Web Crypto failure'); }
    });
    assert.throws(
        () => generatePassword(16, ALL_TYPES, failingCrypto),
        (error) => error instanceof PasswordGenerationError && error.code === 'crypto-failure'
    );
});

test('rejects an empty character selection rather than silently changing policy', () => {
    assert.throws(
        () => generatePassword(16, {}, new DeterministicRandomSource()),
        (error) => error instanceof PasswordGenerationError && error.code === 'no-character-types'
    );
});

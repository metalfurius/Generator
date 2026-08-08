const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('static site includes the password module before the UI controller', () => {
    const html = read('index.html');
    assert.match(html, /<script src="password-generator\.js" defer><\/script>\s*<script src="script\.js" defer><\/script>/);
    assert.match(html, /id="length"[^>]*min="8" max="128"/);
    assert.match(html, /id="passwordError"[^>]*role="alert"/);
});

test('password path has no insecure randomness or silent 64-character cap', () => {
    const moduleSource = read('password-generator.js');
    const controllerSource = read('script.js');
    assert.doesNotMatch(moduleSource, /Math\.random/);
    assert.doesNotMatch(moduleSource, /MAX_PASSWORD_LENGTH\s*=\s*64/);
    assert.doesNotMatch(controllerSource, /MAX_PASSWORD_LENGTH\s*=\s*64/);
    assert.match(moduleSource, /rejectionLimit/);
    assert.match(moduleSource, /getRandomValues/);
});

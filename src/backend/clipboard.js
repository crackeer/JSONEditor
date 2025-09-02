const { clipboard } = require('electron')

export function readText() {
    return clipboard.readText();
}

export function writeText(e, text) {
    clipboard.writeText(text);
}

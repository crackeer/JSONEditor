const { clipboard } = require('electron')

export function readText() {
    return clipboard.readText();
}

export function writeText(e, text) {
    console.log(text)
    clipboard.writeText(text);
}

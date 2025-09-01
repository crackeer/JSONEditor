import fs from 'fs';

export function readFile(e, path) {
    console.log('readFile', path);
    return fs.readFileSync(path, 'utf8');
}

export function writeFile(path, data) {
    fs.writeFileSync(path, data);
}
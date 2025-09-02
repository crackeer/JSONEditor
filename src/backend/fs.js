import fs from 'fs';
import os from 'os';
import path from 'path';
export function readFile(e, path) {
    console.log('readFile', path);
    return fs.readFileSync(path, 'utf8');
}

export function writeFile(e, path, data) {
    fs.writeFileSync(path, data);
}

export function exists(path) {
    return fs.existsSync(path);
}

export function getHistoryPath() {
    const homeDir = os.homedir();
    return path.join(homeDir, '.config', 'json-editor', 'history.json');
}

export function getHistory() {
    const historyPath = getHistoryPath();
    console.log(historyPath)
    if (!fs.existsSync(historyPath)) {
        fs.mkdirSync(path.dirname(historyPath), { recursive: true });
        return [];
    }
    return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

export function addHistory(e, item) {
    let data = getHistory()
    let list = [item, ...data]
    const historyPath = getHistoryPath();
    return fs.writeFileSync(historyPath, JSON.stringify(list));
}

export function getRecentFile() {
    const homeDir = os.homedir();
    return path.join(homeDir, '.config', 'json-editor', 'current.json');
}

export function getRecent() {
    const file = getRecentFile();
    if (!fs.existsSync(file)) {
        return [];
    }
    return  JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function setRecent(e, data) {
    const file = getRecentFile();
    console.log(file)
    if (!fs.existsSync(file)) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    return fs.writeFileSync(file, JSON.stringify(data));
}

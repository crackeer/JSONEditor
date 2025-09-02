import { dialog } from 'electron';
const fs = require('fs');

export async function handleFileSelect() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'JSON', extensions: ['json'] },
        ]
    })
    if (!canceled) {
        return filePaths[0]
    }
}


export async function handleFileOpen(e, filePath) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: filePath,
        filters: [
            { name: 'JSON', extensions: ['json'] },
        ]
    })
    if(canceled) {
        return null
    }
    return fs.readFileSync(filePaths[0], 'utf8');
    
}


export async function handleFileSave() {
    const { canceled, filePath } = await dialog.showSaveDialog({
        filters: [
            { name: 'JSON', extensions: ['json'] },
        ]
    })
    if (!canceled) {
        return filePath
    }
}
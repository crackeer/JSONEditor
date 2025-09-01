const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile:  (title) =>  ipcRenderer.invoke('dialog:openFile'),
    readFile: (path) => ipcRenderer.invoke('fs:readFile', path)
})
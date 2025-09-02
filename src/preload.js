const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile:  () =>  ipcRenderer.invoke('dialog:openFile'),
    readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
    exists: (path) => ipcRenderer.invoke('fs:exists', path),
    writeFile: (path, data) => ipcRenderer.invoke('fs:writeFile', path, data),
    getHistory: () => ipcRenderer.invoke('fs:getHistory'),
    addHistory: (item) => ipcRenderer.invoke('fs:addHistory', item),
    getRecent: () => ipcRenderer.invoke('fs:getRecent'),
    setRecent: (data) => ipcRenderer.invoke('fs:setRecent', data),
})
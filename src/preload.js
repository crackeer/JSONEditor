const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile:  () =>  ipcRenderer.invoke('dialog:openFile'),
    selectFile:  () =>  ipcRenderer.invoke('dialog:selectFile'),
    saveFile:  () =>  ipcRenderer.invoke('dialog:saveFile'),
    readFile: (path) => ipcRenderer.invoke('fs:readFile', path),
    exists: (path) => ipcRenderer.invoke('fs:exists', path),
    writeFile: (path, data) => ipcRenderer.invoke('fs:writeFile', path, data),
    getHistory: () => ipcRenderer.invoke('fs:getHistory'),
    addHistory: (item) => ipcRenderer.invoke('fs:addHistory', item),
    getRecent: () => ipcRenderer.invoke('fs:getRecent'),
    setRecent: (data) => ipcRenderer.invoke('fs:setRecent', data),
    clipboardWriteText: (text) => ipcRenderer.invoke('clipboard:writeText', text),
    clipboardReadText: () => ipcRenderer.invoke('clipboard:readText'),
})
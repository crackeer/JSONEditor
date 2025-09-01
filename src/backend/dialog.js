import {  dialog } from 'electron';


export async function handleFileOpen () {
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
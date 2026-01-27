const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => ipcRenderer.send('window-controls:minimize'),
  maximizeWindow: () => ipcRenderer.send('window-controls:maximize'),
  closeWindow: () => ipcRenderer.send('window-controls:close'),
  isMaximized: () => ipcRenderer.invoke('window-controls:isMaximized'),
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', (event, isMaximized) => {
      callback(isMaximized)
    })
  }
})

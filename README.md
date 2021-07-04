# Car Park Manager

Generic Software to Manage Car Parks. This is in development stages.

## Development Method 1: Traditional Installation

**Clone Repository:**

```bash
git clone https://github.com/ONYXGrenada/CarParkManager.git
```

**Install Dependencies:**

```bash
cd CarParkManager
npm install --save electron
npm install --save mysql
npm install --save jquery
npm install --save popper.js
npm install --save bootstrap
```

**Start Docker Container**

Read docker-MySQL.txt in the docs folder

## Development Method 2: Using Visual Studio Code with Docker Integration

**Prerequisites:**

- [Visual Studio Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)
- [Remote Development Extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
- An X Server (For Windows Only). Recommended X Server [VcXsrv](https://sourceforge.net/projects/vcxsrv/)

**Clone Repository:**

```bash
git clone https://github.com/ONYXGrenada/CarParkManager.git
```

**Visual Studio Code:**

- Launch vscode and open project directory
- Ctrl+Shift+P and type "Open Folder in Container" and hit Return or Enter. (Containers should be built for project)
- Allow X11 Forwarding (Linux Only). In your local linux terminal type (may not be most secure. remove after.):  
  Before:
  ```bash
  xhost +local:
  ```
  After:
  ```bash
  xhost -local:
  ```
- Initialize X Server (For Windows Only). In vscode terminal type (replace "your ip" with your actual ip):
  ```bash
  export DISPLAY={your ip}:0
  ```

## Start Application

```bash
npm start
```

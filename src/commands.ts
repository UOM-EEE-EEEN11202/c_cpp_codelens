import * as vscode from 'vscode';


async function runCode() {
  var taskName:string = 'Run current file';
  await handleTask(taskName);
}

async function compileCode() {
  let ext = vscode.window.activeTextEditor?.document.languageId;
  if (ext == 'cpp') {
    var taskName:string = 'C++: clang++ compile current file';
  } else if (ext == 'c') {
    var taskName:string = 'C: clang compile current file';
  }
  else {
    var taskName:string = 'Error. Language not detected';
  }
  await handleTask(taskName);
}

async function compileAndRunCode() {
  let ext = vscode.window.activeTextEditor?.document.languageId;
  if (ext === 'cpp') {
    var taskName:string = 'C++: clang++ compile and run current file';
  } else if (ext == 'c') {
    var taskName:string = 'C: clang compile and run current file';
  }
  else {
    var taskName:string = 'Error. Language not detected';
  }
  await handleTask(taskName);
}

async function debugCode() {
  var ext = vscode.window.activeTextEditor?.document.languageId;
  if (ext === 'cpp') {
    var taskName:string = 'C++: clang++ compile and debug current file';
  } else if (ext == 'c') {
    var taskName:string = 'C: clang compile and debug current file';
  } else {
    var taskName:string = 'Error. Language not detected';
  }
  await handleDebug(taskName);
}


async function handleDebug(taskName:string) {

  // Start a debug session

  // Get the active workspace folder
  let activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage('No active editor found');
    return;
  }
  let workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder found');
    return;
  }

  // Run task
  try {
    vscode.window.showErrorMessage(taskName);
    vscode.debug.startDebugging(workspaceFolder, taskName);
    return null;
  }
  catch (e) {
    vscode.window.showErrorMessage('Error running the debugger ' + taskName + ' check the launch.json file in the .vscode folder');
    return null;
  }
  
}


async function handleTask(taskName:string) {

  // Get a list of tasks
  var tasks = await vscode.tasks.fetchTasks();
  var task: vscode.Task | undefined = undefined;

  // Search for a task by name
  for (var t of tasks) {
    if (t.name === taskName) {
      task = t;
      break;
    }
  }

  // Check can find task
  if (task === undefined) {
    vscode.window.showErrorMessage('Can\'t find task \"' + taskName + '\" check the tasks.json file in the .vscode folder');
    return;
  }

  // Run task
  try {
    var execution = await vscode.tasks.executeTask(task);
    return null;
  }
  catch (e) {
    vscode.window.showErrorMessage('Error running the task ' + taskName + ' check .vscode folder');
    return null;
  }
  
}

export { runCode, compileCode, compileAndRunCode, debugCode };
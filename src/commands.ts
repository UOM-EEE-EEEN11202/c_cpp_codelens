import * as vscode from "vscode";

export async function runCode(): Promise<void> {
    await handleTask("Run current file");
}

export async function compileCode(): Promise<void> {
    const ext = vscode.window.activeTextEditor?.document.languageId;

    let taskName: string;

    if (ext === "cpp") {
        taskName = "C++: clang++ compile current file";
    } else if (ext === "c") {
        taskName = "C: clang compile current file";
    } else {
        vscode.window.showErrorMessage("Language not detected");
        return;
    }

    await handleTask(taskName);
}

export async function compileAndRunCode(): Promise<void> {
    const ext = vscode.window.activeTextEditor?.document.languageId;

    let taskName: string;

    if (ext === "cpp") {
        taskName = "C++: clang++ compile and run current file";
    } else if (ext === "c") {
        taskName = "C: clang compile and run current file";
    } else {
        vscode.window.showErrorMessage("Language not detected");
        return;
    }

    await handleTask(taskName);
}

export async function debugCode(): Promise<void> {
    const ext = vscode.window.activeTextEditor?.document.languageId;

    let taskName: string;

    if (ext === "cpp") {
        taskName = "C++: clang++ compile and debug current file";
    } else if (ext === "c") {
        taskName = "C: clang compile and debug current file";
    } else {
        vscode.window.showErrorMessage("Language not detected");
        return;
    }

    await handleDebug(taskName);
}

async function handleDebug(taskName: string): Promise<void> {

    const activeEditor = vscode.window.activeTextEditor;

    if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        activeEditor.document.uri
    );

    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder found");
        return;
    }

    try {
        const started = await vscode.debug.startDebugging(
            workspaceFolder,
            taskName
        );

        if (!started) {
            vscode.window.showErrorMessage(
                `Failed to start debugger "${taskName}"`
            );
        }
    } catch (e) {
        vscode.window.showErrorMessage(
            `Error running debugger "${taskName}". Check launch.json in the .vscode folder.`
        );
    }
}

async function handleTask(taskName: string): Promise<void> {

    const tasks = await vscode.tasks.fetchTasks();

    const task = tasks.find(
        t => t.name === taskName
    );

    if (!task) {
        vscode.window.showErrorMessage(
            `Can't find task "${taskName}". Check tasks.json in the .vscode folder.`
        );
        return;
    }

    try {
        await vscode.tasks.executeTask(task);
    } catch (e) {
        vscode.window.showErrorMessage(
            `Error running task "${taskName}". Check the .vscode folder.`
        );
    }
}

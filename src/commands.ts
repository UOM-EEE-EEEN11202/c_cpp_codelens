import * as vscode from "vscode";

type LanguageId = "c" | "cpp";
type CommandAction = "run" | "compile" | "compileAndRun" | "debug";
type CommandMode = "task" | "debug";

interface CommandExecutionDefinition {
    mode: CommandMode;
    taskName?: string;
    taskNameByLanguage?: Record<LanguageId, string>;
}

export interface CodeLensCommandDefinition {
    id: string;
    title: string;
    action: CommandAction;
    handler: () => Promise<void>;
}

const COMMAND_EXECUTION_DEFINITIONS: Record<CommandAction, CommandExecutionDefinition> = {
    run: {
        mode: "task",
        taskName: "Run current file"
    },
    compile: {
        mode: "task",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile current file",
            c: "C: clang compile current file"
        }
    },
    compileAndRun: {
        mode: "task",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile and run current file",
            c: "C: clang compile and run current file"
        }
    },
    debug: {
        mode: "debug",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile and debug current file",
            c: "C: clang compile and debug current file"
        }
    }
};

export const CODELENS_COMMANDS: CodeLensCommandDefinition[] = [
    {
        id: "c-cpp-codelens.compileCode",
        title: "Compile",
        action: "compile",
        handler: compileCode
    },
    {
        id: "c-cpp-codelens.runCode",
        title: "▶ Run",
        action: "run",
        handler: runCode
    },
    {
        id: "c-cpp-codelens.compileAndRunCode",
        title: "Compile and ▶ Run",
        action: "compileAndRun",
        handler: compileAndRunCode
    },
    {
        id: "c-cpp-codelens.debugCode",
        title: "⚙ Debug",
        action: "debug",
        handler: debugCode
    }
];

export async function runCode(): Promise<void> {
    await executeAction("run");
}

export async function compileCode(): Promise<void> {
    await executeAction("compile");
}

export async function compileAndRunCode(): Promise<void> {
    await executeAction("compileAndRun");
}

export async function debugCode(): Promise<void> {
    await executeAction("debug");
}

async function executeAction(action: CommandAction): Promise<void> {

    const definition = COMMAND_EXECUTION_DEFINITIONS[action];
    const taskName = resolveTaskName(definition);

    if (!taskName) {
        return;
    }

    if (definition.mode === "debug") {
        await handleDebug(taskName);
        return;
    }

    await handleTask(taskName);
}

function resolveTaskName(
    definition: CommandExecutionDefinition
): string | undefined {

    if (definition.taskName) {
        return definition.taskName;
    }

    const ext = vscode.window.activeTextEditor?.document.languageId;

    if (ext === "c" || ext === "cpp") {
        return definition.taskNameByLanguage?.[ext];
    }

    vscode.window.showErrorMessage("Language not detected");
    return undefined;
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

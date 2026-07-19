import * as vscode from "vscode";

const COMMAND_CONFIGURATIONS = [
    {
        id: "c-cpp-codelens.compileCode",
        title: "Compile",
        action: "compile",
        mode: "task",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile current file",
            c: "C: clang compile current file"
        }
    },
    {
        id: "c-cpp-codelens.runCode",
        title: "▶ Run",
        action: "run",
        mode: "task",
        taskName: "Run current file"
    },
    {
        id: "c-cpp-codelens.compileAndRunCode",
        title: "Compile and ▶ Run",
        action: "compileAndRun",
        mode: "task",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile and run current file",
            c: "C: clang compile and run current file"
        }
    },
    {
        id: "c-cpp-codelens.debugCode",
        title: "⚙ Debug",
        action: "debug",
        mode: "debug",
        taskNameByLanguage: {
            cpp: "C++: clang++ compile and debug current file",
            c: "C: clang compile and debug current file"
        }
    }
] as const;

type RawCommandConfiguration = (typeof COMMAND_CONFIGURATIONS)[number];
type CommandAction = RawCommandConfiguration["action"];
type CommandMode = RawCommandConfiguration["mode"];
type ConfigWithLanguageMap = Extract<
    RawCommandConfiguration,
    { taskNameByLanguage: unknown }
>;
type LanguageId = keyof NonNullable<
    ConfigWithLanguageMap["taskNameByLanguage"]
>;

export interface CodeLensCommandDefinition {
    id: string;
    title: string;
    action: CommandAction;
    handler: () => Promise<void>;
}

export const SUPPORTED_LANGUAGE_IDS = Array.from(
    new Set(
        COMMAND_CONFIGURATIONS.flatMap(
            config =>
                "taskNameByLanguage" in config
                    ? Object.keys(config.taskNameByLanguage) as LanguageId[]
                    : []
        )
    )
);

export const CODELENS_COMMANDS: CodeLensCommandDefinition[] =
    COMMAND_CONFIGURATIONS.map(config => ({
        id: config.id,
        title: config.title,
        action: config.action,
        handler: () => executeCommandConfiguration(config)
    }));

async function executeCommandConfiguration(
    config: RawCommandConfiguration
): Promise<void> {

    const taskName = resolveTaskName(config);

    if (!taskName) {
        return;
    }

    if (config.mode === "debug") {
        await handleDebug(taskName);
        return;
    }

    await handleTask(taskName);
}

function resolveTaskName(
    config: RawCommandConfiguration
): string | undefined {

    if ("taskName" in config) {
        return config.taskName;
    }

    const ext = vscode.window.activeTextEditor?.document.languageId;

    if (
        ext &&
        "taskNameByLanguage" in config &&
        ext in config.taskNameByLanguage
    ) {
        return config.taskNameByLanguage[ext as LanguageId];
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
        (t: vscode.Task) => t.name === taskName
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

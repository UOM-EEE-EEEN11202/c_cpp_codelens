// The module 'vscode' contains the VS Code extensibility API.
import * as vscode from "vscode";

import MyCodeLensProvider from "./my_codelens_provider";
import {
    CODELENS_COMMANDS,
    SUPPORTED_LANGUAGE_IDS
} from "./commands";

type DocumentSymbolLike = vscode.DocumentSymbol | vscode.SymbolInformation;

// This method is called when your extension is activated.
export function activate(context: vscode.ExtensionContext): void {

    const commandDisposables = CODELENS_COMMANDS.map(cmd =>
        vscode.commands.registerCommand(
            cmd.id,
            cmd.handler
        )
    );

    const selector: vscode.DocumentSelector =
        SUPPORTED_LANGUAGE_IDS.map(language => ({
            language,
            scheme: "file"
        }));

    const codeLensProviderDisposable =
        vscode.languages.registerCodeLensProvider(
            selector,
            new MyCodeLensProvider()
        );

    context.subscriptions.push(
        ...commandDisposables,
        codeLensProviderDisposable
    );
}

// This method is called when your extension is deactivated.
export function deactivate(): void {}

// Helper function to find the main function in a C/C++ file.
export function findMain(
    symbols: DocumentSymbolLike[]
): DocumentSymbolLike | undefined {

    for (const symbol of symbols) {

        if (
            symbol.name === "main" ||
            symbol.name.startsWith("main(")
        ) {
            return symbol;
        }

        const nested = "children" in symbol ? findMain(symbol.children) : undefined;

        if (nested) {
            return nested;
        }
    }

    return undefined;
}

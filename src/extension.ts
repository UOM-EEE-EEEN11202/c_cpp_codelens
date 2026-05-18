// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


import MyCodeLensProvider from "./myCodeLensProvider";
import { runCode, compileCode, compileAndRunCode, debugCode } from "./commands";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let commandDisposable1 = vscode.commands.registerCommand('c-cpp-codelens.runCode', runCode);
	let commandDisposable2 = vscode.commands.registerCommand('c-cpp-codelens.compileCode', compileCode);
	let commandDisposable3 = vscode.commands.registerCommand('c-cpp-codelens.compileAndRunCode', compileAndRunCode);
	let commandDisposable4 = vscode.commands.registerCommand('c-cpp-codelens.debugCode', debugCode);
    

	let docSelector = {
      language: 'cpp',
      scheme: 'file',
    }
	let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
      docSelector,
      new MyCodeLensProvider()
    )

	let docSelector2 = {
      language: 'c',
      scheme: 'file',
    }
	let codeLensProviderDisposable2 = vscode.languages.registerCodeLensProvider(
      docSelector2,
      new MyCodeLensProvider()
    )

    context.subscriptions.push(commandDisposable1);
	context.subscriptions.push(commandDisposable2);
	context.subscriptions.push(commandDisposable3);
	context.subscriptions.push(commandDisposable4);
	context.subscriptions.push(codeLensProviderDisposable);
	context.subscriptions.push(codeLensProviderDisposable2);

}

// This method is called when your extension is deactivated
export function deactivate() {}

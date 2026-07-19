import {
  commands,
  CodeLensProvider,
  TextDocument,
  DocumentSymbol,
  CodeLens,
  Range,
  Command
} from "vscode";


import { findMain } from './extension';


class MyCodeLensProvider implements CodeLensProvider {

    async provideCodeLenses(
        document: TextDocument
    ): Promise<CodeLens[]> {


        const symbols = await commands.executeCommand<
            DocumentSymbol[] | undefined
        >(
            "vscode.executeDocumentSymbolProvider",
            document.uri
        );


        const mainSymbol =
            symbols ? findMain(symbols) : undefined;

        const codeLensPosition = mainSymbol
            ? new Range(
                  mainSymbol.range.start,
                  mainSymbol.range.start
              )
            : new Range(0, 0, 0, 0);

        const lensCommands: Command[] = [
            {
                command: "c-cpp-codelens.compileCode",
                title: "Compile"
            },
            {
                command: "c-cpp-codelens.runCode",
                title: "▶ Run"
            },
            {
                command: "c-cpp-codelens.compileAndRunCode",
                title: "Compile and ▶ Run"
            },
            {
                command: "c-cpp-codelens.debugCode",
                title: "⚙ Debug"
            }
        ];

        return lensCommands.map(
            cmd => new CodeLens(codeLensPosition, cmd)
        );

    }
}

export default MyCodeLensProvider;

import {
    commands,
    CodeLensProvider,
    TextDocument,
    DocumentSymbol,
    CodeLens,
    Range
} from "vscode";


import { findMain } from './extension';
import { CODELENS_COMMANDS } from "./commands";


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

        return CODELENS_COMMANDS.map(
            cmd => new CodeLens(codeLensPosition, {
                command: cmd.id,
                title: cmd.title
            })
        );

    }
}

export default MyCodeLensProvider;

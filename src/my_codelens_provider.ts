import {
    commands,
    CodeLensProvider,
    TextDocument,
    DocumentSymbol,
    SymbolInformation,
    Position,
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
            Array<DocumentSymbol | SymbolInformation> | undefined
        >(
            "vscode.executeDocumentSymbolProvider",
            document.uri
        );


        const mainSymbol =
            symbols ? findMain(symbols) : undefined;

        const mainStart = mainSymbol
            ? ("selectionRange" in mainSymbol
                ? mainSymbol.selectionRange.start
                : mainSymbol.location.range.start)
            : findMainInText(document) ?? findFirstNonBlankLine(document);

        if (!mainStart) {
            return [];
        }

        const codeLensPosition = new Range(mainStart, mainStart);

        return CODELENS_COMMANDS.map(
            cmd => new CodeLens(codeLensPosition, {
                command: cmd.id,
                title: cmd.title
            })
        );

    }
}

export default MyCodeLensProvider;

function findMainInText(document: TextDocument): Position | undefined {
    const mainPattern = /\bmain\s*\(/;

    for (let line = 0; line < document.lineCount; line++) {
        const text = document.lineAt(line).text;
        const match = mainPattern.exec(text);

        if (match && match.index !== undefined) {
            return new Position(line, match.index);
        }
    }

    return undefined;
}

function findFirstNonBlankLine(document: TextDocument): Position | undefined {
    for (let line = 0; line < document.lineCount; line++) {
        const text = document.lineAt(line).text;

        if (text.trim().length > 0) {
            return new Position(line, text.search(/\S/));
        }
    }

    return undefined;
}

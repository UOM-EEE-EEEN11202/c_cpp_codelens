import {
  CodeLensProvider,
  TextDocument,
  CodeLens,
  Range,
  Command
} from "vscode";

class MyCodeLensProvider implements CodeLensProvider {
  // Each provider requires a provideCodeLenses function which will give the various documents
  // the code lenses
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    // Define where the CodeLens will exist
    let topOfDocument = new Range(0, 0, 0, 0);

    // Define what command we want to trigger when activating the CodeLens
    let a: Command = {
      command: "c-cpp-codelens.compileCode",
      title: "Compile"
    };

    let b: Command = {
      command: "c-cpp-codelens.runCode",
      title: "▶ Run"
    };

    let c: Command = {
      command: "c-cpp-codelens.compileAndRunCode",
      title: "Compile and ▶ Run"
    };

    let d: Command = {
      command: "c-cpp-codelens.debugCode",
      title: "⚙ Debug"
    };

    let codeLens = new CodeLens(topOfDocument, a);
    let codeLens2 = new CodeLens(topOfDocument, b);
    let codeLens3 = new CodeLens(topOfDocument, c);
    let codeLens4 = new CodeLens(topOfDocument, d);

    return [codeLens, codeLens2, codeLens3, codeLens4];
  }
}

export default MyCodeLensProvider;
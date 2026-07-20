# c-cpp-codelens README

A rough and ready extension to add codelens buttons for C/C++ files which call a build task in the .vscode folder

## Features

Adds codelens buttons to C or C++ files to run build scripts. Adds buttons for compile, run, compile and run, and debug. If there is an int main function in the file the codelens appears above this. If there is no main function the codelens appears at the top of the file. 

## Requirements

Requires build tasks to be defined in tasks.json in a .vscode folder. At the moment the names of the tasks are hard coded:

- Run current file
- C: clang compile current file
- C++: clang++ compile current file
- C: clang compile and run current file
- C++: clang++ compile and run current file
- C: clang compile and debug current file
- C++: clang++ compile and debug current file

I'll try and make these settings at some point.

## Extension Settings

None

## Known Issues

None

## Release Notes

None at the moment

## Internal Notes
* Uses container: mcr.microsoft.com/devcontainers/typescript-node
* Additional tools needed: npm install
* Additional tools needed: npx --package yo --package generator-code -- yo code
* To debug: Select src/extension.ts and in Command Palette: Debug: Start Debugging
* To publish see https://code.visualstudio.com/api/working-with-extensions/publishing-extension: npm install -g @vscode/vsce. vsce package. vsce publish
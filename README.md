# c-cpp-codelens README

A rough and ready extension to add codelens buttons for C/C++ files which call a build task in the .vscode folder

## Features

Adds codelens buttons at the top of a C or C++ file to run build scripts. Adds buttons for compile, run, compile and run, and debug.

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
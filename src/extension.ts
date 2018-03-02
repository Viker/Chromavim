'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { ChromaApp, Color, Key } from '../chroma.cjs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vimrbgg" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let razor = new RazerDevice();
    let rzrCtrl = new RazerChromaController(razor);

    vscode.window.showInformationMessage('Razor Updates !');

    let config = vscode.workspace.getConfiguration("editor");

    // vscode.workspace.onDidChangeConfiguration(event => {
    //     let affected = event.affectsConfiguration("vim.mode");
    //     if (affected) {
    //         // rebuild cpp project settings
    console.log("newfunk");
    //     }

    let green = vscode.commands.registerCommand('extension.setLightGreen', () => {

        razor.UpdateLightsGreen();


    });
    let red = vscode.commands.registerCommand('extension.setLightRed', () => {

        razor.UpdateLightsRed();
    });
    context.subscriptions.push(razor);
    context.subscriptions.push(rzrCtrl);
    context.subscriptions.push(green);
    context.subscriptions.push(red);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class RazerChromaController {

    private _rzrCounter: RazerDevice;
    private _disposable: vscode.Disposable;


    private _cursorStyle: vscode.TextEditorCursorStyle;
    constructor(razrCounter: RazerDevice) {

        this._rzrCounter = razrCounter;
        this._cursorStyle = vscode.TextEditorCursorStyle.Line;

        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {

        if (this._cursorStyle != vscode.window.activeTextEditor.options.cursorStyle) {
            if (vscode.window.activeTextEditor.options.cursorStyle == 1) {
                this._cursorStyle = vscode.window.activeTextEditor.options.cursorStyle;
                this._rzrCounter.SetInsertMode();
            }
            if (vscode.window.activeTextEditor.options.cursorStyle == 2) {
                this._cursorStyle = vscode.window.activeTextEditor.options.cursorStyle;
                this._rzrCounter.SetNormalMode();
            }
            if (vscode.window.activeTextEditor.options.cursorStyle == 4) {
                this._cursorStyle = vscode.window.activeTextEditor.options.cursorStyle;
                this._rzrCounter.SetVisualMode();
            }


        }

        // console.log("Cursor style is " + vscode.window.activeTextEditor.options.cursorStyle);
    }
}

class RazerDevice {

    private app: ChromaApp;

    private _disposable: vscode.Disposable;


    constructor() {
        this.app = new ChromaApp("AppVkr1", "appVkr2", "appVkr3");
        let subscriptions: vscode.Disposable[] = [];
        this._disposable = vscode.Disposable.from(...subscriptions);
    }
    public UpdateLights() {
        console.log("Mode Changed");
    }

    public async SetModeVisual() {
        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(0, 255, 0));
        await instance.send();
    }
    public async UpdateLightsGreen() {
        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(0, 255, 0));
        await instance.send();
    }

    public async UpdateLightsRed() {

        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(255, 0, 0));
        instance.send();
        await instance.send();
    }
    public async SetVisualMode() {
        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(255, 0, 255));
        await instance.send();
    }
    public async SetNormalMode() {
        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(0, 255, 0));
        instance.Keyboard.setKey([Key.H, Key.J, Key.K, Key.L], new Color(0, 0, 255));
        await instance.send();

    }
    public async SetInsertMode() {
        let instance = await this.app.Instance();
        instance.Keyboard.setAll(new Color(255, 0, 0));
        instance.Keyboard.setPosition(0, 1, new Color(0, 0, 255));
        instance.Keyboard.setPosition(0, 3, new Color(0, 0, 255));
        await instance.send();
    }
    dispose() {
        this._disposable.dispose();
    }

}
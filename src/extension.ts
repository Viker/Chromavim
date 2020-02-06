// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
	ChromaApp,
	AvailableDevices,
	ChromaInstance,
	AuthorInfo,
	AppInfo,
	AppCategory,
	Color,
	Key,
	WaveAnimation
} from '@pastez/chromajs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vimrbgg" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let chromaInstance: ChromaInstance | undefined;
	const chroma: ChromaApp = new ChromaApp(new AppInfo(
		'Chromavim',
		'Visual Studio Code Plugin for VSCODEVIM and Chroma',
		new AuthorInfo("nasser.ukla@pm.me", "Nasser U."),
		[AvailableDevices.Keyboard],
		AppCategory.Application
	));


	const connect = () => {
		chroma.Instance(true).then(instance => {
			if (instance) {
				chromaInstance = instance;
			}
			console.log("Here 1 ");
		});
	};


	connect();

	const config = () => {
		return vscode.workspace.getConfiguration('extension.chromavim');
	};

	vscode.window.showInformationMessage('Razor Updates !');

	console.log("newfunk");

	let disposableStart = vscode.commands.registerCommand('extension.vschroma.startAnimation', () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new WaveAnimation());
		}
	});

	let disposableStop = vscode.commands.registerCommand('extension.vschroma.stopAnimation', () => {
		if (chromaInstance) {
			playVSAnim();
		}
	});
	let green = vscode.commands.registerCommand('extension.setLightGreen', () => {
		playVSAnim();
	});

	context.subscriptions.push(disposableStart, disposableStop);

	const playVSAnim = () => {
		if (chromaInstance) {
			chromaInstance.playAnimation(new WaveAnimation());
		}
	};


}
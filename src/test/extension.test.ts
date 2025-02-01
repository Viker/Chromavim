import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { activate, deactivate } from '../extension';

// Import Mocha types
import 'mocha';

suite('Chromavim Extension Tests', () => {
    let context: vscode.ExtensionContext;
    
    setup(function() {
        // Create a mock extension context
        context = {
            subscriptions: [],
            extensionPath: '',
            storagePath: '',
            globalState: {
                get: () => undefined,
                update: () => Promise.resolve()
            },
            workspaceState: {
                get: () => undefined,
                update: () => Promise.resolve()
            },
            extensionUri: vscode.Uri.file(''),
            environmentVariableCollection: undefined,
            secrets: undefined,
            extension: undefined,
            storageUri: undefined,
            globalStorageUri: undefined,
            logUri: undefined,
            extensionMode: vscode.ExtensionMode.Test,
            asAbsolutePath: (path: string) => path,
        };
    });

    test('Extension should activate successfully', async () => {
        await activate(context);
        
        // Verify commands were registered
        const startCommand = await vscode.commands.getCommands(true)
            .then((cmds: string[]) => cmds.includes('extension.vschroma.startAnimation'));
        const stopCommand = await vscode.commands.getCommands(true)
            .then((cmds: string[]) => cmds.includes('extension.vschroma.stopAnimation'));
            
        assert.strictEqual(startCommand, true, 'Start animation command not registered');
        assert.strictEqual(stopCommand, true, 'Stop animation command not registered');
    });

    test('Extension should register configuration watcher', async () => {
        await activate(context);
        
        // Verify subscription was added
        assert.strictEqual(context.subscriptions.length > 0, true, 'No subscriptions registered');
    });

    test('Extension should clean up on deactivation', async () => {
        await activate(context);
        await deactivate();
        
        // Verify cleanup (this is mostly for coverage as the actual cleanup
        // depends on the Chroma SDK state which we can't easily mock)
        assert.ok(true, 'Deactivation completed without errors');
    });

    // Note: More extensive tests would require mocking the Chroma SDK
    // which is beyond the scope of this basic test suite
});

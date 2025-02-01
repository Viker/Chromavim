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

interface ChromaVimState {
    instance?: ChromaInstance;
    isConnected: boolean;
}

const state: ChromaVimState = {
    instance: undefined,
    isConnected: false
};

// Initialize Chroma SDK connection
async function initializeChroma(): Promise<void> {
    try {
        const chroma = new ChromaApp(new AppInfo(
            'Chromavim',
            'Visual Studio Code Plugin for VSCODEVIM and Chroma',
            new AuthorInfo("nasser.ukla@pm.me", "Nasser U."),
            [AvailableDevices.Keyboard],
            AppCategory.Application
        ));

        const instance = await chroma.Instance(true);
        if (instance) {
            state.instance = instance;
            state.isConnected = true;
            console.log('Successfully connected to Chroma SDK');
        } else {
            throw new Error('Failed to initialize Chroma instance');
        }
    } catch (error) {
        console.error('Failed to initialize Chroma:', error);
        vscode.window.showErrorMessage('Failed to connect to Razer Chroma SDK');
    }
}

// Handle Vim mode changes
async function handleVimModeChange(mode: string): Promise<void> {
    if (!state.instance || !state.isConnected) return;

    try {
        switch (mode) {
            case 'normal':
                await setNormalMode();
                break;
            case 'insert':
                await setInsertMode();
                break;
            case 'visual':
            case 'visual-line':
            case 'visual-block':
                await setVisualMode();
                break;
            default:
                console.log(`Unhandled Vim mode: ${mode}`);
        }
    } catch (error) {
        console.error('Failed to update keyboard lighting:', error);
    }
}

// Mode-specific lighting configurations
async function setNormalMode(): Promise<void> {
    if (!state.instance) return;
    
    state.instance.Keyboard.setAll(new Color(0, 255, 0));  // Green background
    state.instance.Keyboard.setKey([Key.H, Key.J, Key.K, Key.L], new Color(0, 0, 255));  // Blue HJKL keys
    await state.instance.send();
}

async function setInsertMode(): Promise<void> {
    if (!state.instance) return;
    
    state.instance.Keyboard.setAll(new Color(255, 0, 0));  // Red background
    state.instance.Keyboard.setPosition(0, 1, new Color(0, 0, 255));  // Blue accents
    state.instance.Keyboard.setPosition(0, 3, new Color(0, 0, 255));
    await state.instance.send();
}

async function setVisualMode(): Promise<void> {
    if (!state.instance) return;
    
    state.instance.Keyboard.setAll(new Color(255, 0, 255));  // Purple background
    await state.instance.send();
}

// Animation controls
async function startAnimation(): Promise<void> {
    if (!state.instance) return;
    state.instance.playAnimation(new WaveAnimation());
}

async function stopAnimation(): Promise<void> {
    if (!state.instance) return;
    await setNormalMode();  // Reset to normal mode colors
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    console.log('Activating Chromavim extension');

    // Initialize Chroma connection
    await initializeChroma();

    // Register commands
    const startCmd = vscode.commands.registerCommand('extension.vschroma.startAnimation', startAnimation);
    const stopCmd = vscode.commands.registerCommand('extension.vschroma.stopAnimation', stopAnimation);
    
    // Watch for Vim mode changes
    const modeChangeDisposable = vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        if (e.affectsConfiguration('vim.mode')) {
            const config = vscode.workspace.getConfiguration('vim');
            const currentMode = config.get<string>('mode', 'normal');
            handleVimModeChange(currentMode);
        }
    });

    // Add to subscriptions
    context.subscriptions.push(startCmd, stopCmd, modeChangeDisposable);
}

export async function deactivate(): Promise<void> {
    // Clean up Chroma connection
    if (state.instance) {
        try {
            state.instance.Keyboard.setAll(new Color(0, 0, 0));  // Turn off all lights
            await state.instance.send();
            state.isConnected = false;
            state.instance = undefined;
        } catch (error) {
            console.error('Error during deactivation:', error);
        }
    }
}

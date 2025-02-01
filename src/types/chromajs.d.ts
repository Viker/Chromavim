declare module '@pastez/chromajs' {
    export class ChromaApp {
        constructor(appInfo: AppInfo);
        Instance(initialize?: boolean): Promise<ChromaInstance>;
    }

    export class AppInfo {
        constructor(
            title: string,
            description: string,
            author: AuthorInfo,
            devices: AvailableDevices[],
            category: AppCategory
        );
    }

    export class AuthorInfo {
        constructor(contact: string, name: string);
    }

    export class ChromaInstance {
        Keyboard: KeyboardDevice;
        playAnimation(animation: Animation): void;
        send(): Promise<void>;
    }

    export class KeyboardDevice {
        setAll(color: Color): void;
        setKey(keys: Key[], color: Color): void;
        setPosition(row: number, col: number, color: Color): void;
    }

    export class Color {
        constructor(r: number, g: number, b: number);
    }

    export class WaveAnimation implements Animation {
        constructor();
    }

    export interface Animation {
        // Base interface for animations
    }

    export enum AvailableDevices {
        Keyboard
    }

    export enum AppCategory {
        Application
    }

    export enum Key {
        H,
        J,
        K,
        L
    }
}

import 'mocha';

declare global {
    function suite(name: string, fn: () => void): void;
    function test(name: string, fn: () => void | Promise<void>): void;
    function setup(fn: () => void | Promise<void>): void;
    function teardown(fn: () => void | Promise<void>): void;
    function suiteSetup(fn: () => void | Promise<void>): void;
    function suiteTeardown(fn: () => void | Promise<void>): void;
}

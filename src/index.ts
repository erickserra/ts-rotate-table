import { Cli } from "./cli";

export function main() {
    const isTestEnvironment = process.env.NODE_ENV === "test"
    
    // Only run in non-test environments, to avoid executing main on the import on the test file
    if (isTestEnvironment) return;

    const cli = new Cli();

    cli.execute();
}

main();

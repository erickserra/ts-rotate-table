import { main } from ".";
import { Cli } from "./cli";

describe('index', () => {
    describe('main', () => {
        let spyExecute: jest.SpyInstance;

        describe('when is test environment', () => {
            beforeEach(() => {
                spyExecute = jest.spyOn(Cli.prototype, 'execute').mockResolvedValue();
            });
    
            it('should execute the cli', () => {
                main();
                expect(spyExecute).not.toHaveBeenCalled();
            });
        });

        describe('when is not test environment', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'production';
                spyExecute = jest.spyOn(Cli.prototype, 'execute').mockResolvedValue();
            });
    
            it('should execute the cli', () => {
                main();
                expect(spyExecute).toHaveBeenCalledTimes(1);
            });
        });
    });
});
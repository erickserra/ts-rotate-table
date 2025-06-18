jest.mock("fs");
jest.mock("path");

import * as fs from "fs";
import * as path from "path";
import * as csvStream from "csv-stream";
import * as fastCsv from "fast-csv";

import { Cli } from "./cli";
import { PassThrough, Writable } from "stream";

describe("cli", () => {
    let cli: Cli;

    beforeEach(() => {
        cli = new Cli();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe("isPerfectSquareOrMatrix", () => {
        it("should return false for array of length 0", () => {
            expect(cli["isPerfectSquareOrMatrix"]([])).toEqual(false);
        });

        it("should return false for array of length 2", () => {
            expect(cli["isPerfectSquareOrMatrix"]([2, -0])).toEqual(false);
        });

        it("should return false for array of length 3", () => {
            expect(cli["isPerfectSquareOrMatrix"]([2, -5, -5])).toEqual(false);
        });

        it("should return true for array of length 4 (perfect square)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2, 3, 4])).toEqual(true);
        });

        it("should return false for array of length 5 (not a perfect square)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2, 3, 4, 5])).toEqual(false);
        });

        it("should return false for array of length 6 (rectangle)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2, 3, 4, 5, 6])).toEqual(true);
        });

        it("should return true for array of length 1 (perfect square)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1])).toEqual(true);
        });

        it("should return false for array of length 2 (not a matrix)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2])).toEqual(false);
        });

        it("should return true for array of length 8 (rectangle)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(
                true
            );
        });

        it("should return true for array of length 9 (perfect square)", () => {
            expect(cli["isPerfectSquareOrMatrix"]([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual(
                true
            );
        });

        it("should return true for array of length 15 (rectangle)", () => {
            expect(
                cli["isPerfectSquareOrMatrix"]([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                ])
            ).toEqual(true);
        });

        it("should return true for array of length 16 (perfect square)", () => {
            expect(
                cli["isPerfectSquareOrMatrix"]([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                ])
            ).toEqual(true);
        });
    });

    describe("mapToSquareMatrix", () => {

        it("when the given data has a length of 4", () => {
            expect(cli["mapToSquareMatrix"]([1, 2, 3, 4])).toEqual([
                [1, 2],
                [3, 4],
            ]);
        });

        it("when the given data has a length of 6", () => {
            expect(cli["mapToSquareMatrix"]([1, 2, 3, 4, 5, 6])).toEqual([
                [1, 2, 3],
                [4, 5, 6],
            ]);
        });

        it("when the given data has a length of 8", () => {
            expect(cli["mapToSquareMatrix"]([1, 2, 3, 4, 5, 6, 7, 8])).toEqual([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
            ]);
        });

        it("when the given data has a length of 9", () => {
            expect(cli["mapToSquareMatrix"]([1, 2, 3, 4, 5, 6, 7, 8, 9])).toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]);
        });

        it("when the given data has a length of 10", () => {
            expect(
                cli["mapToSquareMatrix"]([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            ).not.toEqual([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]);
        });

        it("when the given data has a length of 16", () => {
            expect(
                cli["mapToSquareMatrix"]([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                ])
            ).toEqual([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16],
            ]);
        });

        it("when the given data has a length of 25", () => {
            expect(
                cli["mapToSquareMatrix"]([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
                ])
            ).toEqual([
                [1, 2, 3, 4, 5],
                [6, 7, 8, 9, 10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25],
            ]);
        });
    });

    describe('rotateMatrix', () => {
        it('should return an empty array', () => {
            expect(cli['rotateMatrix']([])).toEqual([]);
        });

        it('should return a 2x2 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([[1,2], [3,4]])).toEqual([[3, 1], [4, 2]]);
        });

        it('should return a 2x3 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([[1,2,3], [4,5,6]])).toEqual([[4, 1, 2], [5, 6, 3]]);
        });

        it('should return a 3x3 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([[1,2,3], [4,5,6], [7,8,9]])).toEqual([[4, 1, 2], [7, 5, 3], [8, 9, 6]]);
        });

        it('should return a 3x4 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]
            ])).toEqual([
                [ 5, 1, 2, 3 ], 
                [ 9, 7, 6, 4 ], 
                [ 10, 11, 12, 8 ] 
            ]);
        });

        it('should return a 4x4 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([
                [1,  2,  3,  4],
                [5,  6,  7,  8],
                [9,  10, 11, 12],
                [13, 14, 15, 16]
            ])).toEqual([
                [ 5, 1, 2, 3 ],
                [ 9, 10, 6, 4 ],
                [ 13, 11, 7, 8 ],
                [ 14, 15, 16, 12 ]
            ]);
        });

        it('should return a 5x5 matrix rotated to the right', () => {
            expect(cli['rotateMatrix']([
                [1,  2,  3,  4,  5],
                [6,  7,  8,  9,  10],
                [11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20],
                [21, 22, 23, 24, 25]
            ])).toEqual([
                [ 6, 1, 2, 3, 4 ],
                [ 11, 12, 7, 8, 5 ],
                [ 16, 17, 13, 9, 10 ],
                [ 21, 18, 19, 14, 15 ],
                [ 22, 23, 24, 25, 20 ]
            ]);
        });
    });

    describe("processRow", () => {
        let spyIsPerfectSquareOrMatrix: jest.SpyInstance;
        let spyMapToSquareMatrix: jest.SpyInstance;
        let spyRotateMatrix: jest.SpyInstance;

        beforeEach(() => {
            spyIsPerfectSquareOrMatrix = jest.spyOn(cli, "isPerfectSquareOrMatrix" as any);
            spyMapToSquareMatrix = jest.spyOn(cli, "mapToSquareMatrix" as any);
            spyRotateMatrix = jest.spyOn(cli, "rotateMatrix" as any);
        });

        it("when json is not an array", () => {
            expect(cli["processRow"]({ id: "1", json: {} as any })).toEqual({
                id: "1",
                json: "[]",
                is_valid: false,
            });
            expect(spyIsPerfectSquareOrMatrix).not.toHaveBeenCalled();
            expect(spyMapToSquareMatrix).not.toHaveBeenCalled();
            expect(spyRotateMatrix).not.toHaveBeenCalled();
        });

        it("when json is an array of length 0", () => {
            expect(cli["processRow"]({ id: "1", json: [] })).toEqual({
                id: "1",
                json: "[]",
                is_valid: false,
            });
            expect(spyIsPerfectSquareOrMatrix).not.toHaveBeenCalled();
            expect(spyMapToSquareMatrix).not.toHaveBeenCalled();
            expect(spyRotateMatrix).not.toHaveBeenCalled();
        });

        it("when json is an array of length 1", () => {
            expect(cli["processRow"]({ id: "1", json: [-5] })).toEqual({
                id: "1",
                json: "[-5]",
                is_valid: true,
            });
            expect(spyIsPerfectSquareOrMatrix).not.toHaveBeenCalled();
            expect(spyMapToSquareMatrix).not.toHaveBeenCalled();
            expect(spyRotateMatrix).not.toHaveBeenCalled();
        });

        it("when json is not a perfect square matrix", () => {
            spyIsPerfectSquareOrMatrix.mockReturnValue(false);
            expect(cli["processRow"]({ id: "1", json: [-5, 1, 2, 3, 4, 5] })).toEqual(
                {
                    id: "1",
                    json: "[]",
                    is_valid: false,
                }
            );
            expect(spyIsPerfectSquareOrMatrix).toHaveBeenCalled();
            expect(spyMapToSquareMatrix).not.toHaveBeenCalled();
            expect(spyRotateMatrix).not.toHaveBeenCalled();
        });

        it("when json is a perfect square matrix", () => {
            spyIsPerfectSquareOrMatrix.mockReturnValue(true);
            spyMapToSquareMatrix.mockReturnValue([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
            spyRotateMatrix.mockReturnValue([[4, 1, 2], [7, 5, 3], [8, 9, 6]]);
            expect(cli["processRow"]({ id: "1", json: [1, 2, 3, 4, 5, 6, 7, 8, 9] })).toEqual(
                {
                    id: "1",
                    json: "[4,1,2,7,5,3,8,9,6]",
                    is_valid: true,
                }
            );
            expect(spyIsPerfectSquareOrMatrix).toHaveBeenCalled();
            expect(spyMapToSquareMatrix).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(spyRotateMatrix).toHaveBeenCalledWith([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        });
    });

    describe("getValidatedFilePath", () => {

        beforeEach(() => {
            (path.resolve as jest.Mock).mockReturnValue('./input.csv');
        });

        it("when filePath is not given", () => {
            expect(() => cli["getValidatedFilePath"]()).toThrow('Please provide an input CSV file.')
            expect(fs.existsSync).not.toHaveBeenCalled();
            expect(path.resolve).not.toHaveBeenCalled();
        });

        it("when filePath is given but the file does not exist", () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            expect(() => cli["getValidatedFilePath"]('./input.csv')).toThrow('File does not exist: ./input.csv')
            expect(fs.existsSync).toHaveBeenCalledWith('./input.csv');
            expect(path.resolve).toHaveBeenCalledWith('./input.csv');
        });

        it("when filePath is given but AND the file existS", () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);
            expect(cli["getValidatedFilePath"]('./input.csv')).toEqual('./input.csv');
            expect(path.resolve).toHaveBeenCalledWith('./input.csv');
            expect(fs.existsSync).toHaveBeenCalledWith('./input.csv');
        });
    });

    describe('createStreamParser', () => {
        let spyCreateStream: jest.SpyInstance;

        beforeEach(() => {
            spyCreateStream = jest.spyOn(csvStream, "createStream").mockReturnValue({})
        });

        it('should return the stream', () => {
            expect(cli['createStreamParser']()).toEqual({})
            expect(spyCreateStream).toHaveBeenCalledWith({
                endLine: "\n",
                escapeChar: '"',
                enclosedChar: '"',
            });
        });
    });

    describe('createOutputStream', () => {
        let spyFormat: jest.SpyInstance;
        let mockPipe: jest.Mock;
        let mockOn: jest.Mock;
        let mockStream: any;

        beforeEach(() => {
            mockOn = jest.fn();
            mockPipe = jest.fn().mockReturnValue({ on: mockOn });
            mockStream = { pipe: mockPipe }
            spyFormat = jest.spyOn(fastCsv, "format").mockReturnValue(mockStream)
        });

        it('should return the stream', () => {
            expect(cli['createOutputStream']()).toEqual({ pipe: expect.any(Function) })
            expect(spyFormat).toHaveBeenCalledWith({
                headers: true,
                quoteColumns: { json: true },
                quoteHeaders: false,
            });
            expect(mockPipe).toHaveBeenCalled();
        });
    });

    describe('processCsvFile', () => {
        let inputStream: PassThrough;
        let parserStream: PassThrough;
        let outputStream: Writable;

        let writeMock: jest.Mock;
        let outputStreamEndMock: jest.Mock;

        let spyCreateStreamParser: jest.SpyInstance;
        let spyCreateOutputStream: jest.SpyInstance;
        let spyProcessRow: jest.SpyInstance;

        beforeEach(() => {
            writeMock = jest.fn();
            outputStreamEndMock = jest.fn();

            inputStream = new PassThrough();
            parserStream = new PassThrough({ objectMode: true });

            outputStream = new Writable({
                objectMode: true,
                write: (chunk, _enc, callback) => {
                    writeMock(chunk);
                    callback();
                },
                final: (callback) => {
                    outputStreamEndMock();
                    callback();
                },
            });

            spyProcessRow = jest.spyOn(cli, "processRow" as any).mockReturnValue({});
            spyCreateStreamParser = jest.spyOn(cli, "createStreamParser" as any).mockReturnValue(parserStream);
            spyCreateOutputStream = jest.spyOn(cli, "createOutputStream" as any).mockReturnValue(outputStream);

            (fs.createReadStream as jest.Mock).mockReturnValue(inputStream);
        });

        describe('when the stream ends with success', () => {

            it('pipes streams and ends output on end', async () => {
                const processCsvFilePromise = cli['processCsvFile']('input.csv');

                expect(spyCreateStreamParser).toHaveBeenCalled();
                expect(spyCreateOutputStream).toHaveBeenCalled();
                expect(fs.createReadStream).toHaveBeenCalledWith('input.csv');
                
                //emit a valid json
                parserStream.emit('data', { id: '1', json: JSON.stringify([1,2,3]) })

                //emit invalid json to test the catch block
                parserStream.emit('data', { id: '2', json: '{ invalid json' });

                //emit another valid json
                parserStream.emit('data', { id: '3', json: JSON.stringify([1,2,3,4,5,6,7,8,9]) })

                // //end the stream
                parserStream.end();

                await processCsvFilePromise;

                expect(spyProcessRow).toHaveBeenNthCalledWith(1, { id: '1', json: [1,2,3] });
                expect(spyProcessRow).toHaveBeenNthCalledWith(2, { id: '3', json: [1,2,3,4,5,6,7,8,9] });
                expect(spyProcessRow).toHaveBeenCalledTimes(2);

                expect(writeMock).toHaveBeenCalledTimes(3);
                expect(writeMock).toHaveBeenNthCalledWith(1, {})
                expect(writeMock).toHaveBeenNthCalledWith(2, { id: '2', json: "[]", is_valid: false });
                expect(writeMock).toHaveBeenNthCalledWith(3, {});

                expect(outputStreamEndMock).toHaveBeenCalled();
            });
        });

        describe('when the stream ends with error', () => {

            it('pipes streams and ends output on end', async () => {
                const processCsvFilePromise = cli['processCsvFile']('input.csv');

                expect(spyCreateStreamParser).toHaveBeenCalled();
                expect(spyCreateOutputStream).toHaveBeenCalled();
                expect(fs.createReadStream).toHaveBeenCalledWith('input.csv');
                
                //emit an error
                parserStream.emit('error', new Error('Stream failure'))

                await expect(processCsvFilePromise).rejects.toThrow('Stream failure');

                expect(spyProcessRow).not.toHaveBeenCalled();
                expect(writeMock).not.toHaveBeenCalled();
                expect(outputStreamEndMock).toHaveBeenCalled();
            });
        });
    });

    describe('execute', () => {
        let sypGetValidatedFilePath: jest.SpyInstance;
        let spyProcessCsvFile: jest.SpyInstance;

        beforeEach(() => {
            process.argv = ['node', 'script.js', 'input.csv'];
            process.exit = jest.fn() as unknown as typeof process.exit;
            console.error = jest.fn();

            sypGetValidatedFilePath = jest.spyOn(cli, 'getValidatedFilePath' as any).mockReturnValue('input-validated.csv')
            spyProcessCsvFile = jest.spyOn(cli, 'processCsvFile' as any);
        });

        describe('when processCsvFile ends with success', () => {
            beforeEach(() =>{
                spyProcessCsvFile.mockResolvedValue({});
                cli.execute();
            });

            it('should call the right methods and exit with code 0', () => {
                expect(sypGetValidatedFilePath).toHaveBeenCalledWith('input.csv');
                expect(spyProcessCsvFile).toHaveBeenCalledWith('input-validated.csv');
                expect(process.exit).toHaveBeenCalled();
            });
        });

        describe('when processCsvFile throws an error', () => {
            beforeEach(() =>{
                spyProcessCsvFile.mockRejectedValue('custom error');
                cli.execute();
            });

            it('should call the right methods and exit with code 1', () => {
                expect(sypGetValidatedFilePath).toHaveBeenCalledWith('input.csv');
                expect(spyProcessCsvFile).toHaveBeenCalledWith('input-validated.csv');
                expect(process.exit).toHaveBeenCalledWith(1);
                expect(console.error).toHaveBeenCalledWith("\n\n", "\x1b[31m%s\x1b[0m", 'custom error');
            });
        });
    });
});

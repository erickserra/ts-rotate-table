import * as fs from "fs";
import * as csvStream from "csv-stream";
import * as fastCsv from "fast-csv";
import * as path from "path";
import { InputRow, OutputRow } from "./cli.types";

export class Cli {

  /**
   * Determines if an array can be transformed into a matrix M x N
   * @param arr
   */
  private isPerfectSquareOrMatrix<T>(arr: T[]): boolean {
    const length = arr.length;

    if (length === 0) return false;
    if (length === 1) return true;

    const maxDivisor = Math.sqrt(length)

    // Check for any divisors (covers both perfect squares and rectangles)
    for (let i = 2; i <= maxDivisor; i++) {
      if (length % i === 0) {
        return true;
      }
    }

    return false; // Prime numbers only
  }

  /**
   * Returns the square matrix of an array
   * @param arr
   */
  private mapToSquareMatrix<T>(arr: T[]): T[][] {
    const length = arr.length;

    // Find the largest square root factor of the length
    let bestRowCount = Math.floor(Math.sqrt(length));

    while (length % bestRowCount !== 0) {
      bestRowCount--;
    }

    const columnCount = length / bestRowCount;
    const matrix: T[][] = [];

    for (let i = 0; i < arr.length; i += columnCount) {
      matrix.push(arr.slice(i, i + columnCount));
    }

    return matrix;
  }

  /**
   * Rotates a given matrix to the right by one step
   * 
   * Note: This method mutates the matrix parameter directly to save memory in case of large data
   * @param matrix
   */
  private rotateMatrix<T>(matrix: T[][]) {
    if (!matrix || !matrix.length || !matrix[0].length) return matrix;

    const rowCount = matrix.length;
    const colCount = matrix[0].length;

    // Number of rings to process
    const rings = Math.min(rowCount, colCount) / 2;

    // Process each ring
    for (let ring = 0; ring < rings; ring++) {
      // Define boundaries of current ring
      const topRowIndex = ring;
      const bottomRowIndex = rowCount - 1 - ring;
      const leftColIndex = ring;
      const rightColIndex = colCount - 1 - ring;

      // Skip if ring has collapsed to a single element (odd-sized matrix center)
      if (topRowIndex === bottomRowIndex && leftColIndex === rightColIndex) continue;

      // Collect all elements in the ring in clockwise order
      const ringElements: T[] = [];

      // Top row (left to right)
      for (let j = leftColIndex; j <= rightColIndex; j++) {
        ringElements.push(matrix[topRowIndex][j]);
      }

      // Right column (top to bottom, excluding top corner)
      for (let i = topRowIndex + 1; i <= bottomRowIndex; i++) {
        ringElements.push(matrix[i][rightColIndex]);
      }

      // Bottom row (right to left, excluding right corner) - only if there's more than one row
      const hasMultipleRows = bottomRowIndex > topRowIndex;
      
      if (hasMultipleRows) {
        for (let j = rightColIndex - 1; j >= leftColIndex; j--) {
          ringElements.push(matrix[bottomRowIndex][j]);
        }
      }

      // Left column (bottom to top, excluding corners) - only if there's more than one column
      const hasMultipleColumns = rightColIndex > leftColIndex;

      if (hasMultipleColumns) {
        for (let i = bottomRowIndex - 1; i > topRowIndex; i--) {
          ringElements.push(matrix[i][leftColIndex]);
        }
      }
      
      // Rotate the ring elements by one position clockwise
      if (ringElements.length > 1) {
        const rotatedElements = [ringElements[ringElements.length - 1], ...ringElements.slice(0, -1)];

        // Place rotated elements back into the matrix (in-place modification)
        let ringElementIndex = 0;

        // Top row (left to right)
        for (let j = leftColIndex; j <= rightColIndex; j++) {
          matrix[topRowIndex][j] = rotatedElements[ringElementIndex++];
        }

        // Right column (top to bottom, excluding top corner)
        for (let i = topRowIndex + 1; i <= bottomRowIndex; i++) {
          matrix[i][rightColIndex] = rotatedElements[ringElementIndex++];
        }

        // Bottom row (right to left, excluding right corner)
        if (hasMultipleRows) {
          for (let j = rightColIndex - 1; j >= leftColIndex; j--) {
            matrix[bottomRowIndex][j] = rotatedElements[ringElementIndex++];
          }
        }

        // Left column (bottom to top, excluding corners)
        if (hasMultipleColumns) {
          for (let i = bottomRowIndex - 1; i > topRowIndex; i--) {
            matrix[i][leftColIndex] = rotatedElements[ringElementIndex++];
          }
        }
      }
    }

    return matrix;
  }

  /**
   * Determines if the given json is a valid row to be processed
   * @param json
   */
  private isRowValid(json: unknown[]) {
    return Array.isArray(json) && json.length > 0
  }

  /**
   * Process a single row of the csv and return the OutputRow format
   * @param row
   */
  private processRow(row: InputRow): OutputRow {
    const rowJson = row.json;

    if (!this.isRowValid(rowJson)) {
      return { id: row.id, json: "[]", is_valid: false };
    }

    // If the length of the array is 1, we can avoid all the processing because the result will always be the same.
    if (rowJson.length === 1) {
      return { id: row.id, json: JSON.stringify(rowJson), is_valid: true };
    }

    if (!this.isPerfectSquareOrMatrix(rowJson)) {
      return { id: row.id, json: "[]", is_valid: false };
    }

    const matrix = this.mapToSquareMatrix(rowJson);
    const rotatedMatrix = this.rotateMatrix(matrix);

    return {
      id: row.id,
      json: JSON.stringify(rotatedMatrix.flat()),
      is_valid: true,
    };
  }

  /**
   * Validates the input file path and resolves it.
   * Throws an error if invalid or file doesn't exist.
   * 
   * @param filePath
   */
  private getValidatedFilePath(filePath?: string) {
    if (!filePath) {
      throw new Error("Please provide an input CSV file.");
    }

    const resolvedPath = path.resolve(filePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File does not exist: ${resolvedPath}`);
    }

    return resolvedPath;
  }

  /**
   * Creates and returns a CSV parser stream (csv-stream).
   */
  private createStreamParser() {
    return csvStream.createStream({
      endLine: "\n",
      escapeChar: '"',
      enclosedChar: '"',
    });
  }

  /**
   * Creates and returns a CSV formatter stream (fast-csv).
   */
  private createOutputStream() {
    const outputStream = fastCsv.format({
      headers: true,
      quoteColumns: { json: true },
      quoteHeaders: false,
    });
    outputStream.pipe(process.stdout);
    return outputStream;
  }

  /**
   * Processes the CSV input file by streaming row-by-row,
   * applying processRow, and streaming output to stdout.
   * 
   * @param inputFile
   */
  private processCsvFile(inputFile: string) {
    const parser = this.createStreamParser();
    const outputStream = this.createOutputStream();

    return new Promise((resolve, reject) => {
      fs.createReadStream(inputFile)
        .pipe(parser)
        .on("data", (row: { id: string; json: string }) => {
          try {
            const id = row.id;
            const jsonArray = JSON.parse(row.json);
            const processedRow = this.processRow({ id, json: jsonArray });
            outputStream.write(processedRow);
          } catch (err) {
            outputStream.write({ id: row.id, json: "[]", is_valid: false });
          }
        })
        .on("end", () => {
          outputStream.end();
          resolve({});
        })
        .on("error", (error) => {
          outputStream.end();
          reject(error);
        });
    });
  }

  /**
   * Execute the CLI by validating the filePath and then processing the csv
   */
  public async execute() {
    try {
      const inputFile = this.getValidatedFilePath(process.argv[2]);
      await this.processCsvFile(inputFile);
      process.exit();
    } catch (err) {
      console.error("\n\n", "\x1b[31m%s\x1b[0m", err.message || err);
      process.exit(1);
    }
  }
}
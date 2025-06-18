# TS Rotate Table

## Run the cli

```
node cli.js input.csv > output.csv
```

## Run tests

```
npm install
```
```
npm run coverage
```


## Scoring Criteria

### ✅ Basics
- **Does the program run?** Yes, tested with Node.js v22.16.0.
- **Does it read and output data we would like it to?** Yes, it reads CSV input and outputs transformed data to `stdout`.
- **Is it properly formatted?** Yes.

### ✅ Completeness
- **Does it handle all the cases, including differing numbers of rows and columns, bigger and smaller tables, error cases you might come up with?** 
The app handles tables with different numbers of rows and columns, bigger and smaller tables and error scenarios.

&nbsp;&nbsp;&nbsp;**The following error cases are handled**:
<br>
&nbsp;&nbsp;&nbsp;1. Invalid JSON for the table  
&nbsp;&nbsp;&nbsp;2. Invalid tables — arrays that cannot be transformed into a table due to length  
&nbsp;&nbsp;&nbsp;3. No file provided as input  
&nbsp;&nbsp;&nbsp;4. The file provided does not exist or cannot be found  
&nbsp;&nbsp;&nbsp;5. Node.js fails to read or to output the data
- **For the cases you are handling, are you
handling them correctly?** Yes, I Believe so.
- **How do you know this?** I created specific test inputs and manually verified the output. In addition, I wrote unit tests to cover edge cases. The stream pipeline is wrapped with proper error handling. If a failure occurs while reading or writing, I clean up the streams and terminate the Node.js process to avoid memory leaks.
- **Did you test against sample data?** Yes, see `data/input.csv`.
- **Did you write unit tests?** Yes, they cover all the cases I could think of and they can be found at `src/cli.spec.ts` and `src/index.spec.ts`

### ✅ Efficiency
- **Be thoughtful about how you use system
resources. Sample data sets may be
small, but your program may be
evaluated against much larger data sets.** <br>I tested with a sample CSV of 251,7MB containing 400,000 rows, with valid and invalid jsons, small and large tables and got this results:<br>
**Execution Time**: 6.3 seconds <br/>
**Memory usage**: <br/>
  RSS: 99.02 MB<br>
  Heap Total: 49.20 MB<br>
  Heap Used: 17.32 MB<br>
  External: 2.25 MB<br>
- **Can you stream the CSV file instead of
reading it completely upfront?** Yes, the CSV is processed using streams. It reads, processes, and outputs each row as it comes in, without loading the entire file into memory.



## Coverage

![Coverage screenshot](https://i.ibb.co/4ws9KjgF/Screenshot-2025-06-18-at-17-43-23.png)
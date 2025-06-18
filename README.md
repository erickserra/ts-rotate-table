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
- **Does it read and output data we would like it to?** Yes, it reads CSV input and outputs transformed data to `stdout` or a file.
- **Is it properly formatted?** Yes.

### ✅ Completeness
- **Does it handle all the cases, including differing numbers of rows and columns, bigger and smaller tables, error cases you might come up with?** 
I believe so. These are the cases I am handling:  
1. Invalid json for the table
2. Invalid tables => arrays that cannot be transformed into a table due to its length
3. No File provided as input
4. The File provided as input does not exist or cannot be found
5. Node.js fails to read the csv data as an stream
- **For the cases you are handling, are you
handling them correctly?** Yes, I Believe so.
- **How do you know this?** I created test inputs and manually verified output + wrote unit tests. Besides that, If the app crashes due to an error reading or outputting the stream, I cleanup the streams and I terminate the node.js process ensuring no memory leaks
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
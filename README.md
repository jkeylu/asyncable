# Asyncable.js

## Quick Examples

```javascript
var fsStat = asyncable.thenable(fs.stat);
asyncable
    .map(['file1','file2','file3'], fsStat)
    .then(function(results) {
        // results is now an array of stats for each file
    });

var fsExists = asyncable.thenable(fs.exists);
asyncable
    .filter(['file1','file2','file3'], fsExists)
    .then(function(results) {
        // results now equals an array of the existing files
    });

asyncable
    .parallel([
        function() { ... },
        function() { ... }
    ])
    .then(function(results) {

    });

asyncable
    .series([
        function() { ... },
        function() { ... }
    ])
    .then(function(results) {

    });
```

## Download

The source is available for download from
[GitHub](https://github.com/jkeylu/asyncable/blob/master/lib/asyncable.js).
Alternatively, you can install using Node Package Manager (`npm`):

    npm install asyncable

## Documentation

The following are supported.

### Collections

* [`each`](#each), `eachSeries`, `eachLimit`
* [`forEachOf`](#forEachOf), `forEachOfSeries`, `forEachOfLimit`
* [`map`](#map), `mapSeries`, `mapLimit`
* [`filter`](#filter), `filterSeries`, `filterLimit`
* [`reject`](#reject), `rejectSeries`, `rejectLimit`
* [`reduce`](#reduce), [`reduceRight`](#reduceRight)
* [`detect`](#detect), `detectSeries`, `detectLimit`
* [`sortBy`](#sortBy)
* [`some`](#some), `someLimit`
* [`every`](#every), `everyLimit`
* [`concat`](#concat), `concatSeries`

### Control Flow

* [`series`](#seriestasks-callback)
* [`parallel`](#parallel), `parallelLimit`
* [`whilst`](#whilst), [`doWhilst`](#doWhilst)
* [`until`](#until), [`doUntil`](#doUntil)
* [`during`](#during), [`doDuring`](#doDuring)
* [`forever`](#forever)
* [`waterfall`](#waterfall)
* [`compose`](#compose)
* [`seq`](#seq)
* [`applyEach`](#applyEach), `applyEachSeries`
* [`queue`](#queue), [`priorityQueue`](#priorityQueue)
* [`cargo`](#cargo)
* [`auto`](#auto)
* [`retry`](#retry)
* [`iterator`](#iterator)
* [`times`](#times), `timesSeries`, `timesLimit`

### Utils

* [`apply`](#apply)
* <s>[`nextTick`](#nextTick)</s>
* [`memoize`](#memoize)
* [`unmemoize`](#unmemoize)
* <s>[`ensureAsync`](#ensureAsync)</s>
* <s>[`constant`](#constant)</s>
* <s>[`asyncify`](#asyncify)</s>
* <s>[`wrapSync`](#wrapSync)</s>
* [`log`](#log)
* [`dir`](#dir)
* [`noConflict`](#noConflict)

# thread.js
Simple, lightweight and easy multi-thread JavaScript library

[Official WebSite](https://threadjs.deep-rain.com/)

## Usage

### a simple.

```js
var thread = new Thread(function(){
  return "hello Thread.js";
});

thread.once().done(function(d){
  console.log(d);    // -> hello Thread.js
});
```

### with arguments.

```js
var thread = new Thread(function(a, b){
  return a + b;
});

thread.once(1, 2).done(function(d){
  console.log(d);    // -> 3
});
```

### with progress.

```js
var thread = new Thread(function(){
  notify("progress");
  return "hello Thread.js";
});

thread.once().progress(function(d){
  console.log(d);    // -> progress
}).done(function(d){
  console.log(d);    // -> hello Thread.js
});
```

### with other libraries.

```js
var thread = new Thread(function(){
  example();
}, [
  "http://example.com/path/to/example.js",
  "http://example.com/path/to/example2.js"
]);

thread.once().progress(function(d){
  // ...
});
```

## LICENSE

Apache-2.0
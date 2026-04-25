# thread.js

> **Notice: End of Life**
>
> This project is no longer maintained. For new projects, we recommend [Comlink](https://github.com/GoogleChromeLabs/comlink), which provides a modern, type-safe API for Web Workers.
>
> The repository is archived for historical reference. Existing users may continue to use the library as-is, but no further updates, bug fixes, or security patches will be provided.
>
> ---
>
> **お知らせ: メンテナンス終了 (EOL)**
>
> 本プロジェクトは保守を終了しました。新規プロジェクトでは [Comlink](https://github.com/GoogleChromeLabs/comlink) のご利用を推奨します。
>
> 本リポジトリは過去の参照用としてアーカイブ保存されます。既存利用者は引き続き利用可能ですが、今後のアップデート・バグ修正・セキュリティパッチは提供されません。

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
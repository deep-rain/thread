(function() {

    // Constants
    var Type = {
        RESOLVE: "resolve",
        NOTIFY: "notify"
    };
    var REPLACE_SEQUENCE = "{{#CODE}}";
    var CODE = 'onmessage = function(e){ postMessage({type:"' + Type.RESOLVE + '",content:({{#CODE}}).call(this, (e.data ? JSON.parse(e.data) : undefined))});};function notify(c){postMessage({type:"' + Type.NOTIFY + '", content:c})}';

    var getEmbeddedCode = function(s) {
        return CODE.replace(REPLACE_SEQUENCE, s);
    };

    window.Thread = (function() {

        // Deferred class
        var Deferred = function() {
            this.resolveQueues = [];
            this.rejectQueues = [];
            this.progressQueues = [];
            this.args = null;
            this.isDone = false;
            this.isFailed = false;
        };

        Deferred.prototype.done = function(func) {
            if (this.isDone) {
                func(this.args);
            }
            else {
                this.resolveQueues.push(func);
            }
            return this;
        };

        Deferred.prototype.fail = function(func) {
            if (this.isFailed) {
                func(this.args);
            }
            else {
                this.rejectQueues.push(func);
            }
            return this;
        };

        Deferred.prototype.always = function(func) {
            if (this.isFailed || this.isDone) {
                func(this.args);
            }
            else {
                this.resolveQueues.push(func);
                this.rejectQueues.push(func);
            }
            return this;
        };

        Deferred.prototype.progress = function(func) {
            this.progressQueues.push(func);
        };

        Deferred.prototype.resolve = function(obj) {
            this.isDone = true;
            this.args = obj;
            this.resolveQueues.forEach(function(q) {
                q(obj);
            });
            return this;
        };

        Deferred.prototype.notify = function(obj) {
            this.progressQueues.forEach(function(q) {
                q(obj);
            });
        };

        Deferred.prototype.reject = function(obj) {
            this.isFailed = true;
            this.args = obj;
            this.rejectQueues.forEach(function(q) {
                q(obj);
            });
            return this;
        };

        // Thread class
        var Thread = function(func, depends) {

            // check browser
            if (!window.Blob ||
                !window.URL ||
                !window.Worker) {
                throw new Error("this browser is not supported");
            }

            // inject dependent libraries.
            depends = depends || [];
            if (!(depends instanceof window.Array)) {
                depends = [depends];
            }

            var scripts = "";
            if (depends.length > 0) {
                scripts = 'importScripts("' + depends.join('","') + '");';
            }

            // create Blob object.
            var blob = new window.Blob([scripts + getEmbeddedCode(func.toString())]);
            this.blobUrl = window.URL.createObjectURL(blob);

            // greate Worker object.
            this.worker = new window.Worker(this.blobUrl);
            this.deferred = new Deferred();

            // add event listener.
            var self = this;

            // onmessage
            this.worker.addEventListener("message", function(e) {
                switch (e.data.type) {
                    case Type.RESOLVE:
                        self.deferred.resolve(e.data.content);
                        return;
                    case Type.NOTIFY:
                        self.deferred.notify(e.data.content);
                        return;
                }
            });

            // onerror
            this.worker.addEventListener("error", function(e) {
                self.deferred.reject(e);
            });
        };

        Thread.prototype.execute = function(obj) {
            if (this.isClosed) {
                throw new Error("thread has been closed.");
            }

            var json = JSON.stringify(obj);
            this.worker.postMessage(json);
            return this;
        };

        Thread.prototype.once = function(args) {
            var self = this;
            this.deferred.always(function() {
                self.terminate();
            });
            this.execute(args);
            this.isClosed = true;
            return this;
        };

        Thread.prototype.terminate = function() {
            window.URL.revokeObjectURL(this.blobUrl);
            this.worker.terminate();
            this.worker = null;
            this.deferred = null;
            this.blobUrl = null;
        };

        Thread.prototype.done = function(f) {
            this.deferred.done(f);
            return this;
        };

        Thread.prototype.fail = function(f) {
            this.deferred.fail(f);
            return this;
        };

        Thread.prototype.progress = function(f) {
            this.deferred.progress(f);
            return this;
        };

        return Thread;
    })();
})();

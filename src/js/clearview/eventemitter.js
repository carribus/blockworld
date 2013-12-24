define('clearview/eventemitter', function() {
    function CVEventEmitter() {
        this.listeners = {};
    }

    function alias(name) {
        return function() {
            return this[name].apply(this, arguments);
        }
    }

    CVEventEmitter.prototype.addEventListener = function(type, listener) {
        this.listeners[type] = this.listeners[type] || [];
        this.listeners[type].push({
            "listener": listener,
            "once": false
        });
    }
    CVEventEmitter.prototype.on = alias('addEventListener');

    CVEventEmitter.prototype.addOnceEventListener = function(type, listener) {
        this.listeners[type] = this.listeners[type] || [];
        this.listeners[type].push({
            "listener": listener,
            "once": true
        });
    }
    CVEventEmitter.prototype.once = alias('addOnceEventListener');

    CVEventEmitter.prototype.removeEventListener = function(type, listener) {
        if (this.listeners[type]) {
            var index = this.listeners[type].indexOf(listener);
            if ( index >= 0 ) {
                this.listeners[type].remove(index);
            }
        }
    }
    CVEventEmitter.prototype.off = alias('removeEventListener');

    CVEventEmitter.prototype.removeAllListeners = function(type) {
        if ( this.listeners[type] ) {
            delete this.listeners[type];
        }
    }

    CVEventEmitter.prototype.dispatchEvent = function(event) {
        var listener;

        if (this.listeners[event.type]) {
            var listenerCount = this.listeners[event.type].length;
            for ( var i = 0; i < listenerCount; i++ ) {
                listener = this.listeners[event.type][i];
                if ( listener.once === true ) {
                    this.listeners[event.type].remove(i--);
                }

                // if the event listener returned false, break out of the event emitting loop
                if ( listener.listener.call(this, event) === false ) {
                    break;
                }
            }
        }
    }

    return CVEventEmitter;
})
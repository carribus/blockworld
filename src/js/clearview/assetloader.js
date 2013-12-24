define('clearview/assetloader', ['clearview/eventemitter'], function(EventEmitter) {
    function CVAssetLoader() {
        EventEmitter.call(this);
        this.queue = {};
        this.assets = {};
        this.busy = false;
    }
    CVAssetLoader.prototype = Object.create(EventEmitter.prototype);
    CVAssetLoader.prototype.constructor = CVAssetLoader;

    CVAssetLoader.prototype.addToQueue = function(asset, assetName) {
        switch ( typeof asset ) {
            case 'String':
                assetName = assetName || asset;
                addAssetToQueue(this, asset, assetName);
                break;

            case 'object':
                addAssetListToQueue(this, asset);
                break;

            default:
                console.log('CVAssetLoader::addToQueue() called with unsupported parameter type (%s)', typeof asset);
                break;
        }
    }

    CVAssetLoader.prototype.fetch = function() {
        if ( this.busy === false ) {
            var _this = this;
            var asset;
            var assetCount = getQueueLength(this.queue);
            this.busy = true;

            // TODO: For now, the loop assumes that all assets are graphics. This needs to be changed in the future
            for ( asset in this.queue ) {
                this.assets[asset] = new Image();
                this.assets[asset].id = asset;

                this.assets[asset].onload = function() {
//                    _this.assets[this.id] = image;
                    if ( --assetCount == 0 ) {
                        _this.busy = false;
                        _this.dispatchEvent(new CustomEvent('complete', {"detail": {"assets": _this.assets}}));
                    }
                }
                this.assets[asset].onerror = function(e) {
                    console.error('image \'%s\' failed to load', this.id);
                    if ( --assetCount == 0 ) {
                        _this.busy = false;
                        _this.dispatchEvent(new CustomEvent('complete', {"detail": {"assets": _this.assets}}));
                    }
                }
                this.assets[asset].src = this.queue[asset];
                delete image;
            }
        } else {
            console.error('CVAssetLoader.fetch() called while queue is being fetched. Ignored.');
        }
    }

    function addAssetToQueue(loader, asset, assetName) {
        loader.queue[assetName] = asset;
    }

    function addAssetListToQueue(loader, assetList) {
        for ( var asset in assetList ) {
            addAssetToQueue(loader, assetList[asset], asset);
        }
    }

    function getQueueLength(queue) {
        var count = 0;
        for ( var item in queue ) {
            count++;
        }
        return count;
    }

    return CVAssetLoader;
})
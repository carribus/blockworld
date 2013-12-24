define('clearview/scene', ['clearview/layer'], function(CVLayer) {
    function CVScene(sceneName) {
        this.name = sceneName;
        this.layers = [];
    }

    CVScene.prototype.addLayer = function(layerName, zIndex) {
        zIndex = zIndex ? zIndex : this.layers.length+1;
        layerName = layerName || 'Layer' + this.layers.length + '_Z' + zIndex;

        var layer = new CVLayer(layerName, zIndex);
        layer.scene = this;
        this.layers.push(layer);
        return layer;
    }

    CVScene.prototype.render = function(context, dt) {
        var layerCount = this.layers.length;
        for ( var i = 0; i < layerCount; i++ ) {
            this.layers[i].render(context, dt);
        }
    }

    return CVScene;
})
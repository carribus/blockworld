define('clearview/layer', function() {
    function CVLayer(layerName, zIndex) {
        this.name = layerName;
        this.scene = null;
        this.zIndex = zIndex;
        this.offsetX = 0;
        this.offsetY = 0;
        this.objects = [];
    }

    CVLayer.prototype.addObject = function(object) {
        if ( object ) {
            object.layer = this;
            this.objects.push(object);
        }
    }

    CVLayer.prototype.removeAllObjects = function() {
        this.objects = [];
    }

    CVLayer.prototype.render = function(context, dt) {
        var objCount = this.objects.length;

        for ( var i = 0; i < objCount; i++ ) {
            this.objects[i].render(context, dt);
        }
    }

    return CVLayer;
})
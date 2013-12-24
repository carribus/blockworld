define('clearview/object', function() {
    function CVObject(objName) {
        this.name = objName;
        this.layer = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.fillStyle = "rgb(255, 255, 0);";
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.anchorX = 0;
        this.anchorY = 0;
    }

    CVObject.prototype.render = function(context, dt) {
        console.error('CVObject.render should not be invoked');
    }

    CVObject.prototype.startRender = function(context) {
        context.save();
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.rotation*Math.PI/180);
    }

    CVObject.prototype.endRender = function(context) {
        context.restore();
    }

    return CVObject;
})
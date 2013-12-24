define('clearview/bitmap', ['clearview/object'], function(CVObject) {
    function CVBitmap(image) {
        CVObject.call(this);
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.alpha = 1;
    }
    CVBitmap.prototype = Object.create(CVObject.prototype);
    CVBitmap.prototype.constructor = CVBitmap;

    CVBitmap.prototype.render = function(context, dt) {
        this.startRender(context);
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, -this.anchorX, -this.anchorY);
        this.endRender(context);
    }

    return CVBitmap;
})
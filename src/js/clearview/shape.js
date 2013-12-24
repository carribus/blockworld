define('clearview/shape', ['clearview/object'], function(CVObject) {
    CVShape.TYPE = {
        RECT: 0,
        CIRCLE: 1
    }

    function CVShape(type) {
        CVObject.call(this);
        this.type = type;
    }
    CVShape.prototype = Object.create(CVObject.prototype);
    CVShape.prototype.constructor = CVShape;

    CVShape.prototype.render = function(context, dt) {
        this.startRender(context);

        context.fillStyle = this.fillStyle;
        switch ( this.type ) {
            case    CVShape.TYPE.RECT:
                context.fillRect(0, 0, this.width, this.height);
                break;

            case    CVShape.TYPE.CIRCLE:
                break;

            default:
                console.error('Unknown shape type: %s', this.type);
        }
        this.endRender(context);
    }

    return CVShape;
})
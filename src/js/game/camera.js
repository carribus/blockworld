define('game/camera', ['game/world'], function() {
    function Camera(world) {
        this.world = world;
        this.position = {x: 0, y: 0};
        this.fov = {w: 0, h: 0};
    }

    Camera.prototype.initialize = function(posX, posY, fovW, fovH) {
        this.position.x = posX;
        this.position.y = posY;
        this.fov.w = fovW;
        this.fov.h = fovH;
    }

    Camera.prototype.getFOV = function() {
        return {w: this.fov.w, h: this.fov.h};
    }

    Camera.prototype.moveBy = function(moveByX, moveByY) {
        this.position.x += moveByX;
        this.position.y += moveByY;

        if ( this.position.y - this.fov.h/2 < 0 ) {
            this.position.y = Math.ceil(this.fov.h/2);
        }

        console.log('New camera position: %s, %s', this.position.x, this.position.y);
    }

    Camera.prototype.getVisibleBlocks = function() {
        var blocks = [];
        var worldDim = this.world.getDimensions();
        var startX = Math.floor(this.position.x - this.fov.w/2);
        var startY = Math.floor(this.position.y - this.fov.h/2);
        var lastX, lastY;

        // world wrapping logic
//        x = x < 0 ? worldDim.width + x : x > worldDim.width ? x - worldDim.width : x;
        startY = startY < 0 ? 0 : startY > worldDim.height ? startY - worldDim.height : startY;

        lastX = startX + this.fov.w;
        lastY = startY + this.fov.h;

        for ( var y = startY; y <= lastY; y++ ) {
            for ( var x = startX; x <= lastX; x++ ) {
                blocks[(y-startY)*this.fov.w+(x-startX)] = this.world.getBlock(x, y);
            }
        }

        return blocks;

    }

    return Camera;
})
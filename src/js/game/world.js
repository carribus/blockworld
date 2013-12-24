define('game/world', function() {
    'use strict';
    var worldDimensions = {width: 1024, height: 1024};
    var maxLandHeight = 1015;
    var minLandHeight = 1000;
    var maxLandHeightVariance = 3;

    function World() {
        this.blocks;
    }

    World.BlockTypes = {
        Empty: -1,
        Grass: 0,
        Earth: 1,
        Earth2: 2,
        Earth3: 3,
        Earth4: 4
    }

    World.prototype.getDimensions = function() {
        return { width: worldDimensions.width, height: worldDimensions.height };
    }

    World.prototype.getWidth = function() {
        return worldDimensions.width;
    }

    World.prototype.getHeight = function() {
        return worldDimensions.height;
    }

    World.prototype.getBlock = function(x, y) {
        var block = null;
        if ( x >= 0 && x < worldDimensions.width && y >= 0 && y < worldDimensions.height) {
            block = this.blocks[y * worldDimensions.width + x];
        }
        return block;
    }

    World.prototype.createWorld = function() {
        var x, y;
        var lastLandHeight = maxLandHeight;
        var landHeightTrend = 0;
        var currentLandHeight;

        this.blocks = initializeBlockArray();

        // create the world one column at a time
        for ( x = 0; x < worldDimensions.width; x++ ) {
            // calculate a landHeight for this column
            currentLandHeight = Math.round(lastLandHeight + (maxLandHeightVariance*2*Math.random())-maxLandHeightVariance);
            if ( currentLandHeight > maxLandHeight ) {
                currentLandHeight = maxLandHeight;
            }
            if ( currentLandHeight < minLandHeight ) {
                currentLandHeight = minLandHeight;
            }
            landHeightTrend += (lastLandHeight - currentLandHeight) / (x+1);

            for ( y = worldDimensions.height - currentLandHeight; y < worldDimensions.height; y++ ) {
                var index = y * worldDimensions.width + x;

                if ( y == worldDimensions.height - currentLandHeight ) {
                    this.blocks[index] = World.BlockTypes.Grass;
                } else {
                    if ( y <= 64 )              this.blocks[index] = World.BlockTypes.Earth;
                    if ( y > 64 && y <= 256 )    this.blocks[index] = World.BlockTypes.Earth2;
                    if ( y > 256 && y <= 768 )    this.blocks[index] = World.BlockTypes.Earth3;
                    if ( y > 768 && y <= 1024)    this.blocks[index] = World.BlockTypes.Earth4;

                }
            }
        }
    }

    function initializeBlockArray() {
        var array;
        var length = worldDimensions.width * worldDimensions.height;
        array = [];
        for ( var index = 0; index < length; index++ ) {
            array[index] = World.BlockTypes.Empty;
        }

        return array;
    }

    return World;
})
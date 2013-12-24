require.config({
    paths: {
        "clearview": 'clearview',
        "game": 'game'
    }
})

require([
    'clearview/clearview',
    'clearview/shape',
    'clearview/bitmap',
    'game/assets',
    'game/player',
    'game/world',
    'game/camera'
], function(ClearView, CVShape, CVBitmap, Assets, Player, World, Camera) {
    console.log('app.js running');

    var device = ClearView.initialize();
    var canvas = device.canvas;
    var scenes = createScenes(ClearView);
    var logo;
    var player = new Player();
    var world = new World();
    var camera;
    var blockWidth = 32, blockHeight = 32;

    world.createWorld();

    // initialise the camera
    camera = initCamera(world);

    var assetLoader = ClearView.createAssetLoader();
    assetLoader.addToQueue(Assets.gameAssets);
    assetLoader.addEventListener('complete', onAssetLoadComplete);
    assetLoader.fetch();

    setInterval(function() {
        var now = new Date().getTime();
        logo.scaleX = 1+Math.sin(now/1000)/2;
        logo.scaleY = 1+Math.sin(now/1000)/2;
    }, 17)

    function createScenes(ClearView) {
        var scenes = {
            MenuScene: ClearView.createScene('menuScene'),
            MainScene: ClearView.createScene('mainScene')
        }

        return scenes;
    }

    function initCamera(world) {
        var camera = new Camera(world);
        var dimensions = world.getDimensions();

        camera.initialize(dimensions.width/2,
                          10,
                          Math.ceil(canvas.width / blockWidth)+1,
                          Math.ceil(canvas.height / blockHeight)+1);

        return camera;
    }

    function onAssetLoadComplete(e) {
        ClearView.setScene(scenes.MainScene);

        var layerBg = scenes.MainScene.addLayer('background');
        var layerFg = scenes.MainScene.addLayer('foreground');
        var layerLogo = scenes.MainScene.addLayer('logo');

        // background fill
        var o = new CVShape(CVShape.TYPE.RECT);
        o.x = o.y = 0;
        o.width = canvas.width;
        o.height = canvas.height;
        o.fillStyle = 'rgb(16, 32, 64)';
        layerBg.addObject(o);

        // logo
        logo = new CVBitmap(assetLoader.assets['logo']);
        logo.x = canvas.width/2;
        logo.y = canvas.height/2;
        logo.anchorX = logo.image.width/2;
        logo.anchorY = logo.image.height/2;
        logo.alpha = 0.25;
        layerLogo.addObject(logo);

        // render the world
        updateWorldView(layerFg);

        window.addEventListener('keydown', function(e) {
            var updateNeeded = false;

            switch (e.keyCode) {
                case    37:         // left
                case    65:         // 'a'
                    camera.moveBy(-1, 0);
                    updateNeeded = true;
                    break;

                case    39:         // right
                case    68:e        // 'd'
                    camera.moveBy(1, 0);
                    updateNeeded = true;
                    break;

                case    38:         // up
                    camera.moveBy(0, -1);
                    updateNeeded = true;
                    break;

                case    40:         // down
                    camera.moveBy(0, 1);
                    updateNeeded = true;
                    break;
            }

            if ( updateNeeded ) {
                updateWorldView(layerFg);
            }
        })

        /*
                var img = assetLoader.assets['grass_top'];
                for ( var i = 0; i < (canvas.width / img.width); i++ ) {
                    o = new CVBitmap(img);
                    o.x = i * img.width;
                    o.y = 10*img.height;;
                    layerFg.addObject(o);
                }
        */
        ClearView.run();
    }

    function updateWorldView(layer) {
        var img;
        var dimensions = camera.getFOV();
        var x, y, nextScreenX = 0, nextScreenY = 0;
        var visibleBlocks = camera.getVisibleBlocks();
        var largestHeight = 0;
        var blockSprite;

        layer.removeAllObjects();

        for ( y = 0; y < dimensions.h; y++ ) {
            for ( x = 0; x < dimensions.w; x++ ) {
//                switch ( world.getBlock(x, y) ) {
                switch ( visibleBlocks[y * dimensions.w + x] ) {
                    case    World.BlockTypes.Empty:
                        img = assetLoader.assets['sky'];
                        break;

                    case    World.BlockTypes.Earth:
                        img = assetLoader.assets['earth'];
                        break;

                    case    World.BlockTypes.Earth2:
                        img = assetLoader.assets['earth2'];
                        break;

                    case    World.BlockTypes.Earth3:
                        img = assetLoader.assets['earth3'];
                        break;

                    case    World.BlockTypes.Earth4:
                        img = assetLoader.assets['earth4'];
                        break;

                    case    World.BlockTypes.Grass:
                        img = assetLoader.assets['grass_top'];
                        break;
                }

                blockSprite = new CVBitmap(img);
                blockSprite.x = nextScreenX;
                blockSprite.y = nextScreenY;
                layer.addObject(blockSprite);

                nextScreenX += img.width * blockSprite.scaleX;
                largestHeight = largestHeight > img.height*blockSprite.scaleY ? largestHeight : img.height*blockSprite.scaleY;
            }
            nextScreenX = 0;
            nextScreenY += largestHeight;
            largestHeight = 0;
        }
    }
})
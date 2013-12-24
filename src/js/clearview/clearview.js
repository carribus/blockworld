define('clearview/clearview', ['clearview/scene', 'clearview/assetloader'], function(Scene, AssetLoader) {

    function createCanvas(parent) {
        var device = {};
        device.canvas = document.createElement('canvas');
        device.canvas.id = 'ClearViewCanvas';
        device.canvas.width = window.innerWidth;
        device.canvas.height = window.innerHeight;
        device.context = device.canvas.getContext('2d');
        if ( !device.context ) {
            throw 'ClearView::initialise() -> createCanvas() : 2D Context could not be retrieved for Canvas';
        }
        parent.appendChild(device.canvas);

        return device;
    }

    return {
        verboseLogging: true,
        parentElement: null,
        device: null,
        running: false,
        lastTick: null,
        targetFPS: 30,
        repeater: null,
        scenes: {},
        activeScene: null,

        initialize: function(options) {
            if ( this.device ) {
                throw 'ClearView::initialise() called for a second time.';
            }

            options = options || {};
            this.parentElement = options.parentElement || document.body;


            // create the canvas
            this.device = createCanvas(this.parentElement);
            this.verboseLogging ?
                console.log('ClearView initialised:\n' +
                    '\tparentElement: %s\n' +
                    '\tdevice.canvas: %s\n' +
                    '\tdevice.context: %s',
                    this.parentElement,
                    this.device.canvas,
                    this.device.context)
                :
                !null;

            // listen to the window resize
            window.addEventListener('resize', this.onWindowResize.bind(this));

            // listen to keyboard events
            this.parentElement.addEventListener('keydown', this.onKeyDown.bind(this));
            this.parentElement.addEventListener('keyup', this.onKeyUp.bind(this));

            // listen to mouse events
            this.device.canvas.addEventListener('click', this.onClick.bind(this));

            // listen to touch events

            return this.device;
        }
        ,
        createAssetLoader: function() {
            return new AssetLoader();
        }
        ,
        setFPS: function(fps) {
            this.targetFPS = fps;
        }
        ,
        setScene: function(scene) {
            if ( !scene || !(scene instanceof Scene) || scene == this.activeScene) {
                return false;
            }

            this.activeScene = scene;
        }
        ,
        run: function() {
            this.running = true;
            this.repeater = this.repeater || this.onTick.bind(this);
            requestAnimationFrame(this.repeater);
        }
        ,
        pause: function() {

        }
        ,
        createScene: function(sceneName) {
            this.scenes[sceneName] = new Scene(sceneName);
            return this.scenes[sceneName];
        }
        ,
        onWindowResize: function() {
            if ( this.device && this.device.canvas ) {
                this.device.canvas.width = window.innerWidth;
                this.device.canvas.height = window.innerHeight;
            }
        }
        ,
        onKeyDown: function(e) {
            console.log('KeyDown: %s', e.keyCode);
        }
        ,
        onKeyUp: function(e) {
            console.log('KeyUp: %s', e.keyCode);
        }
        ,
        onClick: function(e) {
            console.log('Click: %s (%s,%s)', e, e.x, e.y);
        }
        ,
        onTick: function() {
            requestAnimationFrame(this.repeater);
            var now = new Date().getTime();
            var dt = now - (this.lastTick || now);
            this.lastTick = now;

            if (this.activeScene) {
                this.activeScene.render(this.device.context, dt);
            }

        }
    }
})
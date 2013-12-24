define('game/player', ['game/playermodel', 'game/playersprite'], function(PlayerModel, PlayerSprite) {
    function Player() {
        this.model = new PlayerModel();
        this.sprite = new PlayerSprite();
    }

    return Player;
})
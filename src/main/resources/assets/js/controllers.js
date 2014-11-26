var game = angular.module('carcassonneGame', ['ngRoute'])
        .config(['$routeProvider', '$locationProvider',
            function ($routeProvider, $locationProvider) {
                $routeProvider
                        .when('/lobby', {
                            templateUrl: 'partials/lobby.html',
                            controller: 'LobbyCtrl'
                        })
                        .when('/game/:gameId', {
                            templateUrl: 'partials/game.html',
                            controller: 'GameCtrl'
                        })
                        .when('/sandbox', {
                            templateUrl: 'partials/sandbox.html',
                            controller: 'SandboxCtrl'
                        })
                        .otherwise({redirectTo: '/lobby'})
//https://docs.angularjs.org/api/ngRoute/directive/ngView
            }]);

function LobbyCtrl($scope, $http)
{
    $http.get('/game').success(function (data) {
        console.log(data)
        $scope.games = data;
    });
    $scope.newGame = function ()
    {
        console.log('new game');
        $http.post('/game', {'name': 'game'});
    }
}



function GameCtrl($scope, $http, $routeParams)
{
    $http.get('/game/' + $routeParams.gameId).success(function (data) {
        console.log(data);
        $scope.game = data;
        board.scale.x = 0.5;
        board.scale.y = 0.5;
        stage.addChild(board);
    });


    $scope.initialize = function (stage)
    {

        var assetsToLoader = ["images/baseTileSetSpriteSheet.json"]
        var loader = new PIXI.AssetLoader(assetsToLoader);
//        loader.onComplete = onAssetsLoaded;
        loader.load();

        var tiles = [];
        var tileFrames = ["A.png", "B.png", "C.png", "D.png", "E.png", "F.png", "G.png", "H.png", "I.png", "J.png", "K.png", "L.png", "M.png", "N.png", "O.png", "P.png", "Q.png", "R.png", "S.png", "T.png", "U.png", "V.png", "W.png", "X.png"];


//        function onAssetsLoaded()
//        {
//            for (var row = 0; row < 6; row++)
//            {
//                for (var col = 0; col < 4; col++)
//                {
//                    var frameName = tileFrames[(row * 6) + col];
//                    var tile = PIXI.Sprite.fromFrame(frameName);
//                    tile.position.x = row * 175 + 87;
//                    tile.position.y = col * 175 + 87;
//                    tile.anchor.x = 0.5;
//                    tile.anchor.y = 0.5;
//                    tiles.push(tile);
//                    stage.addChild(tile);
//
//                }
//            }
//        }


        stage.click = function (data) {
            $scope.x = data.global.x;
            $scope.y = data.global.y;
            var tileFrame = Math.floor(Math.random() * 24);


            var edgeSprite = PIXI.Sprite.fromFrame(tileFrames[tileFrame]);
            edgeSprite.anchor.x = 0.5;
            edgeSprite.anchor.y = 0.5;
            edgeSprite.position.x = Math.floor(data.global.x / 175) * 175 + 88;
            edgeSprite.position.y = Math.floor(data.global.y / 175) * 175 + 88;
            edgeSprite.rotation = Math.PI / 2;
            edgeSprite.setInteractive(true);
            edgeSprite.click = function (data) {
                edgeSprite.rotation += Math.PI / 2;
            }

            $scope.stage.addChild(edgeSprite);
            console.log(data);
        }


        var stageWidth = $scope.width;
        var stageHeight = $scope.height;
        var tileDim = 175;
        var vertLines = stageWidth / tileDim;
        var horLines = stageHeight / tileDim;
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1, 0xFFFFFF, 1.0);
        for (var i = 1; i <= vertLines; i++)
        {
            graphics.moveTo(i * tileDim, 0);
            graphics.lineTo(i * tileDim, stageHeight);
        }
        for (var i = 1; i <= horLines; i++)
        {
            graphics.moveTo(0, i * tileDim);
            graphics.lineTo(stageWidth, i * tileDim);
        }
        graphics.endFill();
        stage.addChild(graphics);

    }
}
function SandboxCtrl($scope, $http, $routeParams)
{
    $scope.x = 0.0;
    $scope.y = 0.0;



    function refreshBoard()
    {
        $http.get('/sandbox').success(function (data) {
            if ($scope.stage.children.length > 0)
                $scope.stage.removeChildren();
            for (var i in data.placedTiles)
            {
                var tileInfo = data.placedTiles[i];
                var tileSprite = PIXI.Sprite.fromFrame(tileInfo.tileName);
                tileSprite.anchor.x = 0.5;
                tileSprite.anchor.y = 0.5;
                tileSprite.position.x = tileInfo.position.x * 175 + 88;
                tileSprite.position.y = tileInfo.position.y * 175 + 88;
                tileSprite.setInteractive(true);
                tileSprite.click = function (data) {
                    this.rotation += Math.PI / 2;
                }

                $scope.stage.addChild(tileSprite);
            }
            for (var i in data.placeableLocations)
            {
                var position = data.placeableLocations[i];
                var edgeSprite = new PIXI.Sprite(new PIXI.Texture(PIXI.Texture.fromImage("images/PlaceableTile.png")));
                edgeSprite.anchor.x = 0.5;
                edgeSprite.anchor.y = 0.5;
                edgeSprite.position.x = position.x * 175 + 88;
                edgeSprite.position.y = position.y * 175 + 88;
                edgeSprite.setInteractive(true);
                edgeSprite.click = function (data) {
                    var tileFrame = Math.floor(Math.random() * 24);
                    var content = 'tileName=' + $scope.tileFrames[tileFrame] + '&x=' + Math.floor(data.global.x / 175) + '&y=' + Math.floor(data.global.y / 175);
                    $http.post('/sandbox/placeTile', JSON.stringify({tileName: $scope.tileFrames[tileFrame], x: Math.floor(data.global.x / 175), y: Math.floor(data.global.y / 175)})).success(refreshBoard);

                    console.log(data);
                }
                edgeSprite.touchstart = edgeSprite.click;

                $scope.stage.addChild(edgeSprite);

            }
            console.log(data);
        });
    }

    $scope.initialize = function (stage)
    {
        var assetsToLoader = ["images/baseTileSetSpriteSheet.json"]
        var loader = new PIXI.AssetLoader(assetsToLoader);
//      loader.onComplete = onAssetsLoaded;
        loader.load();

        var tiles = [];
        $scope.tileFrames = ["A.png", "B.png", "C.png", "D.png", "E.png", "F.png", "G.png", "H.png", "I.png", "J.png", "K.png", "L.png", "M.png", "N.png", "O.png", "P.png", "Q.png", "R.png", "S.png", "T.png", "U.png", "V.png", "W.png", "X.png"];

//        function onAssetsLoaded()
//        {
//            for (var row = 0; row < 6; row++)
//            {
//                for (var col = 0; col < 4; col++)
//                {
//                    var frameName = tileFrames[(row * 6) + col];
//                    var tile = PIXI.Sprite.fromFrame(frameName);
//                    tile.position.x = row * 175 + 87;
//                    tile.position.y = col * 175 + 87;
//                    tile.anchor.x = 0.5;
//                    tile.anchor.y = 0.5;
//                    tiles.push(tile);
//                    stage.addChild(tile);
//
//                }
//            }
//        }



//        stage.click = click;
//        stage.touchstart = click;

        var stageWidth = $scope.width;
        var stageHeight = $scope.height;
        var tileDim = 175;
        var vertLines = stageWidth / tileDim;
        var horLines = stageHeight / tileDim;
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.lineStyle(1, 0xFFFFFF, 1.0);
        for (var i = 1; i <= vertLines; i++)
        {
            graphics.moveTo(i * tileDim, 0);
            graphics.lineTo(i * tileDim, stageHeight);
        }
        for (var i = 1; i <= horLines; i++)
        {
            graphics.moveTo(0, i * tileDim);
            graphics.lineTo(stageWidth, i * tileDim);
        }
        graphics.endFill();
        stage.addChild(graphics);
        refreshBoard();
    }

}

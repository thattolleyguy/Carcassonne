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
    $scope.newGame=function()
    {
        console.log('new game');
        $http.post('/game',{'name':'game'});
    }
}



function GameCtrl($scope, $http, $routeParams)
{
    var board = new PIXI.DisplayObjectContainer();
    $http.get('/game/' + $routeParams.gameId).success(function (data) {
        console.log(data);
        $scope.game = data;
        data.board.forEach(function (value)
        {
            value.forEach(function (tile) {

                var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/" + tile.tileType + ".png"));
                sprite.anchor.x = 0.5;
                sprite.anchor.y = 0.5;
                sprite.position.x = (tile.x * 150) + 75;
                sprite.position.y = (tile.y * 150) + 75;
                switch (tile.rotation)
                {
                    case 'WEST':
                        sprite.rotation = -Math.PI / 2;
                        break;
                    case 'EAST':
                        sprite.rotation = Math.PI / 2;
                        break;
                    case 'SOUTH':
                        sprite.rotation = Math.PI;
                        break;

                }
                board.addChild(sprite)

                if (tile.northEdge !== 'EMPTY')
                {
                    var edgeSprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/" + tile.northEdge + ".png"));
                    edgeSprite.anchor.x = 0.5;
                    edgeSprite.anchor.y = 0.5;
                    edgeSprite.position.x = (tile.x * 150) + 75;
                    edgeSprite.position.y = (tile.y * 150) + 75;

                    board.addChild(edgeSprite)
                }
                if (tile.southEdge !== 'EMPTY')
                {
                    var edgeSprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/" + tile.southEdge + ".png"));
                    edgeSprite.anchor.x = 0.5;
                    edgeSprite.anchor.y = 0.5;
                    edgeSprite.position.x = (tile.x * 150) + 75;
                    edgeSprite.position.y = (tile.y * 150) + 75;
                    edgeSprite.rotation = Math.PI;

                    board.addChild(edgeSprite)
                }
                if (tile.westEdge !== 'EMPTY')
                {
                    var edgeSprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/" + tile.westEdge + ".png"));
                    edgeSprite.anchor.x = 0.5;
                    edgeSprite.anchor.y = 0.5;
                    edgeSprite.position.x = (tile.x * 150) + 75;
                    edgeSprite.position.y = (tile.y * 150) + 75;
                    edgeSprite.rotation = -Math.PI / 2;

                    board.addChild(edgeSprite)
                }
                if (tile.eastEdge !== 'EMPTY')
                {
                    var edgeSprite = new PIXI.Sprite(PIXI.Texture.fromImage("images/" + tile.eastEdge + ".png"));
                    edgeSprite.anchor.x = 0.5;
                    edgeSprite.anchor.y = 0.5;
                    edgeSprite.position.x = (tile.x * 150) + 75;
                    edgeSprite.position.y = (tile.y * 150) + 75;
                    edgeSprite.rotation = Math.PI / 2;

                    board.addChild(edgeSprite)
                }


            })
            board.pivot.x = board.width / 2;
            board.pivot.y = board.height / 2;
            board.position.x = .5 * board.width / 2;
            board.position.y = .5 * board.height / 2;
//			board.rotation = -Math.PI / 2;

        })
        board.scale.x = 0.5;
        board.scale.y = 0.5;
        stage.addChild(board);
    });


    var stage = new PIXI.Stage(0x000000);
    var renderer = PIXI.autoDetectRenderer(1920, 1080);

    document.getElementById('game').appendChild(renderer.view);

    requestAnimFrame(animate);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(stage);
    }
}
function SandboxCtrl($scope, $http, $routeParams)
{
    $scope.x = 0.0;
    $scope.y = 0.0;
    $scope.click = function (data) {
        $scope.x = data.global.x;
        $scope.y = data.global.y;
        var tileX = Math.floor(Math.random() * 6);
        var tileY = Math.floor(Math.random() * 4);


        var edgeSprite = new PIXI.Sprite(new PIXI.Texture(PIXI.Texture.fromImage("images/BaseTileSet.png"), new PIXI.Rectangle(tileX * 180, tileY * 180, 175, 175)));
        edgeSprite.anchor.x = 0.5;
        edgeSprite.anchor.y = 0.5;
        edgeSprite.position.x = data.global.x;
        edgeSprite.position.y = data.global.y;
        edgeSprite.rotation = Math.PI / 2;
        edgeSprite.setInteractive(true);
        edgeSprite.click = function (data) {
            edgeSprite.rotation += Math.PI / 2;
        }

        $scope.stage.addChild(edgeSprite);
        console.log(data);
    };
}

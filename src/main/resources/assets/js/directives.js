'use strict';

angular.module('carcassonneGame')
        .directive('pixi', function ($parse) {
            return {
                // template: '<canvas></canvas>',
                restrict: 'A',
                scope: false,
                controller: function postLink($scope, $element, $attrs) {

                    var self = this,
                            stageAttr = $parse($attrs.pixi),
                            stage = stageAttr($scope),
                            renderFunc = $scope.$eval($attrs.pixiRender);

                    if (!stage) {
                        // create a new instance of a pixi stage
                        stage = new PIXI.Stage($scope.$eval($attrs.pixiBackground || '0'));
                        stageAttr.assign($scope, stage);


                    }

                    var antialias = $scope.$eval($attrs.pixiAntialias || 'false'),
                            transparent = $scope.$eval($attrs.pixiTransparent || 'false'),
                            rendererType = $scope.$eval($attrs.pixiRenderer || 'auto'),
                            renderer;
                    // create a renderer instance.
                    switch (rendererType) {
                        case 'canvas':
                            renderer = new PIXI.CanvasRenderer($element.width(), $element.height(), $element[0], transparent);
                            break;
                        case 'webgl':
                            try {
                                renderer = new PIXI.WebGLRenderer($element.width(), $element.height(), $element[0], transparent, antialias);
                            } catch (e) {
                                $scope.$emit('pixi.webgl.init.exception', e);
                                return;
                            }
                            break;
                        default:
                            renderer = PIXI.autoDetectRenderer(1920, 1080, $element[0], antialias, transparent);
                            $scope.width = 1920;
                            $scope.height = 1080;
                    }

                    this.render = function render(force) {

                        var doRender = true;
                        if (renderFunc)
                            doRender = renderFunc(stage, renderer);

                        // render the stage   
                        if (force || doRender !== false)
                            renderer.render(stage);
                    };

                    function renderLoop() {
                        self.render();
                        requestAnimFrame(renderLoop);
                    }

                    requestAnimFrame(renderLoop);

                    this.getStage = function () {
                        return stage;
                    };

                    this.getRenderer = function () {
                        return renderer;
                    };

                    this.getContext = function () {
                        return renderer.gl ? renderer.gl : renderer.context;
                    };
                    var board = new PIXI.DisplayObjectContainer();
                    board.setInteractive(true);
                    board.width = 1920;
                    board.height = 1080;
                    board.position.x = .5 * board.width / 2;
                    board.position.y = .5 * board.height / 2;
                    stage.click = function (data)
                    {
                        $scope.click(data);
                    }
                    stage.addChild(board);

                    // $($window).resize(function() {
                    //     renderer.resize(element.width(), element.height())                
                    // })

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
            };
        });
'use strict';

angular.module('carcassonneGame')
        .directive('pixi', function ($parse) {
            return {
                // template: '<canvas></canvas>',
                restrict: 'A',
                transclude:true,
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
                    
                    $scope.initialize(stage);
                }
            };
        });
import createScreenSizeController from './controllers/screenSize';
import createKeyboardController from './controllers/keyboard';
import createMouseController from './controllers/mouse';
import createTimeController from './controllers/time';
import createThingsManager from './managers/thingsManager';
import createEnemiesManager from './managers/enemiesManager';
import createStrikeManager from './managers/strikeManager';
import createWeaponsManager from './managers/weaponsManager';
import createIdsManager from './managers/idsManager';
import createScoreManager from './managers/scoreManager';
import createInformationBoard from './informationBoard';
import createCanvas from './canvas';
import createPlayer from './player';
import { stopGame } from './actions';
import config from './config';

export default function Scene(store) {

  const sceneDiv = document.createElement('div');
  const screenSizeController = createScreenSizeController();
  const keyboardController = createKeyboardController();
  const mouseController = createMouseController();
  const timeController = createTimeController();

  let canvas;
  let player;
  let enemiesManager;
  let thingsManager;
  let strikeManager;
  let weaponsManager;
  let idsManager;
  let scoreManager;
  let informationBoard;

  this.init = function (textures) {
    sceneDiv.innerHTML = '';

    idsManager = createIdsManager();
    scoreManager = createScoreManager();

    weaponsManager = createWeaponsManager({
      ammunitionCount: 30,
    });

    canvas = createCanvas({
      screenSizeController,
      height: config.canvas.height,
      width: config.canvas.width,
      parent: sceneDiv,
    });

    thingsManager = createThingsManager({
      canvas,
      textures,
      idsManager,
    });

    enemiesManager = createEnemiesManager({
      canvas,
      textures,
      timeController,
      thingsManager,
      idsManager,
    });

    player = createPlayer({
      ...config.player,
      texture: textures.player,
      canvas,
      keyboardController,
      mouseController,
      screenSizeController,
      thingsManager,
      weaponsManager,
      scoreManager,
    });

    strikeManager = createStrikeManager({
      mouseController,
      getPlayerAngle: player.getAngle,
      getPlayerPosition: player.getPosition,
      enemiesManager,
      weaponsManager,
    });

    informationBoard = createInformationBoard({
      canvas,
      weaponsManager,
      scoreManager,
    });
  };

  function gameLoop() {
    timeController.makeTimeIteration();
    const deltaTime = timeController.getDeltaTime();

    canvas.clear();

    enemiesManager.update(deltaTime);
    thingsManager.updateThings(deltaTime);
    player.update(deltaTime);

    enemiesManager.drawEnemies();
    thingsManager.drawThings();
    player.draw();
    informationBoard.displayInfo();

    if (enemiesManager.hasEnemyCrossedCanvas()) {
      store.dispatch(stopGame(scoreManager.getScore()));
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  this.render = function () {
    return sceneDiv;
  };

  this.startGame = function () {
    timeController.start();
    gameLoop();
  }
}
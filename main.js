'use strict';

const main = () => {
  
  let leftPressed = false;
  let rightPressed = false;
  //let game;

  const soundsStorage = localStorage.getItem('sounds');
  if (!soundsStorage) {
    localStorage.setItem('sounds', JSON.stringify('true'));
  }

  const musicStorage = localStorage.getItem('music');
  if (!musicStorage) {
    localStorage.setItem('music', JSON.stringify('true'));
  }

  const buildDom = (html) => {
    const main = document.querySelector('main');
    main.innerHTML = html; 
    return main;
  };

  const buildSplashScreen = () => {
    const splashScreen = buildDom(`
    
    <section class="splash-screen">
    <div class="text-splash">
    <h1 class="title-splash">Castlemaze</h1>
    <h2 class="subtitle-splash">Save the kids and exit the castle alive!</h2>
    </div>
    <button class="button" id="start-button">Start</button>
    <button class="button" id="instructions-button">Instructions</button>
    </section>
    `);

    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', buildGameScreen);

    const instructionsButton = document.getElementById('instructions-button');
    instructionsButton.addEventListener('click', buildInstructionsScreen);
  };

  const buildInstructionsScreen = () => {
    const splashScreen = buildDom(`
   
    <section class="splash-screen">
    <div class="text-splash">
    <h1 class="title-splash">Castlemaze</h1>
    <ul>
    <li>To move use the arrows left and right</li>
    <li>To jump use the spacebar</li>
    <li>Have fun!</li>
    </ul>
    </div>
    <button class="button">Back</button>
    </section>
   
   `);

    const startButton = document.querySelector('button');
    startButton.addEventListener('click', buildSplashScreen);

  };

  const buildGameScreen = () => {
    const gameScreen = buildDom(`
      <section class="game-screen">
        <div class="interface">
          <div id="kids-text">Kids: 0/3</div> 
          <div class="interface-buttons">
            <button id="music-button" class="button-interface">Music</button>
            <button id="sound-button" class="button-interface">Sounds</button>
          </div>
        </div>
        <canvas></canvas>
        <div class="floor"> </div>
        <audio controls autoplay id="music-audio"><source src="audio/music.mp3"></audio>
      </section>
    `);

    // const quitButton = document.querySelector('button');
    // quitButton.addEventListener('click', buildGameOverScreen);

    const width = document.querySelector('.game-screen').offsetWidth;
    const height = document.querySelector('.game-screen').offsetHeight;

    const canvasElement = document.querySelector('canvas');
    canvasElement.setAttribute('width', width);
    canvasElement.setAttribute('height', height);

    const musicButton = document.getElementById('music-button');
    const soundButton = document.getElementById('sound-button');
    
    
    

    const muteMusic = (event) =>{
      const music = document.getElementById('music-audio');
      const musicButton = document.getElementById('music-button');
      const isMusic = JSON.parse(localStorage.getItem('music'));
      console.log(isMusic);
      if (event.clientX !==0){
        if (isMusic === 'true'){
          music.muted = true;
          musicButton.className = "button-disabled";
          localStorage.setItem('music', JSON.stringify('false'));
         
        }else{
          music.muted = false;
          musicButton.className = "button-interface";
          localStorage.setItem('music', JSON.stringify('true'));
        }
      }
      
    };

    const muteSound = () =>{
      const soundButton = document.getElementById('sound-button');
      const areSounds = JSON.parse(localStorage.getItem('sounds'));
      if (event.clientX !==0){
        if (areSounds ==="false"){
          game.audioGrowl.muted = false;
          game.audioWin.muted = false;
          game.audioMeat.muted = false;
          game.audioSwoosh.muted = false;
          game.spikes.forEach(function(e){
            e.audioSteel.muted = false;
          });
          game.audioMonster.muted = false;
          soundButton.className = "button-interface";
          localStorage.setItem('sounds', JSON.stringify('true'));
          
        }else{
          game.audioGrowl.muted = true;
          game.audioWin.muted = true;
          game.audioMeat.muted = true;
          game.audioSwoosh.muted = true;
          game.spikes.forEach(function(e){
            e.audioSteel.muted = true;
          });
          game.audioMonster.muted = true;
          soundButton.className = "button-disabled";
          localStorage.setItem('sounds', JSON.stringify('false'));
          
        }
      }
    };

    const checkAudio = () =>{
      const music = document.getElementById('music-audio');
      const musicButton = document.getElementById('music-button');
      const isMusic = JSON.parse(localStorage.getItem('music'));
      const soundButton = document.getElementById('sound-button');
      const areSounds = JSON.parse(localStorage.getItem('sounds'));
      if (isMusic === 'false'){
        music.muted = true;
        musicButton.className = "button-disabled";  
      }else{
        music.muted = false;
        musicButton.className = "button-interface";
      }


      if (areSounds ==="true"){
        game.audioGrowl.muted = false;
        game.audioWin.muted = false;
        game.audioMeat.muted = false;
        game.audioSwoosh.muted = false;
        game.spikes.forEach(function(e){
          e.audioSteel.muted = false;
        });
        game.audioMonster.muted = false;
        soundButton.className = "button-interface";
      }else{
        game.audioGrowl.muted = true;
        game.audioWin.muted = true;
        game.audioMeat.muted = true;
        game.audioSwoosh.muted = true;
        game.spikes.forEach(function(e){
          e.audioSteel.muted = true;
        });
        game.audioMonster.muted = true;
        soundButton.className = "button-disabled";
      }
    };
    window.onload = function(){};
    const game = new Game(canvasElement);
    checkAudio();
    game.startLoop();
    game.winCallback(buildWinScreen);
    game.gameOverCallback(buildGameOverScreen);

    const setPlayerDirection = () => {
      if(event.code === 'ArrowLeft'){
        game.player.setDirection(-1);
        game.player.x --;
        leftPressed = true;
      } else if(event.code ==='ArrowRight'){
        game.player.setDirection(1);
        game.player.x ++;
        rightPressed = true;
      }
    };

    const stopPlayer = () => {
      if(event.code === 'ArrowLeft'){
        if(rightPressed){
          game.player.setDirection(1);
        }else{
          game.player.setDirection(0);
        }
        leftPressed = false;
      } else if (event.code === 'ArrowRight'){
        if(leftPressed){
          game.player.setDirection(-1);
        }else{
          game.player.setDirection(0);
        }
        rightPressed = false;
      }
    };

    const jumpPlayer = () => {
      if (event.code === 'Space' && game.player.isColliding === true){
        game.player.jumpSpeed = -10;
        game.player.y = game.player.y - 1;
        game.player.isColliding = false;
      }
    }
    
   
  
    document.addEventListener('keydown', setPlayerDirection);
    document.addEventListener('keyup', stopPlayer);
    document.addEventListener('keydown', jumpPlayer);

    soundButton.addEventListener('click', muteSound);
    musicButton.addEventListener('click', muteMusic);

  };

  const buildGameOverScreen = (numberKids) => {
    const splashScreen = buildDom(`
    <section class="game-over-screen">
    <div class="text-game-over">
    <h1 class="title-splash">You died</h1>
    <div id=final-kids></div>
    </div>
    <button class="button">Try again</button>
    </section>`);

    //game.isGameOver = true;

    const finalKids = document.getElementById('final-kids');
    if (numberKids === 0){
      finalKids.innerText = "At least any kid died with you.";
    } else if (numberKids === 1){
      finalKids.innerText = `And ${numberKids} kid died with you!`;
    }else if (numberKids > 1){
      finalKids.innerText = `And ${numberKids} kids died with you!`;
    }

    const restartButton = document.querySelector('button');
    restartButton.addEventListener('click', buildGameScreen);

  };


  const buildWinScreen = (numberKids) => {
    const splashScreen = buildDom(`
    <section class="win-screen">
    <div class="text-win">
    <h1 class="title-splash">You are out!</h1>
    <p><div id=final-kids></div>
    </div></p>
    <button class="button">Restart</button>
    </section>
    </main>`);

    const finalKids = document.getElementById('final-kids');
    if (numberKids === 0){
      finalKids.innerText = "You didn't save any kid. Monster!";
    } else if (numberKids === 1){
      finalKids.innerText = `You saved ${numberKids} kid.`;
    }else if (numberKids === 2){
      finalKids.innerText = `You saved ${numberKids} kids.`;
    } else if (numberKids === 3){
      finalKids.innerText = `You saved all the kids. Congratulations!`;
    }

    const restartButton = document.querySelector('button');
    restartButton.addEventListener('click', buildGameScreen);
  };

  

  buildSplashScreen();

};


window.addEventListener('load', main);

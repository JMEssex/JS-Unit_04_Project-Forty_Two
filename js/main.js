console.log("connected")

// Initialize Firebase

////////// GLOBAL VARIABLES //////////

var gameObj = {
    playerTurn: 0,
    diceRoller: [1,2,3,4,5,6]
};


var currentGame = {
    numDice: 6,
    hasChosen: false,
    dice:[1,2,3,4,5,6],
    score: 0,
    selectedValues:[],
}

var playerNames = [];


////////// HAPPENS IMMEDIATELY //////////

// Innitial button seen at the start of the game.
$('button').on('click', function() {
  start(true);
});




////////// FUNCTIONS //////////

// Constructor function for players.
function Player(dice, score) {
    this.dice = dice,
    this.score = score
}

// Function used to append dice in the DOM via currentGame.dice Array.
function diceFace(numOfPips, index) {

  // HTML Tags needed to create dice faces.
  var $diceFaceDiv = $('<div>', {class: ("face-"+numOfPips), id: (index+"-face-"+numOfPips)})
  var $diceDivCol = $('<div>', {class: "column"})
  var $dicePipSpan = $('<span>', {class: "pip"})


  // Possible Dice Faces 1 to 6.
  var firstFace  = '<span class="pip"></span>'

  var secondFace = '<span class="pip"></span><span class="pip"></span>'

  var thirdFace  = '<span class="pip"></span><span class="pip"></span><span class="pip"></span>'

  var fourthFace = '<div class="column"><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span></div>'

  var fifthFace  = '<div class="column"><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span></div>'

  var sixthFace  = '<div class="column"><span class="pip"></span><span class="pip"></span><span class="pip"></span></div><div class="column"><span class="pip"></span><span class="pip"></span><span class="pip"></span></div>'


  // Switch statement to determine which dice to spawn.
  switch (numOfPips) {

    case 1: // firstFace
      $('#dice-visual').append($diceFaceDiv);
      $diceFaceDiv.eq(-1).append($dicePipSpan);
      break;

    case 2: // secondFace
      $('#dice-visual').append($diceFaceDiv);
      $diceFaceDiv.eq(-1).append(secondFace);
      break;

    case 3: // thirdFace
      $('#dice-visual').append($diceFaceDiv);
      $diceFaceDiv.last().append(thirdFace);
      break;

    case 4: // fourthFace
      $('#dice-visual').append($diceFaceDiv);
        $diceFaceDiv.eq(-1).append(fourthFace)
      break;

    case 5: // fifthFace
      $('#dice-visual').append($diceFaceDiv);
      $diceFaceDiv.eq(-1).append(fifthFace)
      break;

    case 6: // sixthFace
      $('#dice-visual').append($diceFaceDiv);
      $diceFaceDiv.eq(-1).append(sixthFace)
      break;

    default:
      alert("Your dice has more than 6 sides?")
      break;
  }
}

// Function to begin the game and proccess.
function start(init) {
    var numPlayers = $('#number').val();

    for(i=0; i<numPlayers; i++){
      gameObj["player" + (i + 1)] = new Player([], 0);
    }

    init ? gameObj.numPlayers = parseInt(numPlayers) : null;
    console.log(gameObj);
    gameInit();
}

// Function to innitalize the first roll criteria.
function gameInit() {
  var $diceBoard = $('<div>', {id: 'diceBoard'})

  currentGame.dice.forEach(function(cv, id){
    diceFace[(id + 1)]
  });

  var $startButton = $('<button>', {id: 'first-roll' ,name: 'first-roll'})

  $startButton.html('Roll')
  $startButton.on('click', function(){
    roller(6, true);
  });

  $('game').eq(0).append($diceBoard, $startButton)
}

// Function to roll dice.
function roller(numDice, chosen) {
  if(chosen) {
    $('#dice-visual').html('');
    currentGame.hasChosen = false;
    var newDice = [];
    for(i=0; i<numDice; i++){
      newDice.push(Math.ceil(Math.random() * 6))
    }
    var diceHtmlArray = [];
    currentGame.dice = newDice;
    newDice.forEach(function(diceVal, index) {
      diceFace(diceVal, index);
      var diceDiv = $('#'+index+'-face-'+diceVal);
      diceDiv.on('click', function(evt) {
            diceSelector(evt.currentTarget, diceVal);
      });
    });
    var $startButton = $('<button>', {id: 'roll' ,name: 'roll'})
    $startButton.html('Roll');
    $startButton.on('click', function(){
      roller(currentGame.numDice, currentGame.hasChosen);
    });
    $('game').eq(0).html('')
    $('game').eq(0).append($startButton)
  } else {
      alert('You must select atleast 1 dice per roll.');
  }
}

// Function for selecting dice per roll as well as determining when to calculate
function diceSelector(e, val) {
  $(e).remove();
  currentGame.numDice--;
  currentGame.hasChosen = true;
  currentGame.selectedValues.push(val);
  console.log(currentGame.selectedValues);
  if(currentGame.selectedValues.length === 6) {
    $('#roll').text("Calculate")
    $('#roll').on('click', function() {
      diceCalc();
    });
  }
}

// Function for end score of turn.
function diceCalc() {
  if(currentGame.selectedValues.indexOf(4) !== -1 && currentGame.selectedValues.indexOf(2) !== -1) {
    var four = currentGame.selectedValues.indexOf(4)
    var two = currentGame.selectedValues.indexOf(2)
    var score = 0;
    currentGame.selectedValues.forEach(function (val, index) {
      if(index !== four && index !== two) {
        score += val;
      }
    })
    console.log("You scored "+score+" this round.");
    alert("You scored "+score+" this round.");
    gameObj["player" + (gameObj.playerTurn+1)].score += score;

    console.log(gameObj);
    diceTurn();
  } else {
    console.log("You did not qualify. You never kept a 4 & 2");
    alert("You did not qualify. You never kept a 4 & 2");
    gameObj["player" + (gameObj.playerTurn+1)].score = 0
    diceTurn();
  }
}

// Function for reseting dice per player.
function diceTurn(){
  if(gameObj.playerTurn < gameObj.numPlayers-1) {
    gameObj.playerTurn++;
    $('#dice-visual').html('');
    $('game').html('<p>Player '+(gameObj.playerTurn + 1)+'s turn.');
    currentGame = {
      numDice: 6,
      hasChosen: false,
      dice:[1,2,3,4,5,6],
      score: 0,
      selectedValues:[],
    }
    start();
  } else {
    end();
  }
}
function end() {
  //End game function
  $('game').html('<p>Game Over</p>');
}

// Function for rotating though players this was to add more than one round and
// calculate the overall winner.

// function chngePlayerTurn() {
//
// }

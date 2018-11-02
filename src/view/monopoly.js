"use strict";

var Bank = require("../model/bank");
var Pawn = require("../model/pawn");
var Player = require("../model/player");

function MonopolyView(gameRuleCallback) {
  this.MAX_CELL = 40;
  this.players = [];
  this.bank = null;
  this.diceDisplay = null;
  this.startGameBtn = document.getElementById("startGame");

  this.startGame = function() {
    var pawnArray = ["pionMarty", "pionDoc", "pionDoloreane", "pionHoverboard"];
    var selectedPawnPlayer1 =
      (document.querySelector("input[name=pawn]:checked") &&
        document.querySelector("input[name=pawn]:checked").value) ||
      "pionMarty";

    var selectedPawnPlayer2 =
      (document.querySelector("input[name=pawn1]:checked") &&
        document.querySelector("input[name=pawn1]:checked").value) ||
      "pionDoc";
    var playerName1 = document.getElementById("pseudo1").value || "player1";
    var playerName2 = document.getElementById("pseudo2").value || "player2";

    this.diceDisplay = document.getElementById("dice-box");

    this.bank = new Bank();
    var player1 = new Player(playerName1, 1);
    player1.current = true;
    this.bank.capital -= player1.capital;
    var pawn1 = new Pawn(selectedPawnPlayer1);
    player1.pawn = pawn1;

    var player2 = new Player(playerName2, 2);
    this.bank.capital -= player2.capital;
    var pawn2 = null;
    //can't have same pawn pick a random
    if (selectedPawnPlayer2 === selectedPawnPlayer1) {
      var index = pawnArray.indexOf(selectedPawnPlayer1);
      if (index !== -1) {
        pawnArray.splice(index, 1);
      }
      var randomPawn = pawnArray[Math.floor(Math.random() * pawnArray.length)];
      pawn2 = new Pawn(randomPawn);
    } else {
      pawn2 = new Pawn(selectedPawnPlayer2);
      player2.pawn = pawn2;
    }

    this.players = [player1, player2];

    document
      .getElementById("diceButton")
      .addEventListener("click", gameRuleCallback, false);

    var initialPos = document.getElementById(pawn1.currentCellId);
    var pawn1Display = document.getElementById(pawn1.name);
    var pawn2Display = document.getElementById(pawn2.name);
    document.getElementById("tools").appendChild(pawn1Display);
    document.getElementById("tools").appendChild(pawn2Display);
    document.getElementById("tools").style.display = "block";

    document.getElementById("monopoly-start").innerHTML = "";

    var playerInfoDisplay = document.getElementById("player-board");
    document.getElementById("player1").innerHTML = player1.name;
    document.getElementById("player2").innerHTML = player2.name;
    playerInfoDisplay.style.display = "block";
    // this.players.forEach(player1 => {
    //   var newDiv = document.createElement("div");
    //   var newContent = document.createTextNode(player1.name);
    //   newDiv.appendChild(newContent);
    //   playerInfoDisplay.appendChild(newDiv);
    // });

    var board = document.getElementById("monopoly-board");

    board.style.display = "block";

    translateToAbsolute(
      pawn1Display,
      initialPos.firstElementChild.offsetLeft,
      initialPos.firstElementChild.offsetTop,
      "1s"
    );

    translateToAbsolute(
      pawn2Display,
      initialPos.firstElementChild.offsetLeft,
      initialPos.firstElementChild.offsetTop,
      "1s"
    );
  };

  this.movePawn = function(pawn) {
    var pawnElement = document.getElementById(pawn.name);
    var newPos = document.getElementById(pawn.currentCellId);
    translateToAbsolute(
      pawnElement,
      newPos.firstElementChild.offsetLeft,
      newPos.firstElementChild.offsetTop,
      "2s"
    );
    newPos.focus();

    setTimeout(function() {
      newPos.blur();
    }, 2000);
  };

  this.cellsEventListener = function(gameLitenerCallback) {
    for (var i = 0; i < this.MAX_CELL; i++) {
      document
        .getElementById(i)
        .addEventListener("focus", gameLitenerCallback, false);
    }
  };

  this.checkPlayerResponse = function(title, player) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        var titleDisplay = document.getElementById("title" + title.cellId);
        var newTitleDisplay = titleDisplay.cloneNode();
        newTitleDisplay.id = newTitleDisplay.id + "buy?";
        var cardDisplay = document.getElementById("acquisition");
        if (cardDisplay.firstChild) {
          cardDisplay.removeChild(cardDisplay.firstChild);
        }
        cardDisplay.appendChild(newTitleDisplay);
        newTitleDisplay.classList.remove("cards");
        document.getElementById("popup1").style.visibility = "visible";
        document.getElementById("popup1").style.opacity = "1";
        document
          .getElementById("buyTitle")
          .addEventListener("click", function() {
            // console.log("je suis passé par la !!!!!!!");
            // var playerBoard = document.getElementById("player" + player.id);
            // var newDiv = document.createElement("div");
            // var newContent = document.createTextNode(title.name);
            // newDiv.innerHTML = "";
            // newDiv.appendChild(newContent);
            // playerBoard.appendChild(newDiv);

            resolve(sendResponse(true, player, title));
          });

        document.getElementById("cancel").addEventListener("click", function() {
          resolve(sendResponse(false, player, title));
        });
      }, 2100);
    });
  };
}

function sendResponse(response, player1, title) {
  document.getElementById("popup1").style.visibility = "hidden";
  document.getElementById("popup1").style.opacity = "0";
  return response;
}

function translateToAbsolute(sel, x, y, dur) {
  var newX = x - sel.offsetLeft;
  var newY = y - sel.offsetTop;
  sel.style.transition = "all " + dur + " ease";
  sel.style.transform = "translate(" + newX + "px," + newY + "px)";
}

module.exports = MonopolyView;

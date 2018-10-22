/*
 * A list that holds all the cards
 */
const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let openCards = [];
let begin = false;
let moves = 0;
let count = 0;
let timeCount = 0;
let timePtr;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// fetch the class of card
function getCardClass(card) {
    return card[0].firstChild.className;
}

/* 
  if the list already has another card, check to see if the two cards     match
*/
function checkOpenCards() {
    if(getCardClass(openCards[0]) === getCardClass(openCards[1])) {
        count++;
        openCards.forEach(function(card) {
            card.animateCss('tada', function () {
                card.toggleClass("open show match");
              });
        });
    } else {
        openCards.forEach(function(card) {
            card.animateCss('shake', function() {
                card.toggleClass("open show");
            });
        });
    }

    openCards = [];
    incMove();
    if(count === 8) {
        end();
    }
} // end of checkOpenCards

// start and display timer
function timer() {
    timeCount += 1;
    $("#timer").html(timeCount);
    timePtr = setTimeout(timer, 1000);
}

/* 
    increment the move counter and display it on the page (put this       functionality in another function that you call from this one)
*/
// increment moves
function incMove() {
    moves += 1;
    $("#moves").html(moves);
    if(moves === 14 || moves === 20) {
        deductStars();
    }
}


/* set up the event listener for a card. */
// event handler, card is clicked
function cardClicked(event) {
    /* If a card is clicked: */
    // check to see if card is open or already matched.
    let cardClasses = $(this).attr("class");
    if(cardClasses.search('open') * cardClasses.search('match') !== 1) {
        return;
    }

    // start the game if not already
    if(!begin) {
        begin = true;
        timeCount = 0;
        timePtr = setTimeout(timer, 1000);
    }

    // flip card
    /*
      display the card's symbol (put this functionality in another        function that you call from this one) 
    */
    if(openCards.length < 2) {
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    
    // cards match
    /*
      if the cards do match, lock the cards in the open position(put      this functionality in another function that you call from this one)
    */
    if(openCards.length === 2) {
        checkOpenCards();
    }
}

// dynamic carads creation
function createCard(cardClass) {
    $("ul.deck").append(`<li class = "card"> <i class = "fa ${cardClass}"> </i> </li>`);
}

/* 
    add the card to a *list* of "open" cards (put this functionality in   another function that you call from this one)
*/
// add cards
function addCards() {
    shuffle(cardList.concat(cardList)).forEach(createCard);
}

// reset
function resetGame() {
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;

    incMove();

    begin = false;
    openCards = [];
    timeCount = 0;
    count = 0;
    
    // resets the time ptr.
    clearTimeout(timePtr);
    
    // resets the value of timer to 0
    $("#timer").html(0);

    // re-initialize the game
    initGame();
}


/*
   if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/
function end() {
    clearTimeout(timePtr);
    // stars achieved
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
        message: `Congratulations! Game completed in: ${timeCount} seconds. Rating: ${stars}/3 stars. Do you want to play another Game?`, callback: function(value) {
            if(value) {
                resetGame();
            }
        }
    });
}

// stars
function initStars() {
    for (let i = 0; i < 3; i++) {
        $(".stars").append(`<li> <i class = "fa fa-star"> </i> </li>`);
    }
}

// deduct stars as number of moves increases.
function deductStars() {
    let stars = $(".fa-star");
    $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
}

// initialize game
function initGame() {
    addCards();
    initStars();
    $(".card").click(cardClicked);
}

$(document).ready(function() {
    initGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes! Please.';
    vex.dialog.buttons.NO.text = 'No! Thank you.';
})

/* https://github.com/daneden/animate.css/#usage */
$.fn.extend({
    animateCss: function(animationName, callback) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});

/* 
    if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) 
*/
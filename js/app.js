//Create a list that holds all of your cards
const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let begin = false;
let openCards = [];
let moves = 0;
let count = 0;
let timeCount = 0;
let timePointer;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// get class value from card DOM
function getCardClass(card) {
    return card[0].firstChild.className;
}

// check open cards when count = 2
function checkOpenCards() {
    /* 
        display the card's symbol (put this functionality in another function that you call from this one) 
        add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    */
    if (getCardClass(openCards[0]) === getCardClass(openCards[1])) {
        count++;
        openCards.forEach(function (card) {
            card.animateCss('tada', function () {
                card.toggleClass("open show match");
            });
        });
    }
    /* 
        if the cards do not match, remove the cards from the list and 
        hide the card's symbol.
        (put this functionality in another function that you call from this one)
    */ 
    else {
        openCards.forEach(function (card) {
            card.animateCss('wobble', function () {
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incMove();
    if (count === 8) {
        end();
    }
}

// starts the timer
function timer() {
    timeCount += 1;
    $("#timer").html(timeCount);
    timePointer = setTimeout(timer, 1000);
}

/*
    increment the move counter and display it on the page
    (put this functionality in another function that you call from this one)
*/
// increment move count
function incMove() {
    moves += 1;
    $("#moves").html(moves);
    if (moves === 10 || moves === 15) {
        deductStars();
    }
}

/*
    Set up the event listener for a card. If a card is clicked:
*/

function cardClick(event) {
    // check opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1) {
        return;
    }
    // start the game
    if (!begin) {
        begin = true;
        timeCount = 0;
        timePointer = setTimeout(timer, 1000);
    }
    
    // flip cards on click
    
    if (openCards.length < 2) {
        $(this).toggleClass("open show");
        openCards.push($(this));
        
    }
    // check if cards match
    /* 
        if the list already has another card, check to see if the two cards match 
        if the cards do match, lock the cards in the open position 
        (put this functionality in another function that you call from this one)
    */
    if (openCards.length === 2) {
        checkOpenCards();
    }
}

// create individual card element
function createCards(cardClass) {
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// populate cards in DOM
function addCards() {
    shuffle(cards.concat(cards)).forEach(createCards);
}

// reset game
function reset() {
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incMove();
    begin = false;
    openCards = [];
    timeCount = 0;
    count = 0;
    clearTimeout(timePointer);
    $("#timer").html(0);
    // re-setup game
    initGame();
}

// game completed
function end() {
    // stop timer
    clearTimeout(timePointer);

    let stars = $(".fa-star").length;
    /* 
        if all cards have matched, display a message with the final score
        (put this functionality in another function that you call from this one)
    */
    vex.dialog.confirm({
        message: `Congratulations! Time: ${timeCount} seconds. Rating: ${stars}/3 star. Play again?`,
        callback: function (value) {
            if (value) {
                reset();
            }
        }
    });
}

// initialize stars dynamically
function initStars() {
    for (let i = 0; i < 3; i++) {
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// reduce stars for rating as moves increase
function deductStars() {
    let stars = $(".fa-star");
    $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
}

// init game
function initGame() {
    addCards();
    initStars();
    $(".card").click(cardClick);
}

// using vex to display result and options to continue or break
$(document).ready(function () {
    initGame();
    $("#restart").click(reset);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes! Please.';
    vex.dialog.buttons.NO.text = 'No! Thank you.';
});

// animateCss to make UI more fun to play. Link: https://github.com/daneden/animate.css
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});

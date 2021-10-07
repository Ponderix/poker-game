/*
IT IS VERY IMPORTANT THAT THE CARD NAMES ARE WRITTEN ACCURATELY
*/



// DATA //
var deck = [
    ["CLUBS_2", "CLUBS_3", "CLUBS_4", "CLUBS_5", "CLUBS_6", "CLUBS_7", "CLUBS_8", "CLUBS_9", "CLUBS_10", "CLUBS_J", "CLUBS_Q", "CLUBS_K", "CLUBS_A"],
    ["DIAMONDS_2", "DIAMONDS_3", "DIAMONDS_4", "DIAMONDS_5", "DIAMONDS_6", "DIAMONDS_7", "DIAMONDS_8", "DIAMONDS_9", "DIAMONDS_10", "DIAMONDS_J", "DIAMONDS_Q", "DIAMONDS_K", "DIAMONDS_A"],
    ["HEARTS_2", "HEARTS_3", "HEARTS_4", "HEARTS_5", "HEARTS_6", "HEARTS_7", "HEARTS_8", "HEARTS_9", "HEARTS_10", "HEARTS_J", "HEARTS_Q", "HEARTS_K", "HEARTS_A"],
    ["SPADES_2", "SPADES_3", "SPADES_4", "SPADES_5", "SPADES_6", "SPADES_7", "SPADES_8", "SPADES_9", "SPADES_10", "SPADES_J", "SPADES_Q", "SPADES_K", "SPADES_A"],
];
var deck_positions = [
    [2, 0],
    [3, 1],
    [4, 2],
    [5, 3],
    [6, 4],
    [7, 5],
    [8, 6],
    [9, 7],
    [10, 8],
    ["J", 9],
    ["Q", 10],
    ["K", 11],
    ["A", 12],
];
var suits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"];
// DATA //



document.querySelector("#btn_start").addEventListener("click", function() {
    // GAME STATE //
    var game = {
        uncovered : 0,
        current_bet : 0,
        total_bets : 0,
        rounds_played : 0,
    }

    // PARTICIPANT DATA //
    var computer = {
        money : 0,
        cards : [],
        combination : null,
        powerups : null,
    }
    var player = {
        money : 0,
        cards : [],
        combination : null,
        powerups : null,
    }

    /* GAME START */
    function getCards(user) {
        var previous_card = null;

        for (var i = 0; i < Infinity; i++) {
            var random_suit = functions.number(0, 3);
            var random_card = functions.number(0, 12);
            var random_card = deck[random_suit][random_card];
            var selected_card = functions.retrieve(random_card, deck);

            if ((previous_card != random_card || previous_card === null) && selected_card != null) { // IF PREVIOUS CARD IS NOT THE SAME AS CURRENT CARD AND CURRENT CARD DOES EXIST
                if (user.cards.length < 2) { // AND IF CARDS STILL HAVE TO BE SELECTED
                    user.cards.push(selected_card); // GIVE CARD TO PLAYER
                    previous_card = random_card;
                } else {
                    previous_card = random_card;
                    break; // (IF NO MORE CARDS HAVE TO BE ASSIGNED) END LOOP
                }
            }
            previous_card = random_card;
        }
    }
    getCards(player);
    getCards(computer);
    console.log(player.cards);
    console.log(computer.cards);
});

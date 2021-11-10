var gamefunctions = {
    //get  X amount of random cards for player
    getCards : function(deck, number) {
        var output = []
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
        var suits = ["clubs", "diamonds", "hearts", "spades"];

        var previous_card = null;// CHECK IF TWO CARDS SAME

        for (var i = 0; i < Infinity; i++) {
            var random_suit = basic.number(0, 4);
            var random_card = basic.number(0, 13);
            var random_card = deck[random_suit][random_card];
            var selected_card = basic.retrieve(random_card, deck);

            if ((previous_card != random_card || previous_card === null) && selected_card != null) { // IF PREVIOUS CARD IS NOT THE SAME AS CURRENT CARD AND CURRENT CARD DOES EXIST
                if (output.length < number) { // AND IF CARDS STILL HAVE TO BE SELECTED
                    output.push(selected_card); // ADD CARD TO OUTPUT
                    previous_card = random_card;
                } else {
                    basic.return(selected_card, deck, suits, deck_positions)
                    previous_card = random_card;
                    break; // (IF NO MORE CARDS HAVE TO BE ASSIGNED END LOOP
                }
            }
            previous_card = random_card;
        }

        return output;
    },

    detectCombination: function(usercards, tablecards) {
        var cards = usercards.concat(tablecards);
        var hand = {
            type: null, // type of hand pair, flush etc
            value: null, // how much value this type has, e.g flush is higher than pair
            cards: [], // the cards which make up the certain type/combination, e.g pair could be [spades_J, clubs_J]
        }

        var suits = [
            ["clubs"],
            ["diamonds"],
            ["hearts"],
            ["spades"],
        ]

        var ranks = [["2"], ["3"], ["4"], ["5"], ["6"], ["7"], ["8"], ["9"], ["10"], ["J"], ["Q"], ["K"], ["A"]];

        for (var i = 0; i < cards.length; i++) { // order by suit type

            for (var index = 0; index < suits.length; index++) {
                if (cards[i].includes(suits[index][0])) {
                    suits[index].push(cards[i]);
                }
            }

        }

        for (var i = 0; i < cards.length; i++) {

            for (var index = 0; index < ranks.length; index++) {
                if (cards[i].includes(ranks[index][0])) {
                    ranks[index].push(cards[i]);
                }
            }

        }

        /* COMBINATION CHECKS
            * straight and straight flush are not yet included since they require complex code
            * it is important that the filtering functions are ordered from least valuable hand to highest hand so that if
              for example both a pair and a triple get detected (which will always be the case), the triple will be selected because it
              was filtered for last
        */

        //check for high card
        (function() {
            var index = 0; // index of highest card which has been filtered as of yet

            for (var i = 0; i < ranks.length; i++) {
                if (ranks[i].length == 2) {
                    index = i;
                }
            }

            hand.type = "High Card";
            hand.cards = [[ranks[index][1], index]];
            hand.value = 0;
        })();


        //check for pair
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].length == 3) {
                hand.type = "Pair";
                hand.cards = [[ranks[i][1], i], [ranks[i][2], i]];
                hand.value = 1;
            }
        }

        //check for two pair
        (function() {
            var pairs = 0;
            var pair1_index = 0;
            var pair2_index = 0;

            for (var i = 0; i < ranks.length; i++) {

                if (ranks[i].length == 3) {
                    if (pair1_index == 0) {
                        pair1_index = i;
                    } else {
                        if (pair2_index ==0) {
                            pair2_index = i;
                        }
                    }

                    pairs++;
                }

                if (pairs >= 2) {
                    hand.type = "Two Pair";
                    hand.cards = [
                        [ranks[pair1_index][1], pair1_index],
                        [ranks[pair1_index][2], pair1_index],
                        [ranks[pair2_index][1], pair2_index],
                        [ranks[pair2_index][2], pair2_index]
                    ];
                    hand.value = 2;
                }
            }
        })();

        //check for three of a kind
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].length == 4) {
                hand.type = "Three of a Kind";
                hand.cards = [[ranks[i][1], i], [ranks[i][2], i], [ranks[i][3], i]];
                hand.value = 3;
            }
        }

        //check for straight (?)


        //check for flush
        (function() {
            for (var i = 0; i < suits.length; i++) {
                if (suits[i].length >= 6) {
                    hand.type = "Flush";
                    hand.cards = [
                        [suits[i][1]], [suits[i][2]],
                        [suits[i][3]], [suits[i][4]],
                        [suits[i][5]]
                    ];
                    hand.value = 5;
                }
            }

            //assign each card the its rank based upon which position it has in the ranks array
            for (var i = 0; i < ranks.length; i++) {
                for (var index = 0; index < hand.cards.length; index++) {

                    ranks[i].filter((e) =>{
                        if (e.includes(hand.cards[index])) {
                            hand.cards[index].push(i);
                        }
                    });
                    /* meaning: for every rank, filter for a card which makes up the flush, and push the rank of this card to the card in the card array*/

                }
            }
        })();

        //check for full house
        (function() {
            var pairs = 0;
            var pair_index = 0;

            var triplets = 0;
            var triplets_index = 0;

            for (var i = 0; i < ranks.length; i++) {

                if (ranks[i].length == 3) {
                    pair_index = i;
                    pairs++;
                }
                if (ranks[i].length == 4) {
                    triplets_index = i;
                    triplets++;
                }

                if (pairs > 0 && triplets > 0) {
                    hand.type = "Full House";
                    hand.cards = [
                        [ranks[triplets_index][1], triplets_index],
                        [ranks[triplets_index][2], triplets_index],
                        [ranks[triplets_index][3], triplets_index],
                        [ranks[pair_index][1], pair_index],
                        [ranks[pair_index][2], pair_index]
                    ];
                    hand.value = 6;
                }
            }
        })();

        //check for four of a kind
        for (var i = 0; i < ranks.length; i++) {
            if (ranks[i].length == 5) {
                hand.type = "Four of a Kind";
                hand.cards = [[ranks[i][1], i], [ranks[i][2], i], [ranks[i][3], i], [ranks[i][4], i]];
                hand.value = 7;
            }
        }

        //check for straight flush (?)


        //check for royal flush
        (function() {
            for (var i = 0; i < suits.length; i++) {
                if (suits[i].length > 1) {

                    if (suits[i].includes(suits[i][0] + "_10")
                        && suits[i].includes(suits[i][0] + "_J")
                        && suits[i].includes(suits[i][0] + "_Q")
                        && suits[i].includes(suits[i][0] + "_K")
                        && suits[i].includes(suits[i][0] + "_A")
                    ) {
                        hand.type = "Royal Flush";
                        hand.cards = [[suits[i][1]], [suits[i][2]], [suits[i][3]], [suits[i][4]], [suits[i][5]]];
                        hand.value = 9;
                    }

                }
            }
            //assign each card the its rank based upon which position it has in the ranks array
            for (var i = 0; i < ranks.length; i++) {
                for (var index = 0; index < hand.cards.length; index++) {

                    ranks[i].filter((e) =>{
                        if (e.includes(hand.cards[index])) {
                            hand.cards[index].push(i);
                        }
                    });

                }
            }
        })();

        //sort in descending order to make it easier to find highest card in case of tie
        hand.cards.sort((a, b) =>{
            return b[1] - a[1];
        });
        return hand;
    },
}

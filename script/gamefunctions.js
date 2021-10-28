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
        var suits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES"];

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
}

var basic = {
    //random number
    number : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },

    //retrieve a card from deck
    retrieve : function(card, deck) {
        var selected_card;

        for (var i = 0; i < deck.length; i++) { //FOR EACH SUIT
            deck[i].forEach((e, index) => {
                if (card == e) {
                    selected_card = e; //IF ELEMENT IS SELECTED CARD UPDATE "selected_card" BY ELEMENT
                    deck[i].splice(index, 1, null); // REMOVE ELEMENT FROM DECK
                }
            });
        }

        return selected_card;
    },

    //return card to deck
    return : function(card, deck, suits, indecies) {

        for (var i = 0; i < deck.length; i++) { // FOR EACH SUIT
            if (card.includes(suits[i])) { // IF CARD IS IN SUIT i

                for (var index = 0; index < deck[i].length; index++) {
                    if (card.includes(indecies[index][0])) { // FIND PREDETERMINED INDEX OF CARD AND RETURN CARD TO INDEX
                        deck[i].splice(indecies[index][1], 1, card);
                    }
                }

            }
        }
    },
}

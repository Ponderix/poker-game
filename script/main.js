var deck = {
    hearts : [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    diamonds : [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    clubs : [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
    spades : [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"],
}


document.querySelector("btn_start").addEventListener("click", function() {
    var player = {
        money : 0,
        cards : [null, null],
        combination : null,
        powerups : [null],
    }
    var game = {
        uncovered : 0,
        current_bet : 0,
        total_bets : 0,
    }
    var computer = {
        money : 0,
        cards : [null, null],
        combination : null,
        powerups : [null],
    }

    var rounds_player = 0;


});

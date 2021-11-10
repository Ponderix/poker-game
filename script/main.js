// DATA //

var deck = [
    ["clubs_2", "clubs_3", "clubs_4", "clubs_5", "clubs_6", "clubs_7", "clubs_8", "clubs_9", "clubs_10", "clubs_J", "clubs_Q", "clubs_K", "clubs_A"],
    ["diamonds_2", "diamonds_3", "diamonds_4", "diamonds_5", "diamonds_6", "diamonds_7", "diamonds_8", "diamonds_9", "diamonds_10", "diamonds_J", "diamonds_Q", "diamonds_K", "diamonds_A"],
    ["hearts_2", "hearts_3", "hearts_4", "hearts_5", "hearts_6", "hearts_7", "hearts_8", "hearts_9", "hearts_10", "hearts_J", "hearts_Q", "hearts_K", "hearts_A"],
    ["spades_2", "spades_3", "spades_4", "spades_5", "spades_6", "spades_7", "spades_8", "spades_9", "spades_10", "spades_J", "spades_Q", "spades_K", "spades_A"],
];

// GAME //
const game_start_btn = d3.select("#btn_start");
const player_cards_div = d3.select("#player_cards");
const computer_cards_div = d3.select("#computer_cards");
const game_table_div = d3.select("#game_table");
const game_round_btn = d3.select("#btn_next_round").style("display", "none")

const player_cards_area = player_cards_div.append("div")
    .attr("id", "player_cards_area");
const player_money_area = player_cards_div.append("div")
    .attr("id", "player_money_area");
const player_hand_area = player_cards_div.append("div")
    .attr("id", "player_hand_area");

const computer_cards_area = computer_cards_div.append("div")
    .attr("id", "computer_cards_area");
const computer_money_area = computer_cards_div.append("div")
    .attr("id", "computer_money_area");
const computer_hand_area = computer_cards_div.append("div")
    .attr("id", "computer_hand_area");

const game_cards_area = game_table_div.append("div")
    .attr("id", "game_cards_area");
const game_stake_area = game_table_div.append("div")
    .attr("id", "game_stake_area");
const game_bet_area = game_table_div.append("div")
    .attr("id", "game_bet_area");
const game_turn_area = game_table_div.append("div")
    .attr("id", "game_turn_area");


const player_inputs = d3.select("#inputs").style("display", "none"); //initially hide inputs so player cant just raise during game

const turn_raise = d3.select("#input_raise");
const turn_call = d3.select("#btn_call");
const turn_fold = d3.select("#btn_fold");


document.querySelector("#btn_start").addEventListener("click", function() {
    // GAME STATE //
    var game = {
        rounds_played : 0,
        total_money : 0,

        round : {
            uncovered : 0,
            stakes: 0 // temp to record the bets made in X round
        },
    }

    // PARTICIPANT DATA //
    var player = {
        money : 1000,
        cards : null,
        combination : null,
        powerups : null,
    }
    var computer = {
        money : 1000,
        cards : null,
        combination : null,
        powerups : null,
    }

    //VARIABLES
    var table_cards;

    /* GAME START */
    game.rounds_played++;

    //default html
    player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);
    computer_money_area.html(`OPPONENT MONEY: <span>${computer.money}</span>`);
    game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes}</span>`);
    game_bet_area.html(`BETS: <span>0</span> | CURRENT MINBET: <span>0</span>`);

    //assign 2 cards to player
    player.cards = gamefunctions.getCards(deck, 2);
    computer.cards = gamefunctions.getCards(deck, 2);
    player_cards_area.html(`YOUR CARDS: <span>${player.cards[0]}</span> and <span>${player.cards[1]}</span>`);
    computer_cards_area.html(`OPPONENT CARDS: <span>hidden</span> and <span>hidden</span>`);


    //get five cards onto playing table
    table_cards = gamefunctions.getCards(deck, 5);

    //check uncovered cards => betting sequence
    //variables usedi n player and computer turn have to be declared here, they cannot be given as parameters as these will act as a new
    var round_totbet = 0; // bets made in this certain betting round
    var round_minbet = 0; // minimum bet variable, changes
    var rounds_of_betting = 0; // how many times the rounds have continued

    var playerbet = 0;
    var computerbet = 0;

    //RAISE BET
    turn_raise.on("keyup", function(event) {
        if (event.code === "Enter") {
            const input_value = Number(event.target.value);

            if (isNaN(input_value) == false) { // if bet is a number


                if (player.money > input_value  && input_value >= round_minbet  && input_value > 0) { // if bet is less than player momey and if bet is larger than minimum
                    playerbet = Number(input_value);
                    round_totbet+=playerbet; // bet added to total round bet
                    player.money+=(-playerbet); // money substracted from player money

                    //check if round_minbet should be updated
                    if (playerbet > round_minbet) {
                        round_minbet = playerbet;
                    }

                    //update html
                    game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINIMUM BET: <span>${round_minbet}</span>`);
                    player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);

                    player_inputs.style("display", "none"); // hide inputs after turn is done

                    playerbet = 0; // reset current playerbet
                    event.target.value = null; // reset

                    //change styling and text to indicate start of computer turn
                    game_table_div.style("background-color", "#f7a8a8");
                    game_turn_area.html("<br></br>OPPONENT'S TURN")

                    setTimeout(() =>{
                        computer_function();
                    }, 3000); // initiate computer bet after 3 seconds
                } else {
                    alert("Raise exceeds your money or is smaller than round minimum bet");
                }

            } else {
                alert("Raise is not a number");
            }

        }
    });

    //CALL BET
    turn_call.on("click", function() {

        if (round_minbet > 0 && player.money > round_minbet) {// if minimum bet exists, and player has enough money for minimum
            playerbet = round_minbet; // player bet becomes the round_minbet
            round_totbet+=playerbet; // bet added to total round bet
            player.money+=(-playerbet); // money substracted from player money

            //update html
            game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINIMUM BET: <span>${round_minbet}</span>`);
            player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);

            player_inputs.style("display", "none"); // hide inputs after turn is done

            playerbet = 0; // reset current playerbet

            //change styling and text to indicate start of computer turn
            game_table_div.style("background-color", "#f7a8a8");
            game_turn_area.html("<br></br>OPPONENT'S TURN")
            setTimeout(() =>{
                computer_function();
            }, 3000); // initiate computer bet after 3 seconds
        } else {
            alert("Not enough money, or it's your turn to bet, please raise the bet");
        }
    });

    //FOLD
    turn_fold.on("click", function () {
        game.round.stakes+=round_totbet; //in case fold happens during betting
        computer.money+=game.round.stakes; //computer gets all the money

        game_bet_area.html("");
        game_stake_area.html("")
        game_table_div.style("background-color", "lightblue");
        game_turn_area.html(`<br></br>OPPONENT WINS $${game.round.stakes}`);
        computer_money_area.html(`OPPONENT MONEY: <span>${computer.money}</span>`);

        player_inputs.style("display", "none");
        game_round_btn.style("display", "block");

        alert("Player FOLDS");
    });

    //FOLD
    game_round_btn.on("click", function () {
         location.reload();
    });


    UNCOVER_SEQUENCE();

    function UNCOVER_SEQUENCE() {

        if (game.round.uncovered < 5) {
            game_cards_area.selectAll("span").remove();

            var uncovered = game.round.uncovered;
            uncovered++; // one more card is uncovered
            game.round.uncovered = uncovered;

            for (var i = 0; i < uncovered; i++) { // uncover cards according to how many are already uncovered
                game_cards_area.append("span")
                    .html(` ${table_cards[i]},`);
            }

            if (game.round.uncovered == 5) { //if last card is being uncovered
                var player_hand = gamefunctions.detectCombination(getParams(player)[0], getParams(player)[1]);
                var computer_hand = gamefunctions.detectCombination(getParams(computer)[0], getParams(computer)[1]);

                setTimeout(() =>{ // as final card is uncovered refresh hand
                    player_hand_area.html(`<br></br>YOUR HAND: <span>${player_hand.type}</span>`);

                    game_table_div.style("background-color", "lightblue");
                    game_turn_area.html(`<br></br>ALL CARDS ARE UNCOVERED`);
                    player_inputs.style("display", "none");
                    game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes}</span>`);
                    game_bet_area.html("");

                    setTimeout(() =>{ // then show opponents cards
                        game_turn_area.html(`<br></br>OPPONENTS CARDS HAVE BEEN REVEALED<br>calculating winner...`);

                        //reveal computer's cards
                        computer_cards_area.html(`OPPONENT CARDS: <span>${computer.cards[0]}</span> and <span>${computer.cards[1]}</span>`);
                        computer_hand_area.html(`<br></br>OPPONENT'S HAND: <span>${computer_hand.type}</span>`);


                        setTimeout(() =>{// finally compare player and computer hand
                            decide_winner();
                        }, 4000);
                    }, 3000)

                }, 0);

                function decide_winner() {
                    if (player_hand.value > computer_hand.value) {
                        player_win();
                        alert("You have WON!")
                    }
                    if (computer_hand.value > player_hand.value) {
                        computer_win();
                        alert("You have LOST!")
                    }

                    if (player_hand.value === computer_hand.value) {

                        if (player_hand.cards[0][1] > computer_hand.cards[0][1]) {
                            player_win();
                            alert(`You have WON!\n(the ${player_hand.type} with the highest rank decides the winner)`);
                        } else {

                            if (computer_hand.cards[0][1] > player_hand.cards[0][1]) {
                                computer_win();
                                alert(`You have LOST!\n(the ${player_hand.type} with the highest rank decided winner)`);
                            } else {
                                computer.money+=(0.5*game.round.stakes); //computer gets all the money
                                player.money+=(0.5*game.round.stakes); //computer gets all the money

                                game_turn_area.html(`<br></br>YOU HAVE BOTH WON $${0.5*game.round.stakes}`);
                                computer_money_area.html(`OPPONENT MONEY: <span>${computer.money}</span>`);
                                computer_money_area.html(`OPPONENT MONEY: <span>${player.money}</span>`);
                                game_stake_area.html("")


                                game_round_btn.style("display", "block");
                                alert(`You have TIED, because both players have the same hand with the same rank!`)
                            }

                        }

                    }
                }

                function computer_win() {
                    computer.money+=game.round.stakes; //computer gets all the money

                    game_turn_area.html(`<br></br>OPPONENT WINS $${game.round.stakes}`);
                    computer_money_area.html(`OPPONENT MONEY: <span>${computer.money}</span>`);
                    game_stake_area.html("")


                    game_round_btn.style("display", "block");
                }
                function player_win() {
                    player.money+=game.round.stakes; //computer gets all the money

                    game_turn_area.html(`<br></br>YOU WIN $${game.round.stakes}`);
                    player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);
                    game_stake_area.html("")


                    game_round_btn.style("display", "block");
                }
            }
        }

        game_start_btn.style("display", "none"); // hide start btn so it cannot be abused

        //PLAYER'S TURN ALWAYS FIRST
        player_inputs.style("display", "block");
        game_table_div.style("background-color", "lightgreen");
        game_turn_area.html("<br></br>YOUR TURN")

        //DETECT CARD COMBINATION
        var player_hand = gamefunctions.detectCombination(getParams(player)[0], getParams(player)[1]);
        var computer_hand = gamefunctions.detectCombination(getParams(computer)[0], getParams(computer)[1]);

        player_hand_area.html(`<br></br>YOUR HAND: <span>${player_hand.type}</span>`);
        computer_hand_area.html(`<br></br>OPPONENT'S HAND: <span>hidden</span>`);

        function getParams(user) {
            var param1 = user.cards;
            var param2 = [];

            for (var i = 0; i < game.round.uncovered; i++) { // select only cards which are uncovered
                param2.push(table_cards[i]);
            }

            return [param1, param2];
        }
    };



    function computer_function() {

        var computerbet = 0;

        if (computer.money > round_minbet) {// if computer has enough money for minimum bet
            computerbet = round_minbet + 1; // computer bet becomes minimum bet plus 1
            round_totbet+=computerbet; // bet added to total round bet
            computer.money+=(-computerbet); // money substracted from player money

            //check if round_minbet should be updated
            if (computerbet > round_minbet) {
                round_minbet = computerbet;
            }

            //update html
            game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINIMUM BET: <span>${round_minbet}</span>`);
            computer_money_area.html(`OPPONENT MONEY: <span>${computer.money}</span>`);

            //add to rounds betted, has to be 2
            rounds_of_betting++;

            if (rounds_of_betting >= 2) {
                game.round.stakes+=round_totbet;

                game_bet_area.html(`BETS: <span>0</span> | CURRENT MINIMUM BET: <span>0</span>`);
                game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes}</span>`);
                game_table_div.style("background-color", "lightblue");

                if (game.round.uncovered == 4) {
                    game_table_div.style("background-color", "lightblue");
                    game_turn_area.html(`<br></br>FINAL CARD IS BEING UNCOVERED`);
                    player_inputs.style("display", "none");
                    game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes}</span>`);
                    game_bet_area.html("");
                } else {
                    game_turn_area.html("<br></br>CARD IS BEING UNCOVERED");
                }

                //resetting variables
                rounds_of_betting = 0;
                round_minbet = 0;
                round_totbet = 0;

                setTimeout(() =>{
                    UNCOVER_SEQUENCE();
                }, 3000); // uncover next card
            } else {
                rounds_of_betting++;

                computerbet = 0; // reset current computerbet

                player_inputs.style("display", "block"); // second turn of betting
                game_turn_area.html("<br></br>YOUR TURN")
                game_table_div.style("background-color", "lightgreen");
            }
        } else {
            alert("computer folds")
        }
    }

});

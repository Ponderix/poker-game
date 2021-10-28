// DATA //

var deck = [
    ["CLUBS_2", "CLUBS_3", "CLUBS_4", "CLUBS_5", "CLUBS_6", "CLUBS_7", "CLUBS_8", "CLUBS_9", "CLUBS_10", "CLUBS_J", "CLUBS_Q", "CLUBS_K", "CLUBS_A"],
    ["DIAMONDS_2", "DIAMONDS_3", "DIAMONDS_4", "DIAMONDS_5", "DIAMONDS_6", "DIAMONDS_7", "DIAMONDS_8", "DIAMONDS_9", "DIAMONDS_10", "DIAMONDS_J", "DIAMONDS_Q", "DIAMONDS_K", "DIAMONDS_A"],
    ["HEARTS_2", "HEARTS_3", "HEARTS_4", "HEARTS_5", "HEARTS_6", "HEARTS_7", "HEARTS_8", "HEARTS_9", "HEARTS_10", "HEARTS_J", "HEARTS_Q", "HEARTS_K", "HEARTS_A"],
    ["SPADES_2", "SPADES_3", "SPADES_4", "SPADES_5", "SPADES_6", "SPADES_7", "SPADES_8", "SPADES_9", "SPADES_10", "SPADES_J", "SPADES_Q", "SPADES_K", "SPADES_A"],
];



// GAME //
const player_cards_div = d3.select("#player_cards");
const game_table_div = d3.select("#game_table");

const player_cards_area = player_cards_div.append("div")
    .attr("id", "player_cards_area");
const player_money_area = player_cards_div.append("div")
    .attr("id", "player_money_area");

const game_cards_area = game_table_div.append("div")
    .attr("id", "game_cards_area");
const game_stake_area = game_table_div.append("div")
    .attr("id", "game_stake_area");
const game_bet_area = game_table_div.append("div")
    .attr("id", "game_bet_area");


const player_inputs = d3.select("#inputs").style("display", "none"); //initially hide inputs so player cant just raise during game

const turn_raise = d3.select("#input_raise");
const turn_call = d3.select("#btn_call");
const turn_fold = d3.select("#btn_fold");


document.querySelector("#btn_start").addEventListener("click", function() {
    // GAME STATE //
    var game = {
        uncovered : 0,
        current_bet : 0,
        total_bets : 0,
        rounds_played : 0,

        round : {
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
        money :1000,
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
    game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes}</span>`);

    //assign 2 cards to player
    player.cards = gamefunctions.getCards(deck, 2);
    computer.cards = gamefunctions.getCards(deck, 2);
    player_cards_area.html(`YOUR CARDS: <span>${player.cards[0]}</span> and <span>${player.cards[1]}</span>`);

    //get five cards onto playing table
    table_cards = gamefunctions.getCards(deck, 5);
    game_cards_area.html(`<span>${table_cards[0]}</span>, COVERED, COVERED, COVERED, COVERED`);

    //detect which combination

    //betting starts
    (function() {
        var round_totbet = 0; // bets made in this certain betting round
        var round_minbet = 0; // minimum bet variable, changes

        //PLAYER'S TURN ALWAYS FIRST
        player_inputs.style("display", "block");

            // PLAYER TURN //

            var current_playerbet = 0;
            var current_computerbet = 0;


            var rounds_of_betting = 0; // how many times the rounds have continued

            //RAISE BET
            turn_raise.on("keyup", function(event) {
                if (event.code === "Enter") {
                    const input_value = Number(event.target.value);

                    if (isNaN(input_value) == false) { // if bet is a number

                        if (input_value < player.money && input_value >= round_minbet) { // if bet is less than player momey and if bet is larger than minimum
                            current_playerbet = Number(input_value);
                            round_totbet+=current_playerbet; // bet added to total round bet
                            player.money+=(-current_playerbet); // money substracted from player money

                            //check if minbet should be updated
                            if (current_playerbet > round_minbet) {
                                round_minbet = current_playerbet;
                            }
                            console.log(round_minbet);

                            //update html
                            game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINBET: <span>${round_minbet}</span>`);
                            player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);

                            player_inputs.style("display", "none"); // hide inputs after turn is done

                            current_playerbet = 0; // reset current playerbet
                            computerBet() // initiate computer bet after 1 second to simulate computer thinking
                        } else {
                            alert("Raise exceeds moeny or is smaller than minimum bet");
                        }

                    } else {
                        alert("Raise is not a number");
                    }

                }
            });

            //CALL BET
            turn_call.on("click", function() {

                if (round_minbet > 0 && player.money > round_minbet) {// if minimum bet exists, and player has enough money for minimum
                    current_playerbet = round_minbet; // player bet becomes the minbet
                    round_totbet+=current_playerbet; // bet added to total round bet
                    player.money+=(-current_playerbet); // money substracted from player money

                    //update html
                    game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINBET: <span>${round_minbet}</span>`);
                    player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);

                    player_inputs.style("display", "none"); // hide inputs after turn is done

                    current_playerbet = 0; // reset current playerbet
                    computerBet() // initiate computer bet after 1 second to simulate computer thinking
                } else {
                    alert("Not enough money, or it is your turn to bet, please raise the bet");
                }
            });


            // COMPUTER TURN //
            function computerBet() {
                if (computer.money > round_minbet) {// if computer has enough money for minimum bet
                    current_computerbet = round_minbet + 1; // computer bet becomes minimum bet plus 1
                    round_totbet+=current_computerbet; // bet added to total round bet
                    computer.money+=(-current_computerbet); // money substracted from player money

                    //check if minbet should be updated
                    if (current_computerbet > round_minbet) {
                        round_minbet = current_computerbet;
                    }

                    //update html
                    game_bet_area.html(`BETS: <span>${round_totbet}</span> | CURRENT MINBET: <span>${round_minbet}</span>`);
                    player_money_area.html(`YOUR MONEY: <span>${player.money}</span>`);

                    //add to rounds betted, has to be 2
                    rounds_of_betting++;

                    current_computerbet = 0; // reset current playerbet

                    if (rounds_of_betting >= 2) {
                        game_bet_area.html(`BETS: <span>N/A</span> | CURRENT MINBET: <span>N/A</span>`);
                        game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes + round_totbet}</span>`);
                    } else {
                        player_inputs.style("display", "block"); // re-start round
                    }
                } else {
                    alert("computer folds")
                }
            }


    })();

});

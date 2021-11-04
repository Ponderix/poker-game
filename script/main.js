// DATA //

var deck = [
    ["CLUBS_2", "CLUBS_3", "CLUBS_4", "CLUBS_5", "CLUBS_6", "CLUBS_7", "CLUBS_8", "CLUBS_9", "CLUBS_10", "CLUBS_J", "CLUBS_Q", "CLUBS_K", "CLUBS_A"],
    ["DIAMONDS_2", "DIAMONDS_3", "DIAMONDS_4", "DIAMONDS_5", "DIAMONDS_6", "DIAMONDS_7", "DIAMONDS_8", "DIAMONDS_9", "DIAMONDS_10", "DIAMONDS_J", "DIAMONDS_Q", "DIAMONDS_K", "DIAMONDS_A"],
    ["HEARTS_2", "HEARTS_3", "HEARTS_4", "HEARTS_5", "HEARTS_6", "HEARTS_7", "HEARTS_8", "HEARTS_9", "HEARTS_10", "HEARTS_J", "HEARTS_Q", "HEARTS_K", "HEARTS_A"],
    ["SPADES_2", "SPADES_3", "SPADES_4", "SPADES_5", "SPADES_6", "SPADES_7", "SPADES_8", "SPADES_9", "SPADES_10", "SPADES_J", "SPADES_Q", "SPADES_K", "SPADES_A"],
];



// GAME //
const game_start_btn = d3.select("#btn_start");
const player_cards_div = d3.select("#player_cards");
const computer_cards_div = d3.select("#computer_cards");
const game_table_div = d3.select("#game_table");

const player_cards_area = player_cards_div.append("div")
    .attr("id", "player_cards_area");
const player_money_area = player_cards_div.append("div")
    .attr("id", "player_money_area");

const computer_cards_area = computer_cards_div.append("div")
    .attr("id", "computer_cards_area");
const computer_money_area = computer_cards_div.append("div")
    .attr("id", "computer_money_area");

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
    console.log(table_cards);

    //detect which combination


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


    UNCOVER_SEQUENCE();

    function UNCOVER_SEQUENCE() {
        if (game.round.uncovered >= 0) { // if a card has already been uncovered
            game_cards_area.selectAll("span").remove();

            var uncovered = game.round.uncovered;
            uncovered++; // one more card is uncovered
            game.round.uncovered = uncovered;

            for (var i = 0; i < uncovered; i++) { // uncover cards according to how many are already uncovered
                game_cards_area.append("span")
                    .html(` ${table_cards[i]},`);
            }
        }

        game_start_btn.style("display", "none"); // hide start btn so it cannot be abused

        //PLAYER'S TURN ALWAYS FIRST
        player_inputs.style("display", "block");
        game_table_div.style("background-color", "lightgreen");
        game_turn_area.html("<br></br>YOUR TURN")

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
            computer_money_area.html(`YOUR MONEY: <span>${computer.money}</span>`);

            //add to rounds betted, has to be 2
            rounds_of_betting++;

            if (rounds_of_betting >= 2) {

                game_bet_area.html(`BETS: <span>0</span> | CURRENT MINIMUM BET: <span>0</span>`);
                game_stake_area.html(`ROUND STAKE: <span>${game.round.stakes + round_totbet}</span>`);
                game_table_div.style("background-color", "lightblue");
                game_turn_area.html("<br></br>CARD IS BEING UNCOVERED");

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

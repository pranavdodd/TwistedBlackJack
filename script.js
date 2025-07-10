let deck = [];
let playerHand = [];
let dealerHand = [];
let lieCard = null;
let scanned = false;

function createDeck() {
  let values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  deck = [];
  for (let i = 0; i < 4; i++) {
    deck.push(...values);
  }
  deck = deck.sort(() => 0.5 - Math.random());
}

function calculateTotal(hand) {
  let total = hand.reduce((a, b) => a + b, 0);
  while (total > 21 && hand.includes(11)) {
    hand[hand.indexOf(11)] = 1;
    total = hand.reduce((a, b) => a + b, 0);
  }
  return total;
}

function startGame() {
  document.getElementById("result").innerText = "";
  document.getElementById("next-game").style.display = "none";
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = false);

  scanned = false;
  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];

  let willLie = Math.random() < 0.2;
  lieCard = willLie ? randomLie(dealerHand[1]) : dealerHand[1];

  updateUI();

  const playerTotal = calculateTotal([...playerHand]);
  const dealerTotal = calculateTotal([...dealerHand]);

  if (playerTotal === 21) {
    endGame("Blackjack! You win.");
  } else if (dealerTotal === 21) {
    updateUI(true);
    endGame("Dealer has Blackjack. You lose.");
  }
}

function randomLie(realCard) {
  let lie;
  do {
    lie = deck[Math.floor(Math.random() * deck.length)];
  } while (lie === realCard);
  return lie;
}

function updateUI(showDealerFull = false) {
  document.getElementById("player-hand").innerHTML = playerHand
    .map(v => `<div class="card">${v}</div>`)
    .join('');
  document.getElementById("player-total").innerText = `Total: ${calculateTotal([...playerHand])}`;

  document.getElementById("dealer-up-card").innerText = dealerHand[0];
  document.getElementById("dealer-lie").innerText = lieCard;

  if (showDealerFull) {
    document.getElementById("dealer-hand").innerHTML = dealerHand
      .map(v => `<div class="card">${v}</div>`)
      .join('');
    document.getElementById("dealer-total").innerText = `Total: ${calculateTotal([...dealerHand])}`;
  }
}

function hit() {
  playerHand.push(deck.pop());
  updateUI();

  const total = calculateTotal([...playerHand]);
  if (total === 21) {
    stand();
  } else if (total > 21) {
    endGame("You busted. Dealer wins.");
  }
}

function stand() {
  let dealerTotal = calculateTotal([...dealerHand]);
  while (dealerTotal < 17) {
    dealerHand.push(deck.pop());
    dealerTotal = calculateTotal([...dealerHand]);
  }

  const playerTotal = calculateTotal([...playerHand]);
  updateUI(true);

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    endGame("You win.");
  } else if (playerTotal < dealerTotal) {
    endGame("Dealer wins.");
  } else {
    endGame("It's a tie.");
  }
}

function scan() {
  if (scanned) {
    alert("You've already used your scan.");
    return;
  }
  scanned = true;
  alert(`Truth Scan: The dealer's real face-down card is ${dealerHand[1]}.`);
}

function endGame(msg) {
  document.getElementById("result").innerText = msg;
  document.querySelectorAll(".controls button").forEach(btn => btn.disabled = true);
  document.getElementById("next-game").style.display = "inline-block";
}

window.onload = startGame;

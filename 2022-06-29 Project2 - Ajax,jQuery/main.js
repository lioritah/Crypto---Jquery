$(() => {
  function getDataAsync(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        showSpinner: () => $(`#spinner`),
        url,
        success: (result) => resolve(result),
        error: (err) => reject(err),
      });
    });
  }

  let coinsArr = [];

  function displayCoins(coins) {
    for (const coin of coins) {
      $(`section`).append(displayCard(coin));
    }
    coinsArr.push(coins);
  }

  function searchCoin() {
    $(`#searchBtn`).on(`click`, (event) => {
      event.preventDefault();
      let inputVal = $(`#searchInput`).val().toLowerCase();
      let symbolArr = [];
      for (let coin of coinsArr) {
        for (let key in coin) {
          let keySymbol = coin[key].symbol;
          symbolArr.push(keySymbol);
          for (let i = 0; i < symbolArr.length; i++) {
            if (symbolArr[i] === inputVal) {
              $("section").text(``);
              $(`#searchInput`).val(``);
              $("#aboutDivContainer").text(``);
              let cardInfo = coin[key];
              displayCard(cardInfo);
              return;
            } else {
              $("section").text(``);
              $("#aboutDivContainer").text(``);
              $(`#searchInput`).val(``);
              $(`section`).append(
                `<h2 id="notFoundSpan">Coin Not Found 🙁</h2>`
              );
            }
          }
        }
      }
    });
  }

  function displayCard(cardInfo) {
    $(`section`).append(
      `<div id="divContainer">
          <div class="card" style="width: 18rem">
          <div  class="form-check form-switch" id="Wrap_${cardInfo.symbol}">
          <input  class="form-check-input toggleChild" type="checkbox"  role="switch" id="${cardInfo.symbol}" >
          </div>
          <div class="card-body bg-dark">
          <h5 class="card-title text-white">${cardInfo.symbol}</h5>
          
          <p class="card-text text-white">${cardInfo.name}</p>
          <p>
          <button
          class="moreInfoBtn btn btn-success"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#${cardInfo.symbol}"
          id="${cardInfo.id}"
          aria-expanded="false"
          aria-controls="multiCollapseExample1 multiCollapseExample2"
          >
          More info
          </button>
          </p>
          <div class="row">
          <div class="col">
          <div class="collapse ${cardInfo.id}" id="${cardInfo.symbol}">
          <button class="btn btn-light" type="button" disabled>
          <span
          id="spinner"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          ></span>
          Loading...
          </button>
          </div>
          </div>
          </div>
          </div>
          </div>
          </div>`
    );
  }

  async function dataForCards() {
    try {
      const result = await getDataAsync(
        `https://api.coingecko.com/api/v3/coins`
      );
      displayCoins(result);
    } catch (err) {
      alert(err.status);
    }
  }

  function dataForMoreInfo() {
    $("section").on("click", ".moreInfoBtn", async (event) => {
      try {
        const currencyData = await getDataAsync(
          `https://api.coingecko.com/api/v3/coins/${event.target.id}`
        );
        displayMoreInfo(currencyData);
      } catch (err) {
        alert(err.status);
      }
    });
  }

  function displayMoreInfo(coins) {
    $(`.${coins.id}`).html(
      `<div class="card card-body bg-dark text-white">
                <img id="coinsImg" src="${coins.image.small}" />
                <p class="moreInfoP">
                The Value of the ${coins.id} in USD is :
                ${coins.market_data.current_price.usd}$
                </p>
                <p class="moreInfoP">
                The Value of the ${coins.id} in EUR is :
                ${coins.market_data.current_price.eur}€
                </p>
                <p class="moreInfoP">
                The Value of the ${coins.id} in ILS is :
                ${coins.market_data.current_price.ils}₪
                </p>
                </div>`
    );
    const moreInfoObj = {
      id: coins.id,
      usd: coins.market_data.current_price.usd,
      eur: coins.market_data.current_price.eur,
      ils: coins.market_data.current_price.ils,
    };

    setMoreInfoCoinToLocalStorage(moreInfoObj);
    setTimeout(() => {
      deleteFromLocal(moreInfoObj.id);
    }, 30000);
  }

  function aboutPage() {
    $(`body`).on(`click`, `#about`, () => {
      $("section").text(``);
      $(`#searchInput`).val(``);
      $("#aboutDivContainer").html(`
          <div><p class="fst-italic text-dark text-center">
          <h4>Hi, my name is Lior Itah</h4>
          <h5>I study at John Bryce and my knowledge is:
          HTML,
          CSS,
          Boostrap,
          Jquery,
          JavaScript,
          Advanced JavaScript,
          TypeScript,
          React...</h5>
          
          <h5>I will present to you my project, a website for trading in virtual currencies, I hope you enjoy it :)</h5>
          <p><img id="aboutImg" " src="assets/2022-02-24.png" /></p>
          </div>`);
    });
  }

  function liveReportPage() {
    $(`body`).on(`click`, `#liveReport`, () => {
      $("section").text(``);
      $(`#searchInput`).val(``);
      $("#aboutDivContainer").html(`
          <div>
          <p class="fst-italic text-dark text-center">
          Live Report
          </p>
          </div>`);
    });
  }

  function homePage() {
    $(`body`).on(`click`, `#home`, () => {
      $("#aboutDivContainer").text(``);
      $(`#searchInput`).val(``);
      $(`section`).html(dataForCards());
    });
  }
  function coinTrackSetToLocalStorage(coin) {
    const coins = coinTrackGetFromLocalStorage();
    coins.push(coin);
    localStorage.setItem("coinsToTrack", JSON.stringify(coins));
  }
  function deleteCoinToTrackFromLocal(coinId) {
    let coinsArr = coinTrackGetFromLocalStorage();
    const coinToRem = coinsArr.findIndex((coin) => coin === coinId);
    coinsArr.splice(coinToRem, 1);
    localStorage.setItem("coinsToTrack", JSON.stringify(coinsArr));
  }

  function coinTrackGetFromLocalStorage() {
    const storage = localStorage.getItem("coinsToTrack");
    return storage ? JSON.parse(storage) : [];
  }

  function addCoinsToDivAndDisplay(coins) {
    let content = "";
    $("#addCoinsToRemove").html("");
    for (const coin of coins) {
      content = `
          <div>
          <span>${coin}</span>
          <div class="form-check form-switch coinTrackPos">
          <input class="form-check-input" type="checkBox" role="switch" checked>
          </div>
          </div>
          `;
      $("#addCoinsToRemove").append(content);
    }
  }

  $("#closeArea").on("click", function () {
    const name = coinsToTrack[5];
    deleteCoinToTrackFromLocal(name);
    $(".removeOneFromTrackList").css("visibility", "hidden");
    document.getElementById(name).checked = false;
  });

  $("#addCoinsToRemove").on("click", ".form-check-input", function () {
    const coin = $(this).parent().prev().html();
    const coinToRem = coinsToTrack.find((co) => co === coin);
    deleteCoinToTrackFromLocal(coinToRem);
    document.getElementById(coin).checked = false;
    $(".removeOneFromTrackList").css("visibility", "hidden");
  });

  $("section").on("click", ".form-check-input", function () {
    const coinName = $(this).attr("id");
    if (this.checked) {
      coinTrackSetToLocalStorage(coinName);
    } else {
      deleteCoinToTrackFromLocal(coinName);
    }
    coinsToTrack = coinTrackGetFromLocalStorage();
    if (coinsToTrack.length > 5) {
      addCoinsToDivAndDisplay(coinsToTrack);

      $(".removeOneFromTrackList").css({
        visibility: "visible",
        position: "fixed",
      });
    }
  });

  function getMoreInfoCoinFromLocalStorage() {
    const storage = localStorage.getItem("cardMoreInfo");
    return storage ? JSON.parse(storage) : [];
  }

  function setMoreInfoCoinToLocalStorage(coin) {
    const allMoreInfoCoins = getMoreInfoCoinFromLocalStorage();

    allMoreInfoCoins.push(coin);
    localStorage.setItem(`cardMoreInfo`, JSON.stringify(allMoreInfoCoins));
  }

  function deleteFromLocal(coinId) {
    let coinsArr = getMoreInfoCoinFromLocalStorage();
    const coinToRem = coinsArr.findIndex((coin) => coin === coinId);
    coinsArr.splice(coinToRem, 1);
    localStorage.setItem("cardMoreInfo", JSON.stringify(coinsArr));
  }

  homePage();
  liveReportPage();
  aboutPage();
  dataForMoreInfo();
  dataForCards();
  searchCoin();
});

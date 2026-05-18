(function () {
  var form = document.getElementById("searchForm");
  var resultList = document.getElementById("resultList");
  var feedbackBox = document.getElementById("feedbackBox");
  var resultMeta = document.getElementById("resultMeta");

  if (!form || !resultList || !feedbackBox || !resultMeta) {
    return;
  }

  function getStatusLabel(status, remainingSeats) {
    if (status === "STOPPED") {
      return "停运";
    }

    if (status === "CLOSED" || remainingSeats <= 0) {
      return "停售";
    }

    return "可购票";
  }

  function renderResults(trains) {
    if (!trains.length) {
      resultList.innerHTML = "";
      feedbackBox.textContent = "未查询到符合条件的车次。";
      feedbackBox.style.display = "block";
      resultMeta.textContent = "共 0 条结果";
      return;
    }

    feedbackBox.style.display = "none";
    resultMeta.textContent = "共 " + trains.length + " 条结果";

    resultList.innerHTML = trains.map(function (train) {
      var statusLabel = getStatusLabel(train.status, train.remainingSeats);
      return (
        '<article class="result-item">' +
        '<div class="route-main">' +
        "<strong>" + train.trainNo + " " + train.fromStation + " → " + train.toStation + "</strong>" +
        '<p class="route-meta">发车：' + train.date + " " + train.departureTime + "</p>" +
        '<p class="route-meta">到达：' + train.arrivalTime + " / 历时：" + train.duration + "</p>" +
        "</div>" +
        '<div class="result-side">' +
        "<strong>票务信息</strong>" +
        "<p>票价：" + train.price.toFixed(2) + " 元</p>" +
        "<p>余票：" + train.remainingSeats + "</p>" +
        '<span class="status-pill">' + statusLabel + "</span>" +
        "</div>" +
        '<div class="result-action">' +
        '<a class="buy-btn" href="#">购票</a>' +
        "</div>" +
        "</article>"
      );
    }).join("");
  }

  function filterTrains(trains, fromStation, toStation, travelDate) {
    return trains.filter(function (train) {
      return (
        train.fromStation === fromStation &&
        train.toStation === toStation &&
        train.date === travelDate
      );
    });
  }

  function runSearch(fromStation, toStation, travelDate) {
    if (!fromStation || !toStation || !travelDate) {
      resultList.innerHTML = "";
      feedbackBox.textContent = "请完整填写出发地、目的地和出发日期。";
      feedbackBox.style.display = "block";
      resultMeta.textContent = "查询条件不完整";
      return;
    }

    fetch("../data/mock-trains.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (trains) {
        var results = filterTrains(trains, fromStation, toStation, travelDate);
        renderResults(results);
      })
      .catch(function () {
        resultList.innerHTML = "";
        feedbackBox.textContent = "本地车次数据加载失败。";
        feedbackBox.style.display = "block";
        resultMeta.textContent = "加载失败";
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fromStation = form.querySelector("#fromStation").value.trim();
    var toStation = form.querySelector("#toStation").value.trim();
    var travelDate = form.querySelector("#travelDate").value;

    runSearch(fromStation, toStation, travelDate);
  });

  var params = new URLSearchParams(window.location.search);
  var presetFrom = params.get("fromStation") || "";
  var presetTo = params.get("toStation") || "";
  var presetDate = params.get("travelDate") || "";

  if (presetFrom) {
    form.querySelector("#fromStation").value = presetFrom;
  }

  if (presetTo) {
    form.querySelector("#toStation").value = presetTo;
  }

  if (presetDate) {
    form.querySelector("#travelDate").value = presetDate;
  }

  if (presetFrom && presetTo && presetDate) {
    runSearch(presetFrom, presetTo, presetDate);
  }
})();

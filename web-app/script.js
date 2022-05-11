window.onload = () => {
  document.getElementById("subtext").classList.add("subtext-white");
  document.getElementById("love").innerHTML = twemoji.parse('❤️');
  document.getElementById("india").innerHTML = twemoji.parse('🇮🇳');
}

async function fetchTweet() {
  document.getElementById("tweet").innerHTML = "";
  document.getElementById("search").classList.remove("small");
  document.getElementById("result").classList.remove("result");
  document.getElementById("result").classList.remove("green");
  document.getElementById("result").classList.remove("red");
  document.getElementById("result").innerHTML = "";
  document.getElementById("loader").classList.add("lds-ring");
  document.getElementById("loader").innerHTML = "<div></div><div></div><div></div><div></div>";
  url = document.getElementById('url_field').value
  let data =
  {
    "url": url
  };
  await fetch('http://127.0.0.1:8000/tweet', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(res => {
      document.documentElement.scrollTop = 0;
      document.getElementById("loader").classList.remove("lds-ring");
      document.getElementById("loader").innerHTML = ""
      document.getElementById("result").classList.add("result");
      document.getElementById("search").classList.add("small");
      if (res["sentiment"] == 0) {
        document.getElementById("result").classList.add("red");
        document.getElementById("result").innerHTML = `<div class="result-text">This tweet has negative sentiments</div> ${twemoji.parse('😡')}`;
      }
      else {
        party.confetti(document.getElementById("container"), {
          shapes: ["square", "circle", "roundedRectangle"],
          count: party.variation.range(60, 100),
        });
        document.getElementById("result").classList.add("green");
        document.getElementById("result").innerHTML = `<div class="result-text">This tweet has positive sentiments</div> ${twemoji.parse('😇')}`;
      }
      twttr.widgets.createTweet(
        res["id"],
        document.getElementById("tweet"),
        {
          theme: "dark",
          width: "550",
          cards: "hidden",
          conversation: "none",
          align: "center"
        }
      );
    });
}
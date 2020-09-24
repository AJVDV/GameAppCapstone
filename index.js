'use strict';

// put your own value below!
const purl = "https://www.pricecharting.com/api/products?t=bb7f1cc220fb2a975df7cb4423efe9fc97ff80bb"
//const OathKey = "";
const clientID = '9zu3ty8lepetaysc7nn0rkpgdxpgep'; 
const searchTURL = 'https://api.twitch.tv/helix/games';
const searchTurl = 'https://api.twitch.tv/helix/streams';
const kurl = 'https://id.twitch.tv/oauth2/token';
const kOptions = {
    'client_id' : "9zu3ty8lepetaysc7nn0rkpgdxpgep",
    'client_secret' : "bvh4syksl7mjz28ookoowgysdi8on4",
    'grant_type' : "client_credentials"
}
function formatRequestParams(kOptions) {
    const optionItems = Object.keys(kOptions)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(kOptions[key])}`)
    return optionItems.join('&');
}
const optionsString = formatRequestParams(kOptions);
const kURL = kurl + '?' + optionsString;
console.log(kURL);

async function postData(Kurl='', data={}) {
    const response = await fetch(Kurl, {
        method : 'POST', 
        mode: 'cors',
        cache: 'default',
//        credentials: 'same-origin', 
/*
        headers: {
            'Content-Type': 'application/json',
//            'client_id' : '9zu3ty8lepetaysc7nn0rkpgdxpgep',
//            'client_secret': 'bvh4syksl7mjz28ookoowgysdi8on4',
//            'grant_type': 'client_credentials',
        },
*/       
        redirect: 'follow',
        //referrerPolicy: 'unsafe-url',
        body: JSON.stringify(data)
        
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getKey(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getKey(responseJson) {
  const searchTerm = $('#js-search-term').val();
  let OathKey = responseJson.access_token;
  console.log(OathKey);
//  return OathKey;
  getTwitchGame(searchTerm, OathKey)
}

function getTwitchGame(searchTerm, OathKey) {

  const params = {
    'client-id': clientID,
    'name': searchTerm,
    'Authorization': `Bearer ${OathKey}`
  };
  const queryString = formatQueryParams(params)
  const turl = searchTURL + '?' + queryString;

  console.log(turl);
  const options = {
      headers: {
          'client-id': "9zu3ty8lepetaysc7nn0rkpgdxpgep",
          Authorization: `Bearer ${OathKey}`
      }
  };

  fetch(turl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => pullGameId(responseJson, OathKey))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    
}

function pullGameId(responseJson, OathKey){
  const gameId = responseJson.data[0].id;
  console.log(gameId);
  getTwitchStreams(gameId, OathKey);
}

function getTwitchStreams(gameId, OathKey) {

  const params = {
    'client-id': clientID,
    'game_id': gameId,
    'Authorization': `Bearer ${OathKey}`
  };
  const queryString = formatQueryParams(params)
  const tURL = searchTurl + '?' + queryString;

  console.log(tURL);
  const options = {
      headers: {
          'client-id': "9zu3ty8lepetaysc7nn0rkpgdxpgep",
          Authorization: `Bearer ${OathKey}`
      }
  };

  fetch(tURL, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayStreams(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    
}

function displayStreams(responseJson) {
  console.log(responseJson);
  $('#twitch-results-list').empty();

  for (let i = 0; i < responseJson.data.length; i++){
    $('#twitch-results-list').append(
      `<li><h3>${responseJson.data[i].title}</h3>
      <p>${responseJson.data[i].user_name}</p>
      <p><a href='https://www.twitch.tv/${responseJson.data[i].user_name}' target="_blank">Watch Here!</a>
      </li>`
    )};
  
  $('#twitch-results').removeClass('hidden');
};

const apiKey = 'AIzaSyD4uHrKTK0XO3adEnHinC-dx53SNTpF8bM'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {

  
  $('#youtube-results-list').empty();

  for (let i = 0; i < responseJson.items.length; i++){
    $('#youtube-results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank"><img src='${responseJson.items[i].snippet.thumbnails.default.url}'></a>
      <p><a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank">Watch Here!</a>
      </li>`
    )};
  
  $('#youtube-results').removeClass('hidden');
};

function getYouTubeVideos(query, maxResults=20) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayPrices(responseJson){
    
    $('#priceCharting-results-list').empty();
    for (let i = 0; i < responseJson.products.length; i++){
      let loosePrice = (responseJson.products[i]["loose-price"])/100;
      loosePrice = loosePrice.toFixed(2);
      let newPrice = (responseJson.products[i]["new-price"])/100;
      newPrice = newPrice.toFixed(2);
     // let productName = responseJson.products[i].product-name;
      $('#priceCharting-results-list').append(
        `<li><h3>${responseJson.products[i]["product-name"]}</h3>
        <h4>${responseJson.products[i]["console-name"]}</h4>
        <p>Used price for this game is around $${loosePrice}.</p>
        <p>New price for this game is around $${newPrice}.</p>
        <p><a href='https://www.pricecharting.com/game/${responseJson.products[i].id}'>Check Detailed Pricing Here</a></p>
        </li>`
      )};

    $('#priceCharting-results').removeClass('hidden');
}

function getPrices(query){
    const pURL = purl + "&q=" + query;
    
    fetch(pURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayPrices(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); 
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    postData(kURL, kOptions);
//    getTwitchStreams(searchTerm);
    getYouTubeVideos(searchTerm);
    getPrices(searchTerm);
  });
}

$(watchForm);
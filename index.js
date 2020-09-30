'use strict';

//various variables are defined here to be used throughout this code.
const purl = "https://www.pricecharting.com/api/products?t=bb7f1cc220fb2a975df7cb4423efe9fc97ff80bb"
const clientID = '9zu3ty8lepetaysc7nn0rkpgdxpgep'; 
const searchTURL = 'https://api.twitch.tv/helix/games';
const searchTurl = 'https://api.twitch.tv/helix/streams';
const kurl = 'https://id.twitch.tv/oauth2/token';
const kOptions = {
    'client_id' : "9zu3ty8lepetaysc7nn0rkpgdxpgep",
    'client_secret' : "bvh4syksl7mjz28ookoowgysdi8on4",
    'grant_type' : "client_credentials"
}

//this formats some header definitions for retrieving the twitch OathKey, then stringifys the total url
function formatRequestParams(kOptions) {
    const optionItems = Object.keys(kOptions)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(kOptions[key])}`)
    return optionItems.join('&');
}
const optionsString = formatRequestParams(kOptions);
const kURL = kurl + '?' + optionsString;

//this code is a specific post request that allows the retrieval of the OathKey for twitch API
async function postData(Kurl='', data={}) {
    const response = await fetch(Kurl, {
        method : 'POST', 
        mode: 'cors',
        cache: 'default',       
        redirect: 'follow',
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

//this isolates the Key from the rest of the response for use later
function getKey(responseJson) {
  const searchTerm = $('#js-search-term').val();
  let OathKey = responseJson.access_token;
  getTwitchGame(searchTerm, OathKey)
}

//this initiates the twitch API to find the Game Id based on the game name entered and saves it for another api request
function getTwitchGame(searchTerm, OathKey) {

  const params = {
    'client-id': clientID,
    'name': searchTerm,
    'Authorization': `Bearer ${OathKey}`
  };
  const queryString = formatQueryParams(params)
  const turl = searchTURL + '?' + queryString;

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

//this portion of the code isolates the game ID from the response for use in the next function
function pullGameId(responseJson, OathKey){
  const gameId = responseJson.data[0].id;
  getTwitchStreams(gameId, OathKey);
}

//this takes the previously retrieved game ID and finds the top streams that match
function getTwitchStreams(gameId, OathKey) {

  const params = {
    'client-id': clientID,
    'game_id': gameId,
    'Authorization': `Bearer ${OathKey}`
  };
  const queryString = formatQueryParams(params)
  const tURL = searchTurl + '?' + queryString;

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

//takes the twitch api results and creates a readable/clickable set of results for the user to view
function displayStreams(responseJson) {
  $('#twitch-results-list').empty();

  for (let i = 0; i < responseJson.data.length; i++){
    let thumbnail = responseJson.data[i].thumbnail_url.replace('{width}', '225');
    thumbnail = thumbnail.replace('{height}', '150');
    $('#twitch-results-list').append(
      `<li><h3>${responseJson.data[i].title}</h3>
      <p>${responseJson.data[i].user_name}</p>
      <a href='https://www.twitch.tv/${responseJson.data[i].user_name}'  target="_blank"><img src="${thumbnail}" alt="twitch thumbnail here"></a>
      </li>`
    )};
  $('#twitch-results').removeClass('hidden');
};

const apiKey = 'AIzaSyBVXbhD9fgVMUbCwEHCaglJNVoOPHrcIS8'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

//this formats the parameters for youtube videos to conduct the api search
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

//takes the youtube api response and presents it in a viewable/clickable set of items
function displayResults(responseJson) {

  
  $('#youtube-results-list').empty();

  for (let i = 0; i < responseJson.items.length; i++){
    $('#youtube-results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank"><img src='${responseJson.items[i].snippet.thumbnails.default.url}'></a>
      </li>`
    )};
  
  $('#youtube-results').removeClass('hidden');
};

//this code makes the request to youtube api
function getYouTubeVideos(query, maxResults=20) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);

  

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

//this code displays a readable set of items based on the request to the PriceChartingAPI
function displayPrices(responseJson){
    
    $('#priceCharting-results-list').empty();
    for (let i = 0; i < responseJson.products.length; i++){
      let loosePrice = (responseJson.products[i]["loose-price"])/100;
      loosePrice = loosePrice.toFixed(2);
      let newPrice = (responseJson.products[i]["new-price"])/100;
      newPrice = newPrice.toFixed(2);
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

//this set of code makes the api request to PriceCharting to retrieve info based on game name.
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


//standard watchform function to initiate load, and to start all necessary functions on submission
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    postData(kURL, kOptions);
    getYouTubeVideos(searchTerm);
    getPrices(searchTerm);
  });
}

$(watchForm);
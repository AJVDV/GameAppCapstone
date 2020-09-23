'use strict';

// put your own value below!
const purl = "https://www.pricecharting.com/api/products?t=bb7f1cc220fb2a975df7cb4423efe9fc97ff80bb"
/*
const clientID = '9zu3ty8lepetaysc7nn0rkpgdxpgep'; 
const searchURL = 'https://api.twitch.tv/helix/games';
const kurl = 'https://id.twitch.tv/oauth2/token'
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
        method : 'Post', 
        mode: 'same-origin',
//        cache: 'default',
//        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
            'client_id' : '9zu3ty8lepetaysc7nn0rkpgdxpgep',
            'client_secret': 'bvh4syksl7mjz28ookoowgysdi8on4',
            'grant_type': 'client_credentials',
        },
        redirect: 'follow',
        //referrerPolicy: 'unsafe-url',
        body: JSON.stringify(data)
    });
    console.log(response.json());
    return response.json();
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getYouTubeVideos(query) {

  const params = {
//    'client-id': clientID,
    'query': query,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);
  const options = {
      headers: {
          'client-id': "9zu3ty8lepetaysc7nn0rkpgdxpgep",
          Authorization: `Bearer bvh4syksl7mjz28ookoowgysdi8on4`
      }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data=>console.log(data))
/*      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    */
//}
'use strict';

// put your own value below!
const apiKey = 'AIzaSyD4uHrKTK0XO3adEnHinC-dx53SNTpF8bM'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#youtube-results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#youtube-results-list').append(
      `<li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <img src='${responseJson.items[i].snippet.thumbnails.default.url}'>
      <p><a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank">Watch Here!</a>
      </li>`
    )};
  //display the results section  
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

function displayPrices(responseJson){
    console.log(responseJson);
    $('#priceCharting-results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.products.length; i++){
      // for each video object in the items 
      //array, add a list item to the results 
      //list with the video title, description,
      //and thumbnail
      $('#priceCharting-results-list').append(
        `<li><h3>${responseJson.products[i].product-name}</h3>
        <h4>${responseJson.products[i].console-name}</h4>
        <p>Used price for this game is around ${responseJson.products[i].loose-price}.</p>
        <p>New price for this game is around ${responseJson.products[i].new-price}.</p>
        <p><a href='https://www.pricecharting.com/game/${responseJson.products[i].id}>Check Detailed Pricing Here</a>
        </li>`
      )};
    //display the results section  
    $('#priceCharting-results').removeClass('hidden');
}

function getPrices(query){
    const pURL = purl + "&q=" + query;
    console.log(pURL)
    fetch(pURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayPrices(responseJson))
/*    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    }); */
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
//    postData(kURL, kOptions);
//    getTwitchStreams(searchTerm);
    getYouTubeVideos(searchTerm);
    getPrices(searchTerm);
  });
}

$(watchForm);
'use strict';

// put your own value below!
const purl = "https://www.pricecharting.com/api/products?t=bb7f1cc220fb2a975df7cb4423efe9fc97ff80bb"

const clientID = '9zu3ty8lepetaysc7nn0rkpgdxpgep'; 
const searchTURL = 'https://api.twitch.tv/helix/games';
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
        method : 'POST', 
        mode: 'cors',
//        cache: 'default',
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
    });
    const OathVar = response.json();
    console.log(OathVar);

}


function getTwitchStreams(query) {

  const params = {
    'client-id': clientID,
    'query': query,
    'Authorization': 'Bearer wk7c7ykwizs330wk0emyth8hi0tajw'
  };
  const queryString = formatQueryParams(params)
  const turl = searchTURL + '?' + queryString;

  console.log(turl);
  const options = {
      headers: {
          'client-id': "9zu3ty8lepetaysc7nn0rkpgdxpgep",
          Authorization: `Bearer bvh4syksl7mjz28ookoowgysdi8on4`
      }
  };

  fetch(turl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
    
}


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
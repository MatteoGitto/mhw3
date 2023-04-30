/*------------------------------*/
/*---------SPOTIFY--------------*/

/*rimuove la playlist generata*/
function rimuoviContenuto(event){
  const play=document.querySelector('#playlist');
  const play_2=document.querySelector('#no_play');
  play.innerHTML= '';
  play_2.innerHTML= '';
}

function visualizza_consigli(json){
  console.log("Tutto ok, json ricevuto");
  console.log(json);

  const playlist= document.querySelector("#playlist");
  playlist.innerHTML= '';

  let random= Math.floor(Math.random()*60); 

  for(let i=0;i<risultati_canzoni;i++ )
  {
    let item=json.tracks.items[random+i]; 
    console.log(random);

    const titolo=item.track.name;
    const artista=item.track.artists[0].name;
    const album_copertina=item.track.album.images[1].url;

    let link=document.createElement('a');
    const url_link = item.track.uri;
    link.href=url_link;
    link.textContent='Ascolta su Spotify'

    playlist.appendChild(link);

    let container = document.querySelector("#playlist")

    let song = document.createElement('div');
    song.classList.add('song');

    let copertina=document.createElement('img');
    copertina.src=album_copertina;
    copertina.classList.add('image_album')

    let title = document.createElement('h1');
    title.textContent='Titolo: ' + titolo;

    let artist = document.createElement('p');
    artist.textContent='Artista: ' + artista;

    
    song.appendChild(copertina);
    song.appendChild(title);
    song.appendChild(artist);
    song.appendChild(link);
    container.appendChild(song);
  }
    
  const eliminaPlaylist=document.createElement('button');
  eliminaPlaylist.textContent="Elimina playlist";
  no_play.innerHTML= '';
  no_play.appendChild(eliminaPlaylist);
  eliminaPlaylist.addEventListener('click',rimuoviContenuto);
}


function onSuccess(response){
  return response.json();
}

function consigli_musica(event){
  fetch("https://api.spotify.com/v1/playlists/3uP1gsZethpbTy9oJAx9C3",{
  method: 'GET',    
  headers:{
          Authorization: "Bearer "+ token
      }
  }).then(onSuccess).then(visualizza_consigli);
}

function onTokenJson(json){
  token=json.access_token;
}

function onError(error){
  console.log('Errore: ' + error)
}

function onTokenSuccess(response){
  return response.json();
}

//Credenziali OAuth
const id = 'ed91a4ffa6684b3f83320ecf2248c48b';
const secret= '9edfa9c86840493287c19f944775d89b';

let token; //token

fetch("https://accounts.spotify.com/api/token",
{
   method: "post",
   body: 'grant_type=client_credentials',
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(id + ':' + secret)
   }
}
).then(onTokenSuccess, onError).then(onTokenJson);

//aggiungo event listener al pulsante
const button=document.querySelector('button'); 
button.addEventListener('click', consigli_musica);

const risultati_canzoni=4; //scelgo di mostrare 4 canzoni

/*-------------------------------------------------*/
/*--------------GFYCAT-----------------------------*/
/*Ogni volta che viene cliccata un'immagine per aprire il video Youtube, sotto esce la gif dei Maneskin che salutano*/
function Imposto_Gif(json){
  console.log(json);
  
  const gif=document.querySelector('#gif');
  gif.innerHTML='';
  const Thumbnail_for_gif = document.createElement('img');

  Thumbnail_for_gif.src=json.gfyItem.gifUrl;
  gif.appendChild(Thumbnail_for_gif);
}

function onToken4(json){
  console.log(json)
  token4=json.access_token;
}

function onResponse4(response){
  return response.json();
}

function gif() {
const client_id="2_ouJ2aw";
const client_secret="gZZrJKh1L1iw6DmQsu_Arj3hUCAYUuFNR8r5S1IFpeW1RC1VEDn4Bx8InvoGlTsB";

  const setup_body = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "client_credentials",
  };

  let body = JSON.stringify(setup_body);

  fetch("https://api.gfycat.com/v1/oauth/token", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then(onResponse4).then(onToken4);
}

let token4;
gif();
/*-------------------------------------------------*/
/*-------------LAST FM-----------------------------*/

function onJson(json) {

  console.log('JSON ricevuto');
  console.log(json)

  const last_fm = document.querySelector('#lastfm');
  last_fm.innerHTML = '';

  let num_results = 6; //verranno visualizzati solo 6 TOP-Album
  let j=0;

  const result=json.topalbums.album

  for(let i=0; j<num_results; i++) {

    const song_data = result[i]

    // Leggiamo le info
    const title = song_data.name;
    console.log(title);
    console.log('il titolo: null?'); //controllo se il titolo e' null
    console.log(song_data.name);

    const images = song_data.image;
    console.log(images);
    let selected_image = images;

    for(let image of images)
    {
      if(image.size == 'large')
        selected_image = image['#text'];
        console.log(selected_image);
        if(selected_image=='') //controllo se selected_image e' vuota
        console.log('Error selected_image');
    }

    //controllo per scartare album 
    if (song_data.name != '(null)' && selected_image!='') {
      j++;

      //il div contiene l'immagine dell'album ed il titolo 
      const album = document.createElement('div');
      album.classList.add('album');

      const img = document.createElement('img');
      img.src = selected_image;

      const caption = document.createElement('p');
      caption.textContent = title;

      album.appendChild(img);
      album.appendChild(caption);
    
      last_fm.appendChild(album);
    }
  }
}
  

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
  }
  
  /*GET TOP ALBUM*/
  function search(event)
  {
    // impedisce il submit del form
    event.preventDefault();

    const artista_input = document.querySelector('#cerca_nome_artista');
    const artista_value = encodeURIComponent(artista_input.value);
    console.log('Eseguo ricerca: ' + artista_value);

    url = 'http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=' + artista_value + '&api_key=' + api_key + '&format=json';
    console.log('URL: ' + url);
    
    fetch(url).then(onResponse).then(onJson);
    window.scrollTo(0,5000);
  }

  const api_key = 'dfef4d87fd76b2c1310276fb6ae374ce';

  const form = document.querySelector('form');
  form.addEventListener('submit', search)

/*-----------------------------------*/
/*-----------YOUTUBE----------------*/
function onJson3(json){
  console.log(json);
  const playlist= document.querySelector("#youtube_view");
  playlist.innerHTML= '';

  let items=json.items

  let container_yt = document.querySelector("#youtube_view")

  const Thumbnail = document.createElement('img');
  const Song_Title = document.createElement('p');
  const link = document.createElement('a');

  link.href = items[0].url;
  link.textContent = "Guarda su YouTube";
  Song_Title.textContent = items[0].title;
  Thumbnail.src = items[0].bestThumbnail.url;
  
  container_yt.appendChild(Thumbnail);
  container_yt.appendChild(Song_Title);
  container_yt.appendChild(link);

  fetch("https://api.gfycat.com/v1/gfycats/shockedwideacornweevil", {
    method: "get",
    headers: {
      Authorization: "Bearer " + token4,
    },
  })
    .then(onResponse4).then(Imposto_Gif);
}

function onResponse3(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

const RapidAPI = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'd9be6f9712msh6b8a4df326af12fp117cf2jsnaa58863fd163',
		'X-RapidAPI-Host': 'youtube-search-results.p.rapidapi.com'
	}
};

function Youtube_Search(cerca_artista){
  const youtube_search_artista = encodeURI(cerca_artista);
  console.log(youtube_search_artista);
  const link_yt = 'https://youtube-search-results.p.rapidapi.com/youtube-search/?q=' + youtube_search_artista;
  fetch(link_yt, RapidAPI).then(onResponse3).then(onJson3);
}

function AlClick(event){
  const button = event.currentTarget;
  console.log(button.dataset.id_nome_artista);
  Youtube_Search(button.dataset.id_nome_artista);
  window.scrollTo(0,5000);
}

const yt_click=document.querySelectorAll(".block_img");
console.log("START YT")

for (const block of yt_click ){
  block.addEventListener('click', AlClick);
}
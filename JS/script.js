let currentSong = new Audio(); 
let songs;
let currFolder;
async function getsong(folder) {
    currFolder= folder;
    // let a = await fetch('http://127.0.0.1:5501/WEB-DEVLOP/SpotifyClone/song/')
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
   songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }
    }
    // show all song in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""  // for after click on card song placed inside container

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img class="invert" src="img/musics.svg" alt="" srcset="">
                <div class="info">
                    <div> ${song.replaceAll("%20", " ")}</div>
                     
               </div>
                <div class="playnow">
                    <span>play now</span>
                    <img class="invert" src="https://cdn.hugeicons.com/icons/play-circle-stroke-sharp.svg" alt="play-circle" width="28" height="28">
                </div>
                
        </li>`;


        
    }
    //attach an event listeneer to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach( e=> {
        // console.log(e);
        e.addEventListener("click",element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return songs;
}

const playMusic = (track,pause=false)=>{
    // let audio= new Audio("/project/song/" + track)
    currentSong.src = `/${currFolder}/` + track

    if(!pause){
        currentSong.play();
      play.src="img/pause.svg";   // if song play then it is stop
    }

    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";

}
// for Autometic play next song when time is ended
const playNextSong = () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
    }
};

// listen for time update
currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    // for seekbar movement
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    // Automatic next song play logic
    if (currentSong.currentTime >= currentSong.duration - 1) {
        playNextSong();
    }
});

// const playMusic = (track)=>{
//     // let audio = new Audio("/song/"+track)
//     currentSong.src = "/song/"+track
//     currentSong.play();

// }


//**- convert seconds to minutes:seconds function

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function display(){
    let a = await fetch(`http://127.0.0.1:5501/WEB-DEVLOP/SpotifyClone/song/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".cardContainer")
    // console.log(div);
//    Array.from(anchors).forEach(async e=>{
    // console.log(e.href)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if(e.href.includes("/WEB-DEVLOP/SpotifyClone/song/")){
          let folder = e.href.split("/").slice(-2)[1];
        //   console.log(folder)
        
            // get mete data 

            let a = await fetch(`http://127.0.0.1:5501/WEB-DEVLOP/SpotifyClone/song/${folder}/info.json`)

            let response= await a.json();
            // console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML+`<div data-folder="${folder}" class="card">
            <div  class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"
                    fill="none" xmlns:xlink="http://www.w3.org/1999/xlink" role="img">
                    <!-- Circular background with padding -->
                    <circle cx="24" cy="24" r="20" fill="#00FF00" />

                    <!-- SVG icon container with black background -->
                    <g transform="translate(12, 12)" style="background-color: #000;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="#000000" stroke-width="1.5" stroke-linejoin="round">
                            <!-- Triangle icon with black fill -->
                            <path d="M6 20V4L19 12L6 20Z" fill="#000"></path>
                        </svg>
                    </g>
                </svg>
            </div>
            <img src="/WEB-DEVLOP/SpotifyClone/song/${folder}/cover.jpg" alt="" />
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div> `
        }
    }
    // console.log(anchors)
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        // console.log(e);
        e.addEventListener("click",async item=>{
        //   console.log(item,item.currentTarget.dataset)  // currentTarget se card per kahi click karenge to jo chahiye wahi dega ex. folder
           songs=await getsong(`WEB-DEVLOP/SpotifyClone/song/${item.currentTarget.dataset.folder}`)
          playMusic(songs[0])
        })
    })

}

async function main() {
    
    
    //get the list the song
    await getsong("WEB-DEVLOP/SpotifyClone/song/ncs")
    // console.log(songs)

    // for autometic play music first song
    playMusic(songs[0], true)

    // display All the albumb on the page
  display();

    //attach an event listiener to play , next and previus
   play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play();
        play.src="img/pause.svg";
    }
    else{
        currentSong.pause();
        play.src="img/play.svg";
    }
   })
    

    // listen for time update

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        // for seekbar movment
         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add eventListner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
   
    //**-Add eventListner on humburger for responsive

    document.querySelector(".humburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left ="0";
    })

    //**-Add eventListner on close for responsive

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left ").style.left  ="-120%";
      })

    // Adda event listner on previous 
     previous.addEventListener("click",()=>{
      console.log("prev clicked")
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
     })

        // Adda event listner on next
    
        next.addEventListener("click",()=>{
        currentSong.pause()
        // console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
       
        })

        // Add eventListner on volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
            // console.log(e)
            //  console.log(e.target.value) // for calculate volume
            // console.log("cliked volume");
            currentSong.volume= parseInt(e.target.value)/100
        })

        // // Load the playlist whenever the card was clicked

        // Array.from(document.getElementsByClassName("card")).forEach(e=>{
        //     // console.log(e);
        //     e.addEventListener("click",async item=>{
        //     //   console.log(item,item.currentTarget.dataset)  // currentTarget se card per kahi click karenge to jo chahiye wahi dega ex. folder
        //        songs=await getsong(`WEB-DEVLOP/SpotifyClone/song/${item.currentTarget.dataset.folder}`)
        //        playMusic(songs[0])
        //     })
        // })


        // Add eventListner to mute the volume icon

        document.querySelector(".volume>img").addEventListener("click",e=>{
        //   console.log("clocked")
          if(e.target.src.includes("img/volume.svg")){
            e.target.src= e.target.src.replace("img/volume.svg","img/unmute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
          }
          else{
            e.target.src= e.target.src.replace("img/unmute.svg","img/volume.svg")
            currentSong.volume=.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=20;
          }
        })
}
main()


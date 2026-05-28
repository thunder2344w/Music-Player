console.log("lets write javascript");
let currentSong = new Audio();
let songs;

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



async function getSongs() {
    let songs = [];
    try {
        let a = await fetch("/songs.json");
        if (a.ok) {
            songs = await a.json();
            return songs;
        }
    } catch (e) {
        console.log("Failed to fetch songs.json, trying directory listing");
    }

    try {
        let a = await fetch("/songs/");
        let response = await a.text();
        let div = document.createElement("div")
        div.innerHTML = response;
        let as = div.getElementsByTagName("a")
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(element.getAttribute("href")))
            }
        }
    } catch(e) {
        console.error("Failed to fetch directory listing:", e);
    }
    return songs
}

const playMusic = (track, pause=false) => {
    // let audio = new Audio("songs/" + track)
    currentSong.src = "songs/" + track
    if(!pause){
        currentSong.play();
        play.src = "img/pause2.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function main() {

    songs = await getSongs();
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Thunder</div>
                            </div>
                            <div class="playnow">
                                <div>PlayNow</div>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                            </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause2.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/greenplay.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${ secondsToMinutesSeconds(currentSong.duration)} `
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 +"%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent)/100 ;
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0" ;
    })

    document.querySelector(".closebutton").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%" ;
    })

    preview.addEventListener("click", ()=>{
        console.log("previews clicked")

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
    })

     next.addEventListener("click", ()=>{
        console.log("next clicked")

        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]))
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

}

main();

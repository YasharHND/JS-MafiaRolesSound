const items = [
    {
        id: "ok"
    },
    {
        id: "all-mafia",
        selfDeactivate: true
    },
    {
        id: "godfather-show",
        selfDeactivate: true
    },
    {
        id: "putana-show",
        selfDeactivate: true
    },
    {
        id: "godfather",
        notDisableOthers: ["mafia"]
    },
    {
        id: "mafia"
    },
    {
        id: "putana"
    },
    {
        id: "godfather-kill"
    },
    {
        id: "sherif"
    },
    {
        id: "switch-man"
    },
    {
        id: "doctor"
    },
    {
        id: "maniac"
    },
    {
        id: "silencer"
    },
    {
        id: "bomb",
        selfDeactivate: true
    },
    {
        id: "bomb-places",
        selfDeactivate: true
    },
    {
        id: "good-morning"
    }
];

let musicInitialized = false;
const audioElement = new Audio("audio/miss-monique-concorde.mp3");
audioElement.loop = true;
const musicButton = document.getElementById("music");

musicButton.addEventListener("click", function () {
    if (musicInitialized === false) {
        const audioContext = new AudioContext();
        const gainNode = audioContext.createGain();
        const sourceNode = audioContext.createMediaElementSource(audioElement);
        sourceNode.connect(gainNode).connect(audioContext.destination);
        gainNode.gain.value = 0.07;
        musicInitialized = true;
    }
    if (audioElement.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}, false);

const playMusic = () => {
    audioElement.play();
    const classes = document.getElementById("music-icon").classList;
    classes.remove("fa-play");
    classes.add("fa-pause");
}

const pauseMusic = () => {
    audioElement.pause();
    const classes = document.getElementById("music-icon").classList;
    classes.remove("fa-pause");
    classes.add("fa-play");
}

const goodMorningButton = document.getElementById("good-morning");
goodMorningButton.addEventListener("click", () => pauseMusic());

items.forEach(item => {
    const audio = new Audio(`audio/${item.id}.mp3`);
    audio.addEventListener("ended", () => {
        if (playingQueue.length > 0) {
            const nextAudioFile = playingQueue.shift();
            nextAudioFile.play();
        } else {
            playing = false;
            enableButtons();
        }
    });
    item.audio = audio;
    const button = document.getElementById(item.id);
    button.addEventListener("click", () => {
        if (item.selfDeactivate === true) {
            item.deactivated = true;
        }
        play(item);
    });
    let buttonLongPressTimer;
    const buttonTouchEndListener = (event) => {
        event.stopPropagation();
        clearTimeout(buttonLongPressTimer);
    };
    const buttonTouchStartListener = (event) => {
        event.stopPropagation();
        buttonLongPressTimer = window.setTimeout(() => {
            button.disabled = true;
            item.deactivated = true;
        }, 500);
    };
    button.addEventListener("touchend", buttonTouchEndListener);
    button.addEventListener("touchstart", buttonTouchStartListener);
    button.addEventListener("mouseup", buttonTouchEndListener);
    button.addEventListener("mousedown", buttonTouchStartListener);
    let parentLongPressTimer;
    const parentTouchEndListener = () => clearTimeout(parentLongPressTimer);
    const parentTouchStartListener = () => {
        if (playing) {
            return;
        }
        parentLongPressTimer = window.setTimeout(() => {
            button.disabled = false;
            item.deactivated = false;
            play(item, true);
        }, 500);
    };
    button.parentElement.addEventListener("touchend", parentTouchEndListener);
    button.parentElement.addEventListener("touchstart", parentTouchStartListener);
    button.parentElement.addEventListener("mouseup", parentTouchEndListener);
    button.parentElement.addEventListener("mousedown", parentTouchStartListener);
    item.button = button;
});

const disableButtons = (notDisable) => {
    musicButton.disabled = true;
    notDisable = notDisable || [];
    items.forEach(item => {
        if (!notDisable.includes(item.id)) {
            item.button.disabled = true;
        }
    });
}

const enableButtons = () => {
    musicButton.disabled = false;
    items.forEach(item => {
        if (item.deactivated !== true) {
            item.button.disabled = false;
        }
    });
}

let playing = false;
const playingQueue = [];

const play = (item, forceDisableAll = false) => {
    if (playing) {
        item.button.disabled = true;
        playingQueue.push(item.audio);
    } else {
        playing = true;
        item.audio.play();
        disableButtons(forceDisableAll ? [] : item.notDisableOthers);
    }
};

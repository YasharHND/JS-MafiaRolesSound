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
    button.addEventListener("mouseup", (event) => {
        event.stopPropagation();
        clearTimeout(buttonLongPressTimer);
    });
    button.addEventListener("mousedown", (event) => {
        event.stopPropagation();
        buttonLongPressTimer = window.setTimeout(() => {
            button.disabled = true;
            item.deactivated = true;
        }, 500);
    });
    let parentLongPressTimer;
    button.parentElement.addEventListener("mouseup", (event) => {
        clearTimeout(parentLongPressTimer);
    });
    button.parentElement.addEventListener("mousedown", (event) => {
        parentLongPressTimer = window.setTimeout(() => {
            button.disabled = false;
            item.deactivated = false;
            play(item);
        }, 500);
    });
    item.button = button;
});

const disableButtons = (notDisable) => {
    notDisable = notDisable || [];
    items.forEach(item => {
        if (!notDisable.includes(item.id)) {
            item.button.disabled = true;
        }
    });
}

const enableButtons = () => {
    items.forEach(item => {
        if (item.deactivated !== true) {
            item.button.disabled = false;
        }
    });
}

let playing = false;
const playingQueue = [];

const play = (item) => {
    if (playing) {
        item.button.disabled = true;
        playingQueue.push(item.audio);
    } else {
        playing = true;
        item.audio.play();
        disableButtons(item.notDisableOthers);
    }
};

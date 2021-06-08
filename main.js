import * as SynthSettings from "../synth-settings.js"

const notesPerCol = 10;
const numOfCols = 16;
let playReverse =  -1; //-1 forward, 0 forward and backward, 1 only backward
let firstColToBePlayed = 0;
let lastColToBePlayed = 15;
let scale = getScale('A3', notesPerCol, "pentatonic");

let grid = makeGrid(scale);
let musicNotes = convertGridToMusicNotes();

let buttonGrid = document.createElement("div");
document.body.appendChild(buttonGrid);
buttonGrid.className = "button-grid";

let settingsDiv = document.createElement("div");
document.body.appendChild(settingsDiv);
settingsDiv.id = "settings-div"
function getScale(firstNote, numNotes, scaleType) {
    let scale = {
        major: [0, 2, 4, 5, 7, 9, 11, 12],
        minor: [0, 2, 3, 5, 7, 8, 10, 12],
        pentatonic: [0, 2, 4, 7, 9, 12]
    };

    let freq = Tone.Frequency(firstNote).harmonize(scale[scaleType]);
    while (freq.length < numNotes) {
        let freq2 = Tone.Frequency(freq[freq.length - 1]).harmonize(scale[scaleType]);
        freq2.shift(); // remove redundant first element
        freq = freq.concat(freq2);
    }
    return freq.slice(0, numNotes);
}

function makeGrid (colNotes) {
    colNotes = colNotes.reverse();
    let grid = [];
    for (let i = 0; i < numOfCols; i++) {
        let col = []
        for (let j = 0; j < notesPerCol; j++) {
            col.push({note: colNotes[j], pressed: false });
        }
        grid.push(col);
    }
    return grid;
}

function handleButtonClick(e, colIndex, noteIndex) {
    let curNote = grid[colIndex][noteIndex];
    curNote.pressed = !curNote.pressed;
    if (e.currentTarget.className == "note unpressed") {
        e.currentTarget.className = "note pressed";
    }
    else {
        e.currentTarget.className = "note unpressed";
    }
    musicNotes = convertGridToMusicNotes();
}

function makeButtons () {
    grid.forEach((col, colIndex) => {
        let column = document.createElement("div");
        buttonGrid.appendChild(column);
        column.className = 'column';
        col.forEach((note, noteIndex) => {
            let btn = document.createElement("button");
            btn.className = "note unpressed"
            btn.innerHTML = grid[colIndex][noteIndex].note.toNote();
            btn.id = "c" + colIndex + "n" + noteIndex;
            btn.addEventListener("click", (e) => handleButtonClick(e, colIndex, noteIndex));

            column.appendChild(btn);

        })
    })
}

function convertGridToMusicNotes() {
    let playedNotes = [];
    grid.forEach((column, columnIndex) => {
        let c = [];
        column.forEach((n, nIndex) => {
            if (n.pressed == true) {
                c.push(n.note);
            }
        });
        playedNotes.push(c);
    });

    return playedNotes;
}

function updateGrid(colNotes) {
    colNotes = colNotes.reverse();
    grid.forEach((col, colIndex) => {
        col.forEach((n, noteIndex) => {
            document.getElementById("c" + colIndex + "n" + noteIndex).innerHTML =  grid[colIndex][noteIndex].note.toNote();
            n.note = colNotes[noteIndex];
        })
    })
}

function makeScaleSettingsDiv() {
    let scaleSettings = document.createElement("div");
    scaleSettings.innerHTML = "<b>scale settings</b>";
    scaleSettings.id = "scale-settings"
    scaleSettings.className = "scale-info";
    document.getElementById("settings-div").appendChild(scaleSettings);

    return scaleSettings;
}

function handleScaleSelection(e) {
    let scale = getScale('A3', notesPerCol, e.target.value);
    updateGrid(scale);
    musicNotes = convertGridToMusicNotes();
}

function createScaleSelector() {
    let scaleSelector = document.createElement("select");
    scaleSelector.size = 3;
    scaleSelector.addEventListener('change', (e) => {
        handleScaleSelection(e);
    })
    scaleSettingsDiv.appendChild(scaleSelector);
    let scaleTypes = ["major", "minor", "pentatonic"];
    for (let i = 0; i < scaleTypes.length; i++) {
        let scaleOption = document.createElement("option");
        scaleOption.value = scaleTypes[i];
        scaleOption.text = scaleTypes[i];
        scaleSelector.appendChild(scaleOption);
    }
    return scaleSelector;
}


async function startPlaying () {
    await Tone.start();
    if (!isPlaying) {
        playButton.innerHTML = "stop";
        playButton.className = "stopped";
        isPlaying = true;
        await Sequencer.start();
        await Tone.Transport.start();
    } else {
        isPlaying = false;
        playButton.innerHTML = "play";
        playButton.className = "playing"
        await Tone.Transport.stop();
        await Sequencer.stop();
        for (let i = 0; i < numOfCols; i++) {
            buttonGrid.childNodes[i].className = buttonGrid.childNodes[i].className.replace("cur-col", "");
        }
    }
}

function generateSequencerEvents(firstCol, lastCol, playRev) {
    let seq = [];
    for (let i = firstCol; i <= lastCol; i++) {
        seq.push(i);
    }
    let seqRev = (seq.slice(0, seq.length - 1).reverse()).slice(0, seq.length - 2);

    if (playRev == -1) {
        return seq;
    }
    else if (playRev == 0){

        return seq.concat(seqRev);
    }
    else {
        return seq.reverse();
    }
}

let lastCol = -1;
const Sequencer = new Tone.Sequence(
    (time, column) => {
        synth.triggerAttackRelease(musicNotes[column], "8n", time);
        if (firstColToBePlayed == lastColToBePlayed) {
            buttonGrid.childNodes[column].className = "column cur-col";
        }
        else {
            buttonGrid.childNodes[column].className += " cur-col";
            if (lastCol == -1) {

            } else {
                buttonGrid.childNodes[lastCol].className = "column";
            }
        }
        lastCol = column;
    },
    generateSequencerEvents(firstColToBePlayed, lastColToBePlayed, playReverse),
    "8n"
);

function updateStartEndCols(startInput, endInput) {
    let start = startInput.value;
    let end = endInput.value;
    if ((start > end) || (start < 0) || (end > (numOfCols - 1))) {
        firstColToBePlayed = 0;
        lastColToBePlayed = 15;
        startInput.value = 0;
        endInput.value = 15;
    } else {
        firstColToBePlayed = start;
        lastColToBePlayed = end;
    }

    (buttonGrid.childNodes).forEach((col) => {
        col.className = "column";
    })

    let sEvents = generateSequencerEvents(firstColToBePlayed, lastColToBePlayed, playReverse);
    Sequencer.set({
        events: sEvents
    });

}
function makePlayColAdjusters() {
    let startColInput = document.createElement("input");
    startColInput.type = "number";
    startColInput.min = "0";
    startColInput.max = ((numOfCols) - 1).toString();
    startColInput.defaultValue = "0";

    let endColInput = document.createElement("input");
    endColInput.type = "number";
    endColInput.min = "0";
    endColInput.max = ((numOfCols) - 1).toString()
    endColInput.defaultValue = (numOfCols - 1).toString();

    let changeColsPlaying = document.createElement("button");
    changeColsPlaying.innerHTML = "change playing columns";
    changeColsPlaying.addEventListener("click", (e) => {
        updateStartEndCols(startColInput, endColInput);
    })

    let startLabel = document.createElement("label");
    startLabel.innerHTML = "start column: ";
    let endLabel = document.createElement("label");
    endLabel.innerHTML = "end column: ";

    let colSettingsDiv = document.createElement("div");
    colSettingsDiv.id = "playback-settings";
    colSettingsDiv.innerHTML = "<b>Playback Settings</b>";
    document.getElementById("settings-div").appendChild(colSettingsDiv);
    colSettingsDiv.appendChild(startColInput);
    colSettingsDiv.appendChild(endColInput);
    colSettingsDiv.appendChild(changeColsPlaying);

    colSettingsDiv.insertBefore(startLabel, startColInput);
    colSettingsDiv.insertBefore(endLabel, endColInput);
}

makePlayColAdjusters();

function makeForwardReverseOptions() {
    let directionSelector = document.createElement("select");
    directionSelector.size = 3;
    directionSelector.addEventListener('change', (e) => {
        playReverse = e.target.value;
        let sEvents = generateSequencerEvents(firstColToBePlayed, lastColToBePlayed, playReverse);
        Sequencer.set({
            events: sEvents
        });
    })
    document.getElementById("playback-settings").appendChild(directionSelector);
    let directionOptions = ["forward", "forward and reverse", "reverse"];
    for (let i = 0; i < directionOptions.length; i++) {
        let directionOption = document.createElement("option");
        directionOption.value = i-1;
        directionOption.text = directionOptions[i];
        if (i==0) {
            directionOption.selected = true;
        }
        directionSelector.appendChild(directionOption);

    }
    return directionSelector;
}

makeForwardReverseOptions();
function makePlayButton(){
    let playDiv = document.createElement("div");
    playDiv.id = "play-div";
    let isPlaying = false;
    let playbtn = document.createElement("button");
    playbtn.id = "play-btn"
    playbtn.className = "playing"
    playbtn.innerHTML = "play";
    document.body.appendChild(playDiv);
    playDiv.appendChild(playbtn);
    playbtn.addEventListener("click", startPlaying);
    return [isPlaying, playbtn];
}

function makeBPMSlider() {
    let slider = document.createElement("input");
    let bpmLabel = document.createElement("label");
    bpmLabel.innerHTML = "BPM: 120";
    slider.type = "range";
    slider.min = "60";
    slider.max = "240";
    slider.step= "1";
    slider.value = "120"
    slider.addEventListener('change', (e) => {
        Tone.Transport.bpm.value = e.target.value;
        bpmLabel.innerHTML = "BPM:" + e.target.value;
    })

    scaleSettingsDiv.appendChild(slider);
    scaleSettingsDiv.insertBefore(bpmLabel, slider);
    return slider;

}

let scaleSettingsDiv = makeScaleSettingsDiv();
let scaleSelector = createScaleSelector();

const [synth, synthOptions] = SynthSettings.makeOptionsDiv();

makeButtons();

let [isPlaying, playButton] = makePlayButton();

let bpmSlider = makeBPMSlider();

scaleSelector.selectedIndex = 2;

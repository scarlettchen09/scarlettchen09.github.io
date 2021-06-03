
// import * as Tone from "./node_modules/tone/build/Tone.js"
import * as SynthSettings from "../synth-settings.js"

const notesPerCol = 10;
const numOfCols = 16;

let scale = getScale('A3', notesPerCol, "pentatonic");

let grid = makeGrid(scale);
let musicNotes = convertGridToMusicNotes();

let buttonGrid = document.createElement("div");
document.body.appendChild(buttonGrid);
buttonGrid.className = "button-grid";
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
    console.log(e.currentTarget.className + " " + e.currentTarget.id);
}

function makeButtons () {
    grid.forEach((col, colIndex) => {
        let column = document.createElement("div");
        buttonGrid.appendChild(column);
        column.className = 'column';
        col.forEach((note, noteIndex) => {
            let btn = document.createElement("button");
            btn.className = "note unpressed"
            //btn.innerHTML = grid[colIndex][noteIndex].note.toMidi();
            btn.innerHTML = "b" + (notesPerCol - noteIndex);
            btn.id = "c" + colIndex + "b" + noteIndex;
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
    playedNotes.forEach((column) => {
        console.log(column);
    });
    return playedNotes;
}

function updateGrid(colNotes) {
    colNotes = colNotes.reverse();
    grid.forEach((col) => {
        col.forEach((n, nIndex) => {
            n.note = colNotes[nIndex];
        })
    })
}

function makeScaleSettingsDiv() {
    let scaleSettings = document.createElement("div");
    scaleSettings.innerHTML = "<b>scale settings</b>";
    scaleSettings.className = "scale-info";
    document.body.appendChild(scaleSettings);

    return scaleSettings;
}

function handleScaleSelection(e) {
    console.log(e.target.value + notesPerCol);
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
        isPlaying = true;
        await Sequencer.start();
        await Tone.Transport.start();
    } else {
        isPlaying = false;
        playButton.innerHTML = "play";
        await Tone.Transport.stop();
        await Sequencer.stop();
        for (let i = 0; i < numOfCols; i++) {
            buttonGrid.childNodes[i].className = buttonGrid.childNodes[i].className.replace("cur-col", "");
        }
        //await Sequencer.clear();
        //await Sequencer.dispose();
    }
}

function generateSequencerEvents() {
    let seq = [];
    for (let i = 0; i < numOfCols; i++) {
        seq.push(i);
    }
    return seq
}

const Sequencer = new Tone.Sequence(
    (time, column) => {
        synth.triggerAttackRelease(musicNotes[column], "8n", time);
        buttonGrid.childNodes[column].className += " cur-col";
        if (column != 0) {
            buttonGrid.childNodes[column - 1].className =
                buttonGrid.childNodes[column - 1].className.replace("cur-col", "");
        } else {
            buttonGrid.childNodes[numOfCols - 1].className =
                buttonGrid.childNodes[numOfCols - 1].className.replace("cur-col", "");
        }

    },
    generateSequencerEvents(),
    "8n"
);

function makePlayButton(){
    let isPlaying = false;
    let playbtn = document.createElement("button");
    playbtn.className = "play"
    playbtn.innerHTML = "play";
    document.body.appendChild(playbtn);
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
const omniOsc = new Tone.OmniOscillator("C#4", "pwm").toDestination();

scaleSelector.selectedIndex = 2;

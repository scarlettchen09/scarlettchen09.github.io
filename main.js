const notesPerCol = 8;
const numOfCols = 8;

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

const makeGrid = function (colNotes) {
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

function updateGrid(grid, colNotes) {
    colNotes = colNotes.reverse();
    grid.forEach((col) => {
        col.forEach((n, nIndex) => {
            n.note = colNotes[nIndex];
        })
    })
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


let scale = getScale('A3', notesPerCol, "pentatonic");
var grid = makeGrid( scale);
var musicNotes = convertGridToMusicNotes();
var buttonGrid = document.createElement("div");
document.body.appendChild(buttonGrid);
buttonGrid.className = "button-grid";


const synth = new Tone.PolySynth().toDestination();

makeButtons();

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

//Sequencer.start();
let isPlaying = false;
let playbtn = document.createElement("button");
playbtn.className = "play"
playbtn.innerHTML = "play";
document.body.appendChild(playbtn);
playbtn.addEventListener("click", startPlaying);

async function startPlaying () {
    await Tone.start();
    if (!isPlaying) {
        playbtn.innerHTML = "stop";
        isPlaying = true;
        await Sequencer.start();
        await Tone.Transport.start();
    } else {
        isPlaying = false;
        playbtn.innerHTML = "play";
        await Tone.Transport.stop();
        await Sequencer.stop();
        for (let i = 0; i < numOfCols; i++) {
            buttonGrid.childNodes[i].className = buttonGrid.childNodes[i].className.replace("cur-col", "");
        }
        //await Sequencer.clear();
        //await Sequencer.dispose();
    }
}

const musicInfo = document.createElement("div");
musicInfo.innerHTML = "<b> current scale: </b>";
document.body.appendChild(musicInfo);

function handleScaleSelection(e) {
    console.log(e.target.value + notesPerCol);
    scale = getScale('A3', notesPerCol, e.target.value);
    updateGrid(grid, scale);
    musicNotes = convertGridToMusicNotes();
}

function createScaleSelector() {
    let scaleSelector = document.createElement("select");
    scaleSelector.size = 3;
    scaleSelector.addEventListener('change', (e) => {
        handleScaleSelection(e);
    })
    musicInfo.appendChild(scaleSelector);
    scaleTypes = ["major", "minor", "pentatonic"];
    for (let i = 0; i < scaleTypes.length; i++) {
        let scaleOption = document.createElement("option");
        scaleOption.value = scaleTypes[i];
        scaleOption.text = scaleTypes[i];
        scaleSelector.appendChild(scaleOption);
    }
    return scaleSelector;
}
const synthOptions = document.createElement("div");
synthOptions.innerHTML = "<b>synth settings:</b>";
synthOptions.className = "synth-info";
document.body.appendChild(synthOptions);
const crusher = new Tone.BitCrusher(4).toDestination();
const omniOsc = new Tone.OmniOscillator("C#4", "pwm").toDestination();
synth.set ({
    envelope: {
        attack: 0,
        decay: .5,
        sustain: .5,
        release: .3
    }
});
function makeADSRSliders() {
    let ADSRdiv = document.createElement("div");
    ADSRdiv.className = "adsr";
    synthOptions.appendChild(ADSRdiv);
    let attackLabel = document.createElement("label");
    attackLabel.innerHTML = "attack";

    let decayLabel = document.createElement("label");
    decayLabel.innerHTML = "decay";

    let sustainLabel = document.createElement("label");
    sustainLabel.innerHTML  = "sustain";

    let releaseLabel = document.createElement("label");
    releaseLabel.innerHTML = "release";

    let attackSlider = document.createElement("input");
    attackSlider.type = "range";
    attackSlider.min = "0";
    attackSlider.max = "8";
    attackSlider.step= "0.1";
    attackSlider.value = "0";
    ADSRdiv.appendChild(attackSlider);
    attackSlider.addEventListener('change', (e) => {
        console.log(e.target.value);
        synth.set ({
            envelope: {
                attack: e.target.value
            }
        });
    })

    let decaySlider = document.createElement("input");
    decaySlider.type = "range";
    decaySlider.min = "0";
    decaySlider.max = "8";
    decaySlider.step= "0.1";
    decaySlider.value = ".5";
    ADSRdiv.appendChild(decaySlider);
    decaySlider.addEventListener('change', (e) => {
        console.log(e.target.value);
        synth.set ({
            envelope: {
                decay: e.target.value
            }
        });
    })

    let sustainSlider = document.createElement("input");
    sustainSlider.type = "range";
    sustainSlider.min = "0";
    sustainSlider.max = "1";
    sustainSlider.step= "0.03";
    sustainSlider.value = ".5"
    ADSRdiv.appendChild(sustainSlider);
    sustainSlider.addEventListener('change', (e) => {
        console.log(e.target.value);
        synth.set ({
            envelope: {
                sustain: e.target.value
            }
        });
    })

    let releaseSlider = document.createElement("input");
    releaseSlider.type = "range";
    releaseSlider.min = ".1";
    releaseSlider.max = "8";
    releaseSlider.step= "0.1";
    releaseSlider.value = ".3"
    ADSRdiv.appendChild(releaseSlider);
    releaseSlider.addEventListener('change', (e) => {
        console.log(e.target.value);
        synth.set ({
            envelope: {
                release: e.target.value
            }
        });
    })
    ADSRdiv.insertBefore(attackLabel, attackSlider);
    ADSRdiv.insertBefore(decayLabel, decaySlider);
    ADSRdiv.insertBefore(sustainLabel, sustainSlider);
    ADSRdiv.insertBefore(releaseLabel, releaseSlider);
}

function makeEffectOptions() {
    let crushCheck = document.createElement("input");
    let crushLabel = document.createElement("crushLabel");
    crushLabel.innerHTML = "bitcrush";

    crushCheck.type = "checkbox";
    crushCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            synth.connect(crusher);
        } else {
            synth.disconnect(crusher);
        }
    })

    synthOptions.appendChild(crushCheck);
    synthOptions.insertBefore(crushLabel, crushCheck);

}
let scaleSelector = createScaleSelector();
let slider = makeADSRSliders();
let effectOptions = makeEffectOptions();

scaleSelector.selectedIndex = 2;

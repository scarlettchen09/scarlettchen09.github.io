// function makeScaleSettingsDiv() {
//     let scale = getScale('A3', notesPerCol, "pentatonic");
//
//     let scaleSettings = document.createElement("div");
//     scaleSettings.innerHTML = "<b>scale settings</b>";
//     scaleSettings.className = "scale-info";
//     document.body.appendChild(scaleSettings);
//
//     let scaleSelector = createScaleSelector(scaleSettings);
//
//     return [scaleSettings, scaleSelector];
//
// }
//
// function getScale(firstNote, numNotes, scaleType) {
//     let scale = {
//         major: [0, 2, 4, 5, 7, 9, 11, 12],
//         minor: [0, 2, 3, 5, 7, 8, 10, 12],
//         pentatonic: [0, 2, 4, 7, 9, 12]
//     };
//
//     let freq = Tone.Frequency(firstNote).harmonize(scale[scaleType]);
//     while (freq.length < numNotes) {
//         let freq2 = Tone.Frequency(freq[freq.length - 1]).harmonize(scale[scaleType]);
//         freq2.shift(); // remove redundant first element
//         freq = freq.concat(freq2);
//     }
//     return freq.slice(0, numNotes);
// }
//
// function handleScaleSelection(e) {
//     console.log(e.target.value + notesPerCol);
//     let scale = getScale('A3', notesPerCol, e.target.value);
//     updateGrid(grid, scale);
//     let musicNotes = convertGridToMusicNotes();
// }
//
// function createScaleSelector(scaleDiv) {
//     let scaleSelector = document.createElement("select");
//     scaleSelector.size = 3;
//     scaleSelector.addEventListener('change', (e) => {
//         handleScaleSelection(e);
//     })
//     scaleDiv.appendChild(scaleSelector);
//     let scaleTypes = ["major", "minor", "pentatonic"];
//     for (let i = 0; i < scaleTypes.length; i++) {
//         let scaleOption = document.createElement("option");
//         scaleOption.value = scaleTypes[i];
//         scaleOption.text = scaleTypes[i];
//         scaleSelector.appendChild(scaleOption);
//     }
//     return scaleSelector;
// }
// export {makeScaleSettingsDiv, getScale};

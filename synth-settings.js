
function makeOptionsDiv() {
    let synth = new Tone.PolySynth(Tone.AMSynth).toDestination();

    synth.set ({
        envelope: {
            attack: 0,
            decay: .5,
            sustain: .5,
            release: .3
        }
    });

    let synthOptions = document.createElement("div");
    synthOptions.innerHTML = "<b>synth settings:</b>";
    synthOptions.className = "synth-info";
    document.getElementById("settings-div").appendChild(synthOptions);


    makeADSRSliders(synthOptions, synth);
    makeEffectOptions(synthOptions, synth);
    return [synth, synthOptions];
}

function makeADSRSliders(synthOptions, synth) {
    let ADSRdiv = document.createElement("div");
    ADSRdiv.id = "adsr";
    synthOptions.appendChild(ADSRdiv);
    let attackLabel = document.createElement("label");
    attackLabel.innerHTML = "attack: ";

    let decayLabel = document.createElement("label");
    decayLabel.innerHTML = "decay: ";

    let sustainLabel = document.createElement("label");
    sustainLabel.innerHTML  = "sustain: ";

    let releaseLabel = document.createElement("label");
    releaseLabel.innerHTML = "release: ";

    let attackSlider = document.createElement("input");
    attackSlider.type = "range";
    attackSlider.min = "0.1";
    attackSlider.max = "5";
    attackSlider.step= "0.1";
    attackSlider.value = "0.1";
    ADSRdiv.appendChild(attackSlider);
    attackLabel.innerHTML += attackSlider.value;
    attackSlider.addEventListener('change', (e) => {
        attackLabel.innerHTML = "attack: " + e.target.value;
        synth.set ({
            envelope: {
                attack: e.target.value
            }
        });
    })

    let decaySlider = document.createElement("input");
    decaySlider.type = "range";
    decaySlider.min = "0.5";
    decaySlider.max = "4";
    decaySlider.step= "0.1";
    decaySlider.value = ".5";
    ADSRdiv.appendChild(decaySlider);
    decayLabel.innerHTML += decaySlider.value;
    decaySlider.addEventListener('change', (e) => {
        decayLabel.innerHTML = "decay: " + e.target.value;
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
    sustainLabel.innerHTML += sustainSlider.value;
    sustainSlider.addEventListener('change', (e) => {
        sustainLabel.innerHTML = "sustain: " + e.target.value;
        synth.set ({
            envelope: {
                sustain: e.target.value
            }
        });
    })

    let releaseSlider = document.createElement("input");
    releaseSlider.type = "range";
    releaseSlider.min = ".1";
    releaseSlider.max = "5";
    releaseSlider.step= "0.1";
    releaseSlider.value = ".3"
    ADSRdiv.appendChild(releaseSlider);
    releaseLabel.innerHTML += releaseSlider.value ;
    releaseSlider.addEventListener('change', (e) => {
        releaseLabel.innerHTML = "release: " + e.target.value ;
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

function makeEffectOptions(synthOptions, synth) {
    let pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();
    let pingPongCheck = document.createElement("input");
    let pingPongLabel = document.createElement("label");
    pingPongLabel.innerHTML = "ping pong delay";

    pingPongCheck.type = "checkbox";
    pingPongCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            synth.connect(pingPong);
        } else {
            synth.disconnect(pingPong);
        }
    })

    synthOptions.appendChild(pingPongCheck);
    synthOptions.insertBefore(pingPongLabel, pingPongCheck);

}
export {makeOptionsDiv};
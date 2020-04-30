let playing = false;
let playButtonElem = null;

let ts = 0;
let lastPlayPress = 0;
let relativeTime = 0;
let qu = 0;

let bpm = 128;

let noteTimer = 0;

let midiDeviceIndex = -1;

function play(e)
{
    ts = e;
    updatePlayButton();
    if (playing)
    {
        relativeTime = e - lastPlayPress;
        //console.log("play");
        noteTimer = relativeTime;

        if (noteTimer > qu * ((60000 / bpm) / 4))
        {
            playStep();
            qu++;            
        }
        updateTransportShow(noteTimer);

        //let quarterNote = 60000 / bpm;
        //if (relativeTime % quarterNote > 0)
    }
    else
    {
        qu = 0;
    }
    //console.log(qu);
    requestAnimationFrame(play);
}

function playStep()
{
    for (e in channels)
    {
        let step = channels[e].getCurrentStep();
        if (step)
        {
            //MIDI Implementation here:
            let note = channels[e].getMidiNote();
            console.log(note.note, note.midiChannel, note.velocity);
            if (midiDeviceIndex != -1)
            {
                WebMidi.outputs[midiDeviceIndex].playNote(note.note, note.midiChannel, note.velocity);
            }
        }
    }
    advanceStep();
}

function initTransport(elements)
{
    playButtonElem = elements;
    initMidi();
    requestAnimationFrame(play);
}

function playButton()
{
    playing = playing ? false : true;

    if (playing)
    {
        lastPlayPress = ts;
    }
    else
    {
        resetInternalCounters();
    }
}

function updatePlayButton()
{
    playButtonElem.forEach((e) => {e.value = playing ? "Stop" : "Play"});
}

function advanceStep()
{
    for (e in channels)
    {
        //console.log(e);
        channels[e].next();
    }
}

function changeBpm(e)
{
    console.log(e);
    bpm = e.value;
    changeBpmUi();
}

function changeBpmUi()
{
    document.querySelectorAll("[data-role='bpm']")
    .forEach((e) => {
        e.value = bpm;
    });
}

//MIDI Implementation here:
function initMidi()
{
    WebMidi.enable(function (err) {
        if (err) throw err;

        console.log(WebMidi.outputs);

        //output = WebMidi.outputs[1];

        document.querySelectorAll("[data-role='device']").forEach((e) => {
            createDeviceDropdown(e, WebMidi);
            if (WebMidi.outputs.length == 0)
            {
                e.disabled = true;
            }
            e.addEventListener("change", changeDevice);
        });
    });
}

function createDeviceDropdown(origin, midi)
{
    if (WebMidi.outputs.length != 0)
    {
        for (let e = 0; e < midi.outputs.length; e++) {
            console.log(midi.outputs);
            let option = document.createElement("option");
            option.value = e;
            option.innerText = midi.outputs[e].name;
            origin.append(option);
        };
    }
    else
    {
        let option = document.createElement("option");
        option.value = -1;
        option.innerText = "--no devices available--";
        origin.append(option);
    }
}

function changeDevice(e)
{
    console.log(e.srcElement);
    midiDeviceIndex = getSelectedOption(e.srcElement);
}

function updateTransportShow(val)
{
    document.querySelectorAll("[data-role='position-view']")
    .forEach((e) => {
        let pos = qu * ((60000 / bpm) / 4);
        console.log(pos / 16, qu);
    });
}
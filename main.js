const STEPSEQUENCER = 0;

let stepSequencerCount = 0;

window.onload = function()
{
    console.log("Hello World!");
    this.document.getElementById("addNewStepSequencer")
        .addEventListener("click", this.appendNewSequencer);

    //Append a new Sequencer on start
    appendNewSequencer();

    initTransport(document.querySelectorAll("[data-role='playbutton']"));
}

function getStepSequencerCount()
{
    return stepSequencerCount;
}

function appendNewSequencer()
{
    document.querySelectorAll("span#channels")
    .forEach((e) => {
        e.append(createInputsForChannel());
        stepSequencerCount = ++e.dataset.sequencers;
    });
}

function deleteSpecificSequencer(id)
{
    document.querySelectorAll("[data-id='" + id + "'][data-type='0'")
    .forEach((e) => {
        console.log(e);
        console.log(e.parentElement.dataset);

        delete channels[id];

        //e.parentElement.dataset.sequencers--;
        //stepSequencerCount = e.parentElement.dataset.sequencers;

        e.parentElement.removeChild(e);
    });
}

function createInputsForChannel(stepCounter = 16)
{
    //create the channel strip which holds all inputs
    let channelStrip = document.createElement("div");
    channelStrip.dataset.id = getStepSequencerCount();
    channelStrip.dataset.type = STEPSEQUENCER;

    let steps = document.createElement("div");
    steps.className = "step-selector";

    for (let i = 0; i < stepCounter; i++)
    {
        let tmpInput = document.createElement("input");
        tmpInput.type = "checkbox";
        tmpInput.dataset.step = i;
        tmpInput.dataset.channel = getStepSequencerCount();
        tmpInput.dataset.buttonType = STEPSEQUENCER;

        tmpInput.addEventListener("change", stepClickHandler);
        steps.append(tmpInput);
    }
    channelStrip.append(steps);

    createStepSequencerBackend(channelStrip);

    //add midi channel selector
    let channelSettings = document.createElement("div");
    channelSettings.className = "channel-settings";
    channelSettings.append(createMidiSelector(getStepSequencerCount()));

    let noteSelector = document.createElement("input");
    noteSelector.value = "C5";
    noteSelector.addEventListener("change", setChannelNoteUi);
    channelSettings.append(noteSelector);

    let delSequencer = document.createElement("input");
    delSequencer.type = "button";
    delSequencer.dataset.forSequencer = channelStrip.dataset.id;
    delSequencer.value = "-";
    delSequencer.addEventListener("click", (e) => {deleteSpecificSequencer(getAssociatedStepSequencerForDeleteButton(e))})
    channelSettings.append(delSequencer);

    channelStrip.append(channelSettings);

    return channelStrip;
}

function getAssociatedStepSequencerForDeleteButton(e)
{
    return e.srcElement.dataset.forSequencer;
}

function getStepFromStepHandler(e)
{
    return (
        e.srcElement.dataset.buttonType == STEPSEQUENCER
        ? e.srcElement.dataset.step
        : null
    );
}

function getChannelFromStepHandler(e)
{
    return (
        e.srcElement.dataset.buttonType == STEPSEQUENCER
        ? e.srcElement.dataset.channel
        : null
    ); 
}

function stepClickHandler(e)
{
    e.stopPropagation();
    e.srcElement.checked = false;
    let step = getStepFromStepHandler(e);
    let channel = getChannelFromStepHandler(e);

    checkStep(channel, step);
    return false;
}

function createMidiSelector(id ,preselectedChannel = 0)
{
    let select = document.createElement("select");
    select.dataset.channel = id;
    for (let i = 0; i < 16; i++)
    {
        let option = document.createElement("option");
        option.value = i + 1;
        option.innerText = i + 1;
        select.append(option);
    }

    select.addEventListener("change", setMidiChannelUi);

    return select;
}
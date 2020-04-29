let channels = {}

function getStep(channel, step)
{
    return channels[channel].steps[step].play;
};

class Channel
{
    constructor(strip)
    {
        this.id = parseInt(strip.dataset.id);
        this.stepCount = strip.querySelector(".step-selector").childElementCount;

        this.stepSelectorElement = strip.querySelector(".step-selector").children;

        this.steps = new Array(this.stepCount);

        this.internalStepPointer = 0;

        this.midiChannel = 1;

        console.log(strip);

        this.note = "C5";

        for (let i = 0; i < this.stepSelectorElement.length; i++)
        {
            this.steps[i] = new Step(this.stepSelectorElement[i]);
        }
        console.log(this);
    }

    switch(step)
    {
        this.steps[step].switch();
    }

    next()
    {
        this.refreshActiveStep();
        this.internalStepPointer++;
        if (this.internalStepPointer > this.stepCount - 1)
        {
            this.resetInternalCounters();
        }

        return this.internalStepPointer;
    }

    resetInternalCounters()
    {
        this.internalStepPointer = 0;
    }

    getCurrentStep()
    {
        console.log(this.internalStepPointer);
        return this.steps[this.internalStepPointer].play;
    }

    setMidiChannel(channel)
    {
        this.midiChannel = parseInt(channel);
    }

    getMidiChannel()
    {
        return this.midiChannel;
    }

    setNote(note)
    {
        this.note = note;
    }

    getMidiNote(vel = 1)
    {
        return {
            "note": this.note,
            "midiChannel": this.midiChannel,
            "velocity": vel
        }
    }

    refreshActiveStep()
    {
        for (let e = 0; e < this.stepSelectorElement.length; e++)
        {
            //console.log(this.stepSelectorElement[e])
            this.stepSelectorElement[e].disabled = false;

            if (this.stepSelectorElement[e].dataStep == this.internalStepPointer)
            {
                this.stepSelectorElement[e].disabled == true;
            }
        };
    }
}

class Step
{
    constructor(htmlElement = null)
    {
        this.associatedElement = htmlElement;
        this.play = false;
        this.associatedElement.checked = this.play;
    }

    switch()
    {
        this.play = this.play ? false : true;
        this.associatedElement.checked = this.play;
    }
}

function createStepSequencerBackend(element)
{
    console.log(element);
    channels[element.dataset.id] = new Channel(element);
}

function checkStep(id, step)
{
    channels[id].switch(step);
}

function setMidiChannel(id, channel)
{
    console.log("Setting Seq" + id + " to Midi Channel " + channel);
    channels[id].setMidiChannel(channel);
}

function setMidiChannelUi(e)
{
    let channelId = e.srcElement.dataset.channel;
    midiChannel = getSelectedOption(e.srcElement);
    setMidiChannel(channelId, midiChannel);
    //console.log(channelId);
}

function getSelectedOption(optionsElement)
{
    console.log(optionsElement);
    return optionsElement.options[optionsElement.selectedIndex].value;
}

function setChannelNote(id, note)
{
    channels[id].setNote(note);
}

function setChannelNoteUi(e)
{
    let note = e.srcElement.value;
    let channelId = e.srcElement.parentElement.parentElement.dataset.id;
    console.log(e.srcElement);
    setChannelNote(channelId, note);
}

function resetInternalCounters()
{
    for (let e in channels)
    {
        channels[e].resetInternalCounters();
    }
}
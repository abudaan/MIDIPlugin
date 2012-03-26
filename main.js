/*
 * MIDIAccess is the Javascript object that represents the MIDI plugin. 
 * Define MIDIAccess globally so your program can access it from anywhere.
 */
var MIDIAccess;

window.addEventListener('load', function() {
                
    MIDIAccess = document.getElementById("MIDIPlugin");

    var data = document.getElementById("data");
    var connect = document.getElementById("connect");
    var clearLog = document.getElementById("clear-log");
    var connection = document.getElementById("connection");
    var midiInputs = document.getElementById("midi-in");
    var midiOutputs = document.getElementById("midi-out");

    var currentMidiInputId = -1;
    var currentMidiOutputId = -1;
    var midiMessages = "";
    
    
    var printMIDIMessage = function(arg){
        var tmp = arg.split(",");
        var newMessage = "<div class='notenumber'>notenumber: <strong>" + tmp[0] + "</strong></div></div class='velocity'>velocity: <strong>" + tmp[1] + "</strong></div><br/>";   
        midiMessages = newMessage + midiMessages;
        data.innerHTML = midiMessages;
    };
                
    /*
     * Register a callback object for the plugin so it can communicate with Javascript.
     * This is done by passing a Javascript object to the plugin so the plugin can call its methods.
     * Currently only the function printMIDIMessage() is passed to the plugin; when MIDI data arrives at an inport, this
     * method is invoked by the plugin.
     */
    MIDIAccess.registerCallbackObject ({
        printmessage:printMIDIMessage
    });
    
    
    //clear the MIDI messages log
    clearLog.addEventListener("click",function(){
        data.innerHTML = "";
    },false);
                                             
    
    //setup the dropdown menus
    midiInputs.addEventListener("change", function() {
        var device = midiInputs.options[midiInputs.selectedIndex];
        currentMidiInputId = device.id.replace(/input-/,"");
    }, false);
                
    midiOutputs.addEventListener("change", function() {
        var device = midiOutputs.options[midiOutputs.selectedIndex];
        currentMidiOutputId = device.id.replace(/output-/,"");
    }, false);
                                
                
    var populateDropDownMenu = function(dropdownMenu,deviceType,devices) {
        //inner function that create options for the dropdown menus
        var createOption = function(id, label) {
            var option = document.createElement("option");
            option.setAttribute("id", id);
            option.innerHTML = label;
            return option;
        }               
        /*
         * The index of the MIDI device in the array its internal id; you have to use this id if you
         * want to use the device, @see the eventlistener of the 'connect' button below.             
         */
        var i = 0;
        while(devices[i]) {
            var id = deviceType + "-" + i
            dropdownMenu.appendChild(createOption(id, devices[i]));
            i++;
        }
    }
                                               
    /*
     * Get the MIDI in- and outputs from the plugin and populate the dropdown menus.
     */
    var inputs = MIDIAccess.getMIDIInputs();
    populateDropDownMenu(midiInputs,"input",inputs.split(","));
    var outputs = MIDIAccess.getMIDIOutputs();
    populateDropDownMenu(midiOutputs,"output",outputs.split(","));
                
    /*
     * If the user clicks the 'connect' button, a connection between the chosen MIDI in- and outport get established by the plugin.
     */
    connect.addEventListener("click",function(){
        //console.log(currentMidiInputId, currentMidiOutputId);
        var result = "";
        connection.innerHTML = result;
        if(currentMidiInputId == -1){
            result = "Please choose an input";
        }else if(currentMidiOutputId == -1){
            result = MIDIAccess.addConnection(currentMidiInputId);
        }else{
            result = MIDIAccess.addConnection(currentMidiInputId, currentMidiOutputId);
        }
        connection.innerHTML = result;
    },false);
                                                
},false);


//close all connections to your MIDI devices 
window.onbeforeunload = function() {
    MIDIAccess.cleanup(); 
};



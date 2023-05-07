
var options = {
    angle: 0.2,
    penumbra: 0,
    intensity: 1    
};

function initGUI() {

    var gui = new dat.GUI();

    gui.add(options, 'angle', 0, 1);
    gui.add(options, 'penumbra', 0, 1);
    gui.add(options, 'intensity', 0, 1);
}
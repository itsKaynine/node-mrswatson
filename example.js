var mrswatson = require("./mrswatson");

// Cutsom directory for VST plugins (optional)
mrswatson.pluginRoot = "K:\\Program Files (x86)\\VstPlugins";

// List plugins
mrswatson.listPlugins(function(err, plugins) {
	if (err)
		return console.error("ERROR: \n", err);

	console.log(plugins);
});

//////////////////////////////////////////////////////////////////////
// EXAMPLE A: Process audio with a single VST effect with parameters
//////////////////////////////////////////////////////////////////////
var obj = {
	inputFile: "C:\\test.wav",
	outputFile: "C:\\example_a.wav",
	plugins: ["dblue Crusher"],
	parameters: ["0,0.2", "5,0.99"]
};

mrswatson.processAudio(obj, function(err, result) {
	if (err)
		return console.error("ERROR: \n", err);

	// Print the result log
	console.log(result);
});

//////////////////////////////////////////////////////////////////////
// EXAMPLE B: Process audio with chain of VST effects (with presets)
//////////////////////////////////////////////////////////////////////
var obj2 = {
	inputFile: "C:\\test.wav",
	outputFile: "C:\\example_b.wav",
	plugins: [
		// NOTE: these two notations are equivalent
		"dblue Crusher,C:\\dblue_preset.fxp",
		["CamelCrusher", "C:\\camel_preset.fxp"],
	]
};

mrswatson.processAudio(obj2, function(err, result) {
	if (err)
		return console.error("ERROR: \n", err);

	// Print the result log
	console.log(result);
});
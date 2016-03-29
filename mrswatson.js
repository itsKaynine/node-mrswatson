//////////////////////////////////////////////////////////////////////////
// >> node-mrswatson <<
// Credit: node-vst-host
//////////////////////////////////////////////////////////////////////////

var SHOW_DEBUG_PRINTS = false;																		
var log = function(a) { if(SHOW_DEBUG_PRINTS) console.log(a); };	// A log function we can turn off

var child_process = require('child_process');

module.exports = {
	pluginRoot: null,

	//////////////////////////////////////////////////////////////////////////
	// Process some audio with some plugins
	processAudio: function(opts, callback) {
		// MrsWatson wants our plugin names in a more compact string
		var strPluginNames = "";
		for(var iPlugin in opts.plugins) {
			var item = opts.plugins[iPlugin];
			// Without presets
			if (typeof(item) === "string") {
				strPluginNames += item;
			}
			// With presets
			else if (typeof(item) === 'object' && item.length >= 2) {
				strPluginNames += item[0] + "," + item[1];
			}
			
			if(iPlugin != opts.plugins.length - 1 )
				strPluginNames += ";";
		}

		commandArgs = [ 
			"--input", opts.inputFile,
			"--output", opts.outputFile,
			"--plugin", strPluginNames
		];
		appendPluginRoot(commandArgs);
		
		if (opts.parameters) {
			for(var p in opts.parameters) {
				var param = opts.parameters[p];
				commandArgs.push("--parameter");
				commandArgs.push(param);
			}
		}

		log(commandArgs);

		runWatsonCommand(commandArgs, function(results) {
			log(results);

			if (callback) {
				if (results.indexOf("[error") != -1) {
					// TODO: more meaningful error handling
					callback(results, null);
				}
				else {
					callback(null, results);
				}
			}
		});
	},


	//////////////////////////////////////////////////////////////////////////
	// List available plugins
	listPlugins: function(callback) {
		arguments = [ 
			"--list-plugins"
		];
		appendPluginRoot(arguments);

		runWatsonCommand(arguments, function(results) {
			log(results);

			var lines = results.match(/[^\r\n]+/g),
				pluginNames = [],
				locations = [];

			// Remove the characters that aren't part of the name
			for(var iLine in lines) {
				var thisLine = lines[iLine];

				// If this is just a line telling us that we don't have any
				// plugins here, skip it
				if(thisLine.indexOf("(Empty or non") != -1 || thisLine.indexOf("(No plugins found") != -1) {
					continue;
				}

				if(thisLine.indexOf("Location '") != -1) {
					locations.push(thisLine.substr(thisLine.indexOf("Location")));
					continue;
				}

				// If we've gotten this far, this is a plugin name
				// Remove the junk that's there to make the prompt look good
				pluginNames.push(thisLine.substr(20));
			}

			log(pluginNames);

			if (callback)
				callback(null, pluginNames);
		});
	}
}

function appendPluginRoot(arr) {
	if (module.exports.pluginRoot) {
		arr.push("--plugin-root");
		arr.push(module.exports.pluginRoot);
	}
};

function runCommand(command, args, end) {
	var commandContext = this,
		data = "";

    var spawn = child_process.spawn,
        child = spawn(command, args);

    child.stderr.on('data', function(buffer) { 
    	data += buffer.toString();
    });

    child.stderr.on('end', function() {
    	end(data);
    });
};


function runWatsonCommand(arguments, onFinished) {
	var cmdPath = __dirname + "/bin/" + process.platform + "/mrswatson.exe";

	var foo = new runCommand(
	    cmdPath, 
	    arguments,
	    onFinished || function(data) {}
	);
};
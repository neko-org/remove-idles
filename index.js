// vers 1.0.0

const format = require('./format.js');

module.exports = function RemoveIdles(dispatch) {
	
	let enabled = true;

    const chatHook = event => {		
		let command = format.stripTags(event.message).split(' ');
		
		if (['!removeidles'].includes(command[0].toLowerCase())) {
			toggleModule();
			return false;
		}
    }
    dispatch.hook('C_CHAT', 1, chatHook)	
	dispatch.hook('C_WHISPER', 1, chatHook)
  	
	// slash support
	try {
		const Slash = require('slash')
		const slash = new Slash(dispatch)
		slash.on('removeidles', args => toggleModule())
	} catch (e) {
		// do nothing because slash is optional
	}
	
	function toggleModule() {
		enabled = !enabled;
		systemMessage( enabled ? 'enabled (idle animations are disabled)' : 'disabled (idle animations are enabled)' );
	}
	
	function systemMessage(msg) {
        dispatch.toClient('S_CHAT', 1, {
            channel: 24,
            authorID: 0,
            unk1: 0,
            gm: 0,
            unk2: 0,
            authorName: '',
            message: ' (remove-idles) ' + msg
        });
    }
	
	//dispatch.hook('C_TARGET_INFO', 1, (event) => {
	dispatch.hook('S_SOCIAL', 1, (event) => {
		if ([31,32,33].includes(event.animation) && enabled) {
			return false;
		}
	})	
	
}
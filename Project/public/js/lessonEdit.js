// this is largely from froala's documentation

FroalaEditor.DefineIcon('dropdown', {NAME: 'add', SVG_KEY: 'add'});
  	FroalaEditor.RegisterCommand('dropdown', {
    	title: 'Tool Icons',
    	type: 'dropdown',
    	focus: false,
    	undo: false,
    	refreshAfterCallback: true,
    	options: {
      		'v1': 'Option 1',
      		'v2': 'Option 2'
    	},
    	callback: function (cmd, val) {
      		this.html.insert(val);
      		this.undo.saveStep();
      		console.log (val);
    	},
    	// Callback on refresh.
    	refresh: function ($btn) {
      		console.log ('do refresh');
    	},
    	// Callback on dropdown show.
    	refreshOnShow: function ($btn, $dropdown) {
      		console.log ('do refresh when show');
    	}
  	});
	
	let editor = new FroalaEditor('#lessonBody', {
		charCounterCount: false,
		toolbarButtons: ['bold','italic','underline','|','paragraphFormat','formatOL','formatUL','specialCharacters','dropdown','|','print'],
		quickInsertEnabled: false
	});
(function(){

	var readOptions = {
		"wpm": 300,
		"slowStartCount": 5,
		"sentenceDelay": 2.5,
		"otherPuncDelay": 1.5,
		"shortWordDelay": 1.3,
		"longWordDelay": 1.4
	};

	chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.functiontoInvoke) {
			case "readSelectedText":
				getReadOptions (request.selectedText);
				break;
			case "readFullPage":
                var text = '';
                var elements = $('p, li, h1, h2, h3, h4, h5, h6, span, pre');
                elements.each(function(index, element) {
                	element = $(element);
                    var elementText = element
                    	.clone()
                    	.children('sup')
                    	.remove()
                    	.end()
                    	.text()
                    	.trim();
                    if (elementText.length >= 60)
                        if (!(element.tagName === 'LI' && elementText.includes('    ')))
                            text += " " + elementText;
                });
                getReadOptions(text);
				break;
			default:
				break;
		}
	});

	$(document).on( 'blur', '.__read .__read_speed', function () {
		var val = Math.min( 15000, Math.max( 0, parseInt(this.value,10)));
		setReadOptions( {"wpm": val} );
	});

	$(document).on( 'blur', '.__read .__read_slow_start', function () {
		var val = Math.min( 5, Math.max( 1, parseInt(this.value,10)));
		setReadOptions( {"slowStartCount": val} );
	});

	$(document).on( 'blur', '.__read .__read_sentence_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"sentenceDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_punc_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"otherPuncDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_short_word_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"shortWordDelay": val} );
	});

	$(document).on( 'blur', '.__read .__read_long_word_delay', function () {
		var val = Math.min( 5, Math.max( 0, Number(this.value)));
		setReadOptions( {"longWordDelay": val} );
	});

	function setReadOptions ( myOptions ) {
		readOptions = $.extend( {}, readOptions, myOptions );
		chrome.storage.sync.clear(function () {
			chrome.storage.sync.set(readOptions, function() {
				//console.log('[READ] set:', readOptions);
			});
		});
	}

	function getReadOptions ( text ) {
		chrome.storage.sync.get(null, function ( myOptions ) {
			readOptions = $.extend( {}, readOptions, myOptions );
			//console.log('[READ] get:', readOptions);
			var r = new Read ( text, readOptions );
			r.play();
		});
	}
})();

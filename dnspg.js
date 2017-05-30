(function() {

	if(document.getElementById('dnspg') !== null) {
		return false;
	}

	var DNSPG = {
		set_variable: function() {
			var that = this;
			/* variable */
			that.paths = [];
			that.images = document.getElementsByTagName('img');
			that.links = document.getElementsByTagName('link');
			that.scripts = document.getElementsByTagName('script');
			that.objects = document.getElementsByTagName('object');
			that.html = document.getElementsByTagName('html')[0];
			that.body = document.getElementsByTagName('body')[0];
			that.head = document.getElementsByTagName('head')[0];
			that.textarea = document.createElement('textarea');
			that.bg_overlay = document.createElement('div');
			that.description = document.createElement('p');
			that.self_domain = location.origin;
			that.target_element = null;
			that.target_element2 = null;
			that.style_tag = document.createElement('style');
			that.stylesheet = null;
			that.link_tag = document.createElement('link');
			that.is_mac = navigator.appVersion.indexOf("Mac") !== -1;
			that.ctrl_key_code = that.is_mac ? 91 : 17;
			that.c_key_code = 67;
			that.is_on_ctrl_key = false;
			that.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
		},
		events: {
			animationend: (function(){
				var a;
				var el = document.createElement('fakeelement');
				var animatinos = {
					'animation': 'animationend',
					'OAnimation': 'oAnimationEnd',
					'MozAnimation': 'animationend',
					'WebkitAnimation': 'webkitAnimationEnd'
				};
				var result;

				for(a in animatinos){
					if( el.style[a] !== undefined ){
						result = animatinos[a];
						break;
					}
				}
				return result;
			}())
		},
		clip_domain_from_url: function (url) {
			var that = this;
			return url.match(/^[https]+:\/{2,3}([0-9a-z\.\-:]+?):?[0-9]*?\//i)[1];
		},
		destroy: function() {
			DNSPG.target_element = document.getElementById('dnspg');
			DNSPG.target_element.parentNode.removeChild(DNSPG.target_element);
			DNSPG.target_element2 = document.getElementById('dnspg-desc');
			DNSPG.target_element2.parentNode.removeChild(DNSPG.target_element2);
			DNSPG.html.removeEventListener('click', DNSPG.destroy, false);
			DNSPG.stylesheet.deleteRule(0);
			DNSPG.style_tag.parentNode.removeChild(DNSPG.style_tag);
			DNSPG.link_tag.parentNode.removeChild(DNSPG.link_tag);
		},
		get_path: function() {
			var that = this;
			/* generate path */
			for(var i = 0, len = that.images.length; i < len; i++) {
				that.detect_path(that.images[i].src);
			}
			for(var i = 0, len = that.links.length; i < len; i++) {
				if(that.links[i].rel === 'stylesheet') {
					that.detect_path(that.links[i].href);
				}
			}
			for(var i = 0, len = that.scripts.length; i < len; i++) {
				that.detect_path(that.scripts[i].src);
			}
			for(var i = 0, len = that.objects.length; i < len; i++) {
				that.detect_path(that.objects[i].data)
			}
		},
		detect_path: function(path) {
			var that = this;
			return path === '' || path.indexOf(that.self_domain) === 0 || path.indexOf('file:') === 0 || path.indexOf('data:') === 0 || that.paths.push('//' + that.clip_domain_from_url(path));
		},
		remove_duplicattion: function() {
			var that = this;
			that.paths = that.paths.filter(function (x, i, self) {
				return self.indexOf(x) === i;
			});
		},
		set_attribute: function() {
			var that = this;
			that.style_tag.id = 'dnspg-style';
			that.style_tag.type = "text/css";

			that.bg_overlay.id = 'dnspg-bg-overlay';
			that.description.id = 'dnspg-desc';

			that.textarea.id = 'dnspg';
			that.textarea.readOnly = true;

			that.description.innerHTML = 'Press <span style="font-weight: bold; outline: 1px solid #FFF;">' + (that.is_mac ? 'Command + C' : 'Ctrl + C') + '</span> and paste in head tag on your code! [<a href="javascript: void(0);" id="dnspg-close">Close</a>]';

			that.link_tag.rel = 'stylesheet';
			that.link_tag.href = '//dns-prefetch-generator.github.io/animate.css';
		},
		generate_tag: function() {
			var that = this;
			that.textarea.value += '<meta http-equiv="x-dns-prefetch-control" content="on">\n';
			for(var i = 0, len = that.paths.length; i < len; i++) {
				that.textarea.value += '<link rel="dns-prefetch" href="' + that.paths[i] + '">\n';
			}
		},
		set_style: function() {

			var that = this;
			/* append */
			that.head.appendChild(that.link_tag);
			that.head.appendChild(that.style_tag);

			/* set style */
			that.stylesheet = that.style_tag.sheet || that.style_tag.stylesheet;

			that.stylesheet.insertRule(
				'#dnspg-bg-overlay {' +
					'position: fixed !important;' +
					'top: 0 !important;' +
					'right: 0 !important;' +
					'bottom: 0 !important;' +
					'left: 0 !important;' +
					'z-index: 99999998 !important;' +
					'background-color: rgba(0, 0, 0, 0.8) !important;' +
				'}'
			, that.stylesheet.cssRules.length);

			that.stylesheet.insertRule(
				'#dnspg {' +
					'position: fixed !important;' +
					'top: 0 !important;' +
					'right: 0 !important;' +
					'bottom: 0 !important;' +
					'left: 0 !important;' +
					'z-index: 99999999 !important;' +
					'width: 600px !important;' +
					'height: 200px !important;' +
					'overflow: auto !important;' +
					'margin: auto !important;' +
					'padding: 20px !important;' +
					'background-color: rgba(255, 255, 255, 0.95) !important;' +
					'border: 0 !important;' +
					'font-size: 18px !important;' +
					'resize: none !important;' +
					'line-height: 1.7' +
					'cursor: pointer;' +
					'-webkit-animation-duration: 1s !important;' +
					'animation-duration: 1s !important;' +
					'outline: 0 !important;' +
					'color: #666 !important;' +

				'}'
			, that.stylesheet.cssRules.length);

			that.stylesheet.insertRule(
				'#dnspg-desc {' +
					'position: fixed !important;' +
					'top: 0 !important;' +
					'right: 0 !important;' +
					'bottom: 310px !important;' +
					'left: 0 !important;' +
					'z-index: 100000000 !important;' +
					'width: 600px !important;' +
					'height: 1.9em !important;' +
					'margin: auto !important;' +
					'font-size: 18px !important;' +
					'resize: none !important;' +
					'line-height: 1.7;' +
					'color: #EEE !important;' +
					'text-shadow: 0 0 18px white;' +
				'}'
			, that.stylesheet.cssRules.length);

			that.stylesheet.insertRule(
				'#dnspg-desc > a {' +
					'color: #EEE !important;' +
					'text-decoration: none !important;' +
				'}'
			, that.stylesheet.cssRules.length);

			that.stylesheet.insertRule(
				'html {' +
					'min-height: 100% !important;' +
				'}'
			, that.stylesheet.cssRules.length);

			if(!that.is_firefox) {
				that.stylesheet.insertRule(
					'textarea::selection {' +
						'color: #FFF !important;' +
						'background-color: rgb(126, 211, 194) !important;' +
					'}'
				, that.stylesheet.cssRules.length);
			}
			that.stylesheet.insertRule(
				'#dnspg-msg {' +
					'position: fixed;' +
					'top: 0;' +
					'right: 0;' +
					'bottom: 0;' +
					'left: 0;' +
					'z-index: 100000001 !important;' +
					'height: 3em;' +
					'line-height: 3em;' +
					'margin: auto;' +
					'background-color: #f7f7f7;' +
					'text-align: center;' +
					'font-size: 20px;' +
					'-webkit-animation-duration: 0.8s !important;' +
					'animation-duration: 0.8s !important;' +
					'color: rgb(126, 211, 194) !important;' +
				'}'
			, that.stylesheet.cssRules.length);
		},
		place_elements: function() {
			var that = this;

			that.body.appendChild(that.bg_overlay);
			that.body.appendChild(that.textarea);
			that.body.appendChild(that.description);

			/* execute */
			that.textarea.focus();
			that.textarea.select();
		},
		bind_events: function() {
			var that = this;

			/* event */
			that.html.addEventListener('click', that.destroy, false);
			document.getElementById('dnspg-close').addEventListener('click', that.destroy, false);

			that.textarea.addEventListener('click', function(e) {
				e.stopPropagation();
				that.textarea.select();
			}, false);

			that.html.addEventListener('keydown', function(e) {
				if ( e.keyCode === that.ctrl_key_code ) {
					that.is_on_ctrl_key = true;
				}

			});
			that.html.addEventListener('keyup', function() {
				that.is_on_ctrl_key = false;
			});
			that.textarea.addEventListener('keydown', function(e) {
				if (that.is_on_ctrl_key && e.keyCode === that.c_key_code ) {
					that.textarea.className = 'animated rubberBand';
				}
			});
			that.textarea.addEventListener('copy', function(e) {
				if ( !that.is_on_ctrl_key ) {
					that.textarea.className = 'animated rubberBand';
				}
			});
			that.textarea.addEventListener(that.events.animationend, function() {
				that.textarea.className = '';

				var message = document.createElement('p');
				message.innerHTML = 'Copy has completed!';
				message.id = "dnspg-msg";
				that.body.appendChild(message);
				message.className += ' animated fadeIn';
				message.addEventListener(that.events.animationend, function() {
					message.className += ' fadeOutUp';
					message.addEventListener(that.events.animationend, function() {
						message.parentNode.removeChild(message);
					});
				});
			});
		}
	};
	DNSPG.set_variable();
	DNSPG.get_path();
	DNSPG.remove_duplicattion();
	DNSPG.set_attribute();
	DNSPG.generate_tag();
	DNSPG.set_style();
	DNSPG.place_elements();
	DNSPG.bind_events();
}());

/*
 * jQuery Group Plugin
 * Examples and Documentation at 
 * https://github.com/abrad45/jquery.group.js
 * Version 1.4 (19 April 2014 00:03 EDT)
 * Copyright (c) 2011-2014 Alexander Bradley
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Requires jQuery 1.4+
 */

(function($){
	"use strict";
	
	$.fn.group = function(args) {
		//Loop Arguments matching options 
		var options = {}; 
		for(var i = 0; i < arguments.length; ++i) { 
			var a = arguments[i]; 
			switch(a.constructor) { 
				case Object: 
					$.extend(options,a); 
					break; 
				case Boolean: 
					options.classing = a; 
					break; 
				case Number: 
					options.size = Math.ceil(a); 
					break; 
				case String: 
					if(a.charAt(0) === '.') {
						options.elem_class = a.substr(1);
					} else if(a.charAt(0) === '#') {
						options.id_prefix = a.substr(1); 
					} else {
						options.elem = a;
					}
				break;
			} 
		} 
		
		function log() {
			if(window.console && console.log) {
				console.log('[group] ' + Array.prototype.join.call(arguments,' '));
			}
		}
		
		function addClassing($tmp) {
			if($tmp.first()[0] === $tmp.last()[0]) {
				// not possible at this time. May be added in the future
				$tmp.first().addClass('only-child');
			} else {
				$tmp.first().addClass('first-child');
				$tmp.last().addClass('last-child');
			}
			
			return $tmp;
		}
		
		// count iterates through $this
		var $this = this;
		var count = 0;
		var id_suffix = 0;
		var $ret = $();
		var is_list = false;
		var pattern_elem = /^([A-Za-z]+)$/;
		var pattern_attr = /^[A-Za-z][\-A-Za-z0-9_:.]*/;
		var $tmp = $();
		
		var settings = {
			'size': 2,
			'elem': 'div',
			'elem_class': 'group',
			'id_prefix': '',
			'classing': false
		};
		
		// Validate options
		if(options.size && isNaN(options.size)) {
			log('Oops! "' + options.size + '\" is a pretty terrible group size. We\'ve made it ' + settings.size + ' for you.');
			options.size = settings.size;
		}
		if(options.size === 1) {
			log('You want to wrap with size = 1? Just use .wrap(), man! We\'ve set it to ' + settings.size + ' for you.');
			options.size = settings.size;
		}
		if(!pattern_elem.test(options.elem)) {
			log('Oops! "' + options.elem + '" doesn\'t appear to be a valid HTML tag. We\'ve set it to ' + settings.elem + ' for you.');
			options.elem = settings.elem;
		}
		if(!pattern_attr.test(options.elem_class)) {
			log('Oops! "' + options.elem_class + '" doesn\'t appear to be a valid HTML attribute. We\'ve set elem_class to ' + settings.elem_class + ' for you.');
			options.elem_class = settings.elem_class;
		}
		if(options.id_prefix && options.id_prefix.length > 0 && !pattern_attr.test(options.id_prefix)) {
			log('Oops! "' + options.id_prefix + '" doesn\'t appear to be a valid HTML attribute. We\'ve set id_prefix to the default [nothing] for you.');
			options.id_prefix = settings.id_prefix;
		}
		
		var s = $.extend({},settings,options); 
		var wrap_attrs = {
			'class': s.elem_class
		};
		
		// we'll treat lists differently to ensure valid html structure
		if($this.first().is('li')) {
			is_list = true;
			if($this.first().parent().is('ul')) {
				s.elem = 'ul';
			} else if($this.first().parent().is('ol')) {
				s.elem = 'ol';
			}
			
			// preserve class on wrapping list
			if($(this).parent('ul, ol').attr('class')) {
				// options.elem_class specifies the user input, but if there's no input
				// there, s.elem_class will be set to the default value. this check
				// ensures that if there's no value entered, the default doesn't get added.
				wrap_attrs.class = options.elem_class ? options.elem_class + ' ' + $(this).parent().attr('class') : $(this).parent().attr('class');
			}
		}
		
		while(count < $this.length) {
			$tmp = $this.eq(count);
					
			while($tmp.length < s.size) {
				// here we check to make sure that the next element exists 
				// and that it shares a parent with the current element
				if($this.eq(count).length && ($tmp.last().parent()[0] === $this.eq(count).parent()[0])) {
					$tmp = $tmp.add($this.eq(count++));
				} else {
					break;
				}
			}
			
			if(s.id_prefix.length) {
				wrap_attrs = $.extend(wrap_attrs, {id: s.id_prefix + id_suffix++});
			}
			
			$tmp = $tmp.wrapAll($('<' + s.elem +  '/>', wrap_attrs));
			if(s.classing) { 
				$tmp = addClassing($tmp);
			}
			
			$tmp = $tmp.parent();
			if(is_list) {
				$tmp = $tmp.parent();
			}
			
			$ret = $ret.add($tmp);
		}
		
		return is_list ? $ret.children(':first-child').unwrap() : $ret;
	};
})(jQuery);
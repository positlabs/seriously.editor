define(function (require) {
//	https://gist.github.com/tshinnic/9019120
//  Large swatches copied from jQuery.
//  "cargo-culting, makes me happy"  Don Ho we love you!!

	Snap.plugin(function (Snap, Element) {

		// Used for splitting on whitespace
		var core_rnotwhite = /\S+/g,

				rclass = /[\t\r\n\f]/g,

		// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
				rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

		function trim(text) {
			return text == null ?
					"" :
					( text + "" ).replace(rtrim, "");
		}


		Element.prototype.addClass = function addClass(value) {
			var el = this;

			var classes, current, original, clazz, j;

			if (typeof value === "string" && value) {
				classes = ( value || "" ).match(core_rnotwhite) || [];

				current = original = el.attr('class');
				current = current ? (" " + current + " ").replace(rclass, " ") : " ";

				j = 0;
				while ((clazz = classes[j++])) {
					if (current.indexOf(" " + clazz + " ") < 0) {
						current += clazz + " ";
					}
				}

				current = trim(current);
				if (original !== current)
					el.attr('class', current);
			}

			return el;
		};

		Element.prototype.removeClass = function removeClass(value) {
			var el = this;

			var classes, current, original, clazz, j;

			if (arguments.length === 0 || typeof value === "string" && value) {

				classes = ( value || "" ).match(core_rnotwhite) || [];

				current = original = el.attr('class');
				current = current ? (" " + current + " ").replace(rclass, " ") : " ";

				j = 0;
				while ((clazz = classes[j++])) {
					// Remove *all* instances
					while (current.indexOf(" " + clazz + " ") >= 0) {
						current = current.replace(" " + clazz + " ", " ");
					}
				}

				current = value ? trim(current) : "";
				if (original !== current)
					el.attr('class', current);
			}

			return el;
		};


		Element.prototype.toggleClass = function toggleClass(value, stateVal) {

			if (typeof stateVal === "boolean" && typeof value === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (typeof value === "string" && value) {

				var classes = value.match(core_rnotwhite) || [],
						i = 0;

				while ((className = classes[ i++ ])) {
					if (this.hasClass(className)) {
						this.removeClass(className);
					} else {
						this.addClass(className);
					}
				}
			}

			return this;
		};


		Element.prototype.hasClass = function hasClass(className) {

			className = " " + className + " ";

			var current = this.attr('class');
			current = current ? (" " + current + " ").replace(rclass, " ") : " ";

			return  current.indexOf(className) >= 0;
		};

	});
});

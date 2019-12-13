/**
* Int2RGB
* Convert an integer representation of a colour into an RGB colour
*
* @param pIntColour Integer (eg. 13151557)
*
* @return Object(RGBColour) (eg. {red:200, green:173, blue:69})
*/
function Int2RGB(pIntColour)
{
    var r;
    var g;
    var b;

    // calculate red
    r = Math.floor(pIntColour / 65536);
    pIntColour -= (r * 65536);

    // calculate green
    g = Math.floor(pIntColour / 256);
    pIntColour -= (g * 256);

    // calculate blue
    b = pIntColour;

    return {
        red: r,
        green: g,
        blue: b
    };
}


/**
* RGB2WebColour
* Convert an RGB colour into the hex representation to be used on the web
*
* @param pRGBColor Object(RGBAColour) (eg. {red:200, green:173, blue:69})
* @param pAddHash
*
* @return string (eg. #C8AD45)
*/
function RGB2WebColour(pRGBColor, pAddHash)
{
    var webColour = '';

    if (pAddHash)
    {
        webColour = '#';
    }

    webColour += decimalToHex(pRGBColor.red, 2);
    webColour += decimalToHex(pRGBColor.green, 2);
    webColour += decimalToHex(pRGBColor.blue, 2);

    return webColour;
}


/**
* Int2WebColour
* Convert an integer representation of a colour into the hex representation to be used on the web
*
* @param pIntColour Integer (eg. 13151557)
*
* @return string (eg. #C8AD45)
*/
function Int2WebColour(pIntColour)
{
    var webColour = '';
    var theRGB = {};

    if (pIntColour >= 0)
    {
		theRGB = Int2RGB(pIntColour);
        webColour = RGB2WebColour(theRGB, true);
    }

    return webColour;
}


function hexToRGB(pHexValue)
{
    var R = parseInt((pHexValue).substring(0,2),16);
    var G = parseInt((pHexValue).substring(2,4),16);
    var B = parseInt((pHexValue).substring(4,6),16);

    return (((R * 256) + G) * 256) + B;
}


/**
* RGB2HSV
* convert an RGB colour into an HSV Colour
*
* @param pRGBAColour Object(RGBAColour) (eg. {red:200, green:173, blue:69})
*
* @return Object(HSV Colour) (eg. {hue: 0.8, saturation: 0.7, value: 0.25})
*/
function RGB2HSV(pRGBAColour)
{
    var r = (pRGBAColour.red / 255);
    var g = (pRGBAColour.green / 255);
    var b = (pRGBAColour.blue / 255);

    var minVal = Math.min(r, g, b);
    var maxVal = Math.max(r, g, b);
    var delta = maxVal - minVal;

    var v = maxVal;
    var h = 0;
    var s = 0;

    // if delta == 0, greyscale, so h and s are both 0 (default)
    if(delta != 0)
    {    // Chromatic data...

        s = delta / maxVal;

        var deltaR = (((maxVal - r) / 6) + (delta / 2)) / delta;

        var deltaG = (((maxVal - g) / 6) + (delta / 2)) / delta;
        var deltaB = (((maxVal - b) / 6) + (delta / 2)) / delta;

        if (r == maxVal)
        {
            h = deltaB - deltaG;
        }
        else if (g == maxVal)
        {
            h = (1 / 3) + deltaR - deltaB;
        }
        else if (b == maxVal)
        {
            h = (2 / 3) + deltaG - deltaR;
        }

        // make sure hue is between 0 and 1
        if (h < 0)
        {
            h += 1;
        }
        if (h > 1)
        {
            h -= 1;
        }
    }

    return {
        hue: h,
        saturation: s,
        value: v
    };
}

/**
 * rgb2hex
 * convert an rgb value to a hex value
 *
 * @param string rgb - rgb(34, 34, 34)
 * @returns string - hex value #222222
 */
function rgb2hex(rgb, pIncludeHash)
{
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	var resultStr = '';

	if (pIncludeHash == true)
	{
		resultStr = '#';
	}

	resultStr += ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2);

	return resultStr.toUpperCase();
}
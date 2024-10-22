// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l]; // Return h as a fraction of 1 (0-1 range)
}

// Helper function to convert HSL back to RGB
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/3) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hueToRgb(p, q, h + 1/3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Generate a random base color and complementary colors
const randomComplementingColors = () => {
    // Generate base color (random RGB)
    const randomValue = () => Math.floor(Math.random() * 256);
    const baseRed = randomValue();
    const baseGreen = randomValue();
    const baseBlue = randomValue();

    // Convert base RGB to HSL
    let [h, s, l] = rgbToHsl(baseRed, baseGreen, baseBlue);

    // Generate 5 colors by shifting the hue by 72° each time
    const colors = [];
    for (let i = 0; i < 5; i++) {
        const shiftedHue = (h + (i * 72 / 360)) % 1; // Shift hue by 72° for each color
        const rgb = hslToRgb(shiftedHue, s, l);
        const hex = rgbToHex(...rgb);
        colors.push(hex);
    }

    return colors;
}


const rgbToHex = (r, g, b) => `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

// Function to generate and color the divs
const generateThreeRandom = () => {
    const colors = randomComplementingColors();

    $('#three-random').find('div').remove();

    for (let i = 1; i <= 5; i++) {
        $('#three-random').append($(`<div class="random" id='random-${i}'></div>`));
    }

    $('#three-random').children().each(function(index) {
        console.log(index, colors[index]);
        $(this).append(`<h1 style="color: ${colors[index]}; filter: invert(1); text-shadow: 0px 0px 4px #ffffffa3;">${colors[index]}</h1>`)
        $(this).css('background-color', colors[index]);
    });
}

$(document).keydown(function(e) { 
    var id = e.key || e.which || e.keyCode; // Use 'e' (event) instead of 'event'
    
    // Check for spacebar key using '32' (keyCode/which) or ' ' (key)
    if (id === ' ' || id === 32) {
        generateThreeRandom();
    }
});

generateThreeRandom();
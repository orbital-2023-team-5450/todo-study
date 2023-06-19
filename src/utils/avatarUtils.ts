// Provides some helper functions that can be
// used in avatars.

/**
 * Darkens a hex colour by lum.
 * This function is modified from https://stackoverflow.com/a/20114631
 * 
 * @param hex The original hex colour
 * @param lum The amount to darken a hex colour by
 * @returns The darkened colour of hex by lum%
 */
function darkenColor(hex : string, lum : number) : string {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');

    // handles three-letter hex strings
    if (hex.length < 6) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

    lum = lum || 0;
  
    // convert to decimal and change luminosity
    let rgb = "#";

    for (let i = 0; i < 3; i++) {
      const c = parseInt(hex.substring(i*2, i*2+2), 16);
      const cc = Math.round(Math.min(Math.max(0, c - (c * lum / 100)), 255)).toString(16);
      rgb += ("00"+cc).substring(cc.length);
    }
  
    return rgb;
} 

/**
 * Generates a dark colour based on the user's username.
 * 
 * @param username The username to base the random colour on
 * @returns A dark colour in hex code.
 */
export function randomColor(username : string) : string {

    // 7075603 is a random prime number
    const origColor = Math.floor(username.split('').map(char => char.charCodeAt(0)).reduce((x, y) => x + y, 0) / username.length * 7075603) % 16777216;
    return darkenColor(origColor.toString(16).padStart(6, "0"), 65);
}

/**
 * Generates the initials of the user based on first name and last name.
 * 
 * @param firstName The first name.
 * @param lastName The last name (optional).
 * @returns The name's initials to be generated.
 */
export function getInitials(firstName : string, lastName? : string) : string {
    if (lastName && lastName !== "") {
        return firstName.charAt(0) + lastName.charAt(0);
    } else {
        return firstName.charAt(0);
    }
}
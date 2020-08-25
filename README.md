# ESPN Fantasy Football CSV Parser
Resource for pulling team/player data for private league via the ESPN Fantasy Football API, then exporting them into a csv.

## Steps

 * Log in to https://fantasy.espn.com/ and update the `constants.js` file
   * You'll need two cookies from ESPN: `espn_s2` and `SWID`. These are found at "Application > Cookies > espn.com" in the Chrome DevTools
 * `npm install`
 * `npm start`

The results will be a csv file with the parsed data created in the same directory
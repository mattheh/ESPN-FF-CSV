import pkg from 'espn-fantasy-football-api/node.js';
import _ from 'lodash';
import fs from 'fs';
import converter from 'json-2-csv';
import {
    LEAGUE_ID,
    ESPN_S2,
    SWID,
    SCORING_PERIOD_ID,
    SEASON_ID
  } from './constants.js';

const { Client } = pkg;

const myClient = new Client({ leagueId: LEAGUE_ID });
myClient.setCookies({ espnS2: ESPN_S2, SWID: SWID });
let rows = [];

myClient.getTeamsAtWeek({seasonId: SEASON_ID, scoringPeriodId: SCORING_PERIOD_ID}).then(teams => {
    _.each(teams, function(team) {
        let row = {};
        row.team = team.name;

        _.each(team.roster, function(player) {
            // add player stats to row
        })
        rows.push(row);
    })

    converter.json2csv(rows, (err, csv) => {
        if (err) {
            throw err;
        }
    
        fs.writeFile('upload.csv', csv, function (err) {
            if (err) return console.log(err);
        });

    });
});
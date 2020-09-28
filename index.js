import pkg from 'espn-fantasy-football-api/node.js';
import _ from 'lodash';
import fs from 'fs';
import json2csv from 'csvjson-json2csv';


import {
    LEAGUE_ID,
    ESPN_S2,
    SWID,
    SCORING_PERIOD_ID,
    MATCHUP_PERIOD_ID,
    SEASON_ID
  } from './constants.js';

const { Client } = pkg;

const myClient = new Client({ leagueId: LEAGUE_ID });
myClient.setCookies({ espnS2: ESPN_S2, SWID: SWID });
Promise.all([
    myClient.getBoxscoreForWeek({seasonId: SEASON_ID, scoringPeriodId: SCORING_PERIOD_ID, matchupPeriodId: MATCHUP_PERIOD_ID}).then(boxscores => {
        let teamStats = [];

        _.each( boxscores, function ( boxscore)  {
            let homeTeamStat = {};
            homeTeamStat.id = boxscore.homeTeamId;
            homeTeamStat.players = [];
            _.each( boxscore.homeRoster, function (boxScorePlayer) {
                let player = {};
                player.name = boxScorePlayer.player.fullName;
                player.injuryStatus = boxScorePlayer.player.injuryStatus;
                player.position = boxScorePlayer.position;
                player.totalPoints = boxScorePlayer.totalPoints;
                _.each ( boxScorePlayer.pointBreakdown, function (value, key) {
                    player[key] = value;
                })
                homeTeamStat.players.push(player);
            })
            teamStats.push(homeTeamStat);

            let awayTeamStat = {};
            awayTeamStat.id = boxscore.awayTeamId;
            awayTeamStat.players = [];
            _.each( boxscore.awayRoster, function (boxScorePlayer) {
                let player = {};
                player.name = boxScorePlayer.player.fullName;
                player.injuryStatus = boxScorePlayer.player.injuryStatus;
                player.position = boxScorePlayer.position;
                player.totalPoints = boxScorePlayer.totalPoints;
                _.each ( boxScorePlayer.pointBreakdown, function (value, key) {
                    player[key] = value;
                })
                awayTeamStat.players.push(player);
            })
            teamStats.push(awayTeamStat);
        })
        return teamStats;
    }),
    myClient.getTeamsAtWeek({seasonId: SEASON_ID, scoringPeriodId: SCORING_PERIOD_ID}).then(teams => {
        let nameMap = [];
        _.each(teams, function ( team ) {
            let map = {};
            map.id = team.id;
            map.name = team.name;
            nameMap.push(map);
        });
        return nameMap;
    })
]).then(res => {
    let csv = json2csv(_.merge(res[0], res[1]), {flatten: true})

    fs.writeFile('week' + SCORING_PERIOD_ID + '-stats.csv', csv, function (err) {
        if (err) return console.log(err);
    });
}).catch(error => console.log(error.message));
let blockadeDominatorTypes = [Class.ikeBase]; //[Class.destroyerDominator, Class.gunnerDominator, Class.trapperDominator];
// Each wave has a certain amount of "points" that it can spend on bosses, calculated above.
// Each boss costs an amount of points.
// It will always buy as many bosses until it has no points or else can't spend them.
// It picks a boss to buy by filtering the list of boss choices by if they are affordable.
// Then it picks a boss at random, with all choices being equally likely.

class Blockade {

    constructor() {
        this.gameActive = true;
        this.timer = 0;
        this.bossTimer = 0;
        this.remainingBolts = 0;
        //this.boltCollected = {BLUE = 0, GREEN = 0};
        this.boltCollected_BLUE = 0;
        this.boltCollected_GREEN = 0;
        this.waveId = 0;
        this.teamWon = 0;
    }
    spawnIKE(loc, team, type = false) {
    type = type ? type : Class.ikeBase //ran.choose(siegeDominatorTypes)
    let o = new Entity(loc);
    o.define(type);
    o.team = team;
    o.color = getTeamColor(team);
        if (this.gameActive) {
            o.on('dead', () => {
                    if (o.team === -2) { //TEAM_ENEMIES
                        this.spawnIKE(loc, -1, type)
                        room.setType('dom1', loc)
                        sockets.broadcast('A dominator has been captured by BLUE!')
                        this.teamWon = -1;
                    } else {
                        this.spawnIKE(loc, -2, type)
                        room.setType('dom2', loc)
                        sockets.broadcast('A dominator has been captured by GREEN!')
                        this.teamWon = -2;
                    }
                })};
}
    teamWin(team) {
        if (this.gameActive) {
            this.gameActive = false;
            sockets.broadcast(getTeamName(team) + ' has won the game!');
            setTimeout(closeArena, 3000);
        }
    }
    /*spawnHelperWrapper(loc, team, type = false) {
        type = type ? type : Class.ikeBase
        let helper = new Entity(loc);
        helper.define(type);
        helper.team = -team;
        helper.FOV = 10;
        helper.refreshBodyAttributes();
        helper.controllers.push(new ioTypes.bossRushAI(helper, { spot: "wav" + team}));

        this.remainingEnemies++;
        helper.on('dead', () => {
            //this helper has been killed, decrease the remainingEnemies counter
            //if afterwards the counter happens to be 0, announce that the wave has been defeated
            if (!--this.remainingEnemies) {
                sockets.broadcast(`Wave ${this.waveId + 1} is defeated!`);
            }
        });
        
        return helper;
    }*/
        spawnCoinWrapper(loc, type) {
        let coin = new Entity(loc);
        coin.define(type);
        coin.team = TEAM_ENEMIES;
        coin.refreshBodyAttributes();

        coin.on('dead', () => {
            //this coin has been killed, decrease the remainingEnemies counter
            let killers = [];
            for (let instance of coin.collisionArray) {
                if (isPlayerTeam(instance.team) && coin.team !== instance.team) {
                    killers.push(instance);
                }
            }

            let killer = ran.choose(killers);
            killer = killer ? killer.master.master : { team: TEAM_ROOM, color: c.TEAM ? 3 : 12 };

            let newTeam = killer.team;
            if (newTeam !== TEAM_ENEMIES) {
              if (newTeam === -1) {
                this.boltCollected_BLUE += 1;
              } else if (newTeam === -2) {
                this.boltCollected_GREEN += 1;
              }
            };
            this.remainingBolts -= 1;
            //if afterwards the counter happens to be 0, announce that the wave has been defeated
            if (!this.remainingBolts) {
                sockets.broadcast(`No bolts repaired! Bolts collected by: BLUE: ${this.boltCollected_BLUE} - GREEN: ${this.boltCollected_GREEN}.`);
            }
        });
        
        return coin;
    }
    spawnCoinWave(amount, type) {
        //spawn bosses
        for (let i = 0; i < amount; i++) {
            let spot = null,
                attempts = 0;
            do {
                spot = room.randomType('nest');
            } while (dirtyCheck(spot, 500) && ++attempts < 30);

            let bolt = this.spawnCoinWrapper(spot, type);
            this.remainingBolts += 1;
        }
        //yell at everyone
        sockets.broadcast(`${this.remainingBolts} bolts has been repaired!`);
    }
    init() {
for (let team = 1; team < c.TEAMS + 1; team++) {
    for (let loc of room["dom" + team]) {
        this.spawnIKE(loc, -team);
    }
}
        console.log('Blockade initialized.');
    }
    loop() {
        //the timer has ran out? reset timer and spawn the next wave
        if (this.teamWon != 0) {
            this.teamWin(this.teamWon);
        }
        if (this.timer <= 0) {
            this.timer = 300;
            this.waveId += 1;
            let boltAmount = Math.round(3 + this.waveId / 5);
            this.spawnCoinWave(boltAmount, Class.hexagonBolt);

        //if the timer has not ran out and there arent any remaining enemies left, decrease the timer
        } else if (!this.remainingBolts) {
            this.timer -= 1;
        }
    }
}
module.exports = { Blockade };

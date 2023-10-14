//let blockadeHelperChoices10 = [Class.titanHowler, Class.titanGlider, Class.titanInvoker/*, "fiolnir"*/];
// Each wave has a certain amount of "points" that it can spend on bosses, calculated above.
// Each boss costs an amount of points.
// It will always buy as many bosses until it has no points or else can't spend them.
// It picks a boss to buy by filtering the list of boss choices by if they are affordable.
// Then it picks a boss at random, with all choices being equally likely.

class Blockade {

    constructor() {
        this.blockadeHelperChoices10 = [Class.titanHowler, Class.titanGlider, Class.titanInvoker/*, "fiolnir"*/];
        this.gameActive = true;
        this.phaseBreak = false;
        this.phaseActive = false;
        this.phaseTimer = 1000;
        this.phaseStep = 0;
        this.timer = 0;
        this.statisticTimer = 6000;
        this.remainingBolts = 0;
        this.remainingHelpers = 0;
        //this.boltCollected = {BLUE = 0, GREEN = 0};
        this.boltCollected_BLUE = 0;
        this.boltCollected_GREEN = 0;
        this.waveId = 0;
        this.teamHighBolts = 0;
        this.currentCost = 0;
        this.teamWon = 0;
    }
    loopStatistic() {
        if (this.statisticTimer <= 0) {
            this.statisticTimer = 6000;
        sockets.broadcast(`Number of bolts stocked by: BLUE: ${this.boltCollected_BLUE} - GREEN: ${this.boltCollected_GREEN}.`);

        //if the timer has not ran out and there arent any remaining enemies left, decrease the timer
        } else if (this.gameActive) {
            this.statisticTimer -= 1 / roomSpeed;
        }
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
    spawnHelperWrapper(loc, team, type = false, spot = false, level = 1) {
        type = type ? type : this.blockadeHelperChoices10;
        spot = spot ? spot : "nest";
        let sklv = (5 + level * 2);
        let o = new Entity(loc);
        o.define(ran.choose(type));
        o.team = -team;
        o.SIZE = 30 + sklv;
        o.FOV = 10;
        o.HEALTH = 2300 + sklv * 100;
        o.SHIELD = sklv - 5;
        o.DAMAGE = sklv - 2;
        o.DANGER = 25 + o.SIZE / 5;
        o.SKILL = [sklv, sklv, sklv, sklv, sklv, sklv, sklv, sklv, sklv, sklv];
        o.refreshBodyAttributes();
        o.controllers.push(new ioTypes.blockadeAI(o, { spot: spot,}));

        this.remainingHelpers += 1;
        o.on('dead', () => {
            this.remainingHelpers -= 1;
            //this helper has been killed, decrease the remainingEnemies counter
            //if afterwards the counter happens to be 0, announce that the wave has been defeated
            if (!this.remainingHelpers) {
                sockets.broadcast(`No titan around the map! Collect more bolts to build your titan!`);
            }
        });
        
        return o;
    }
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
                //killer.sendMessage("Bolts collected by BLUE: " + this.boltCollected_BLUE + ".");
              } else if (newTeam === -2) {
                this.boltCollected_GREEN += 1;
                //killer.sendMessage("Bolts collected by GREEN: " + this.boltCollected_GREEN + ".");
              }
            };
            this.remainingBolts -= 1;
            //if afterwards the counter happens to be 0, announce that the wave has been defeated
            if (!this.remainingBolts) {
                this.statisticTimer -= 3000;
                if (this.boltCollected_BLUE >= 10 || this.boltCollected_GREEN >= 10 && !this.phaseActive){
                    this.phaseActive = true;
                    sockets.broadcast(`The factory is opened! Collect more bolts to build your titan!`);
                } else {
                    sockets.broadcast(`No bolts has been repaired around the map!`);
                }
            }
        });
        
        return coin;
    }

    spawnHelper(team, cost) {
        //spawn fodder enemies
        let type = this.blockadeHelperChoices10; //(cost <= 1) ? [this.helperChoicesLevel10][cost - 1] : this.helperChoicesLevel10;
        this.spawnHelperWrapper(room.randomType('wav' + team), team, type, ["wav2", "wav1"][team - 1], cost);
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
        sockets.broadcast(`${this.remainingBolts} bolts has been repaired in the nest!`);
    }
    loopPhase() {
        if (this.phaseTimer <= 0) {
            
         if (this.phaseStep == 0) {
                        this.phaseTimer = 400;
                        this.phaseStep += 1;
                    //yell at everyone
                    if (this.boltCollected_BLUE > this.boltCollected_GREEN) {
                     this.teamHighBolts = 1;
                     this.currentCost = Math.round(this.boltCollected_BLUE / 10 - 0.49);
                     sockets.broadcast('The factory is now busy! ' + getTeamName(-this.teamHighBolts) + ' has spended ' + this.boltCollected_BLUE + ' Bolts to build a titan!');
                     this.boltCollected_BLUE = 0;
                    } else if (this.boltCollected_BLUE < this.boltCollected_GREEN) {
                     this.teamHighBolts = 2;
                     this.currentCost = Math.round(this.boltCollected_GREEN / 10  - 0.49);
                     sockets.broadcast('The factory is now busy! ' + getTeamName(-this.teamHighBolts) + ' has spended ' + this.boltCollected_GREEN + ' Bolts to build a titan!');
                     this.boltCollected_GREEN = 0;
                    } else {
                    sockets.broadcast('Both teams are draw! Only the highest amount of bolts can spawn titan!');
                    }
                } else if (this.phaseStep == 1) {
                        this.phaseTimer = 2000;
                        this.phaseActive = false;
                        this.phaseStep == 0;

                    let rb = ['The factory is closed', 'The factory is taking a lunch break', 'It is Closing time'];
                    sockets.broadcast(ran.choose(rb) + '!  We will be right back later!');

                    if (this.teamHighBolts != 0) {
                    sockets.broadcast('The titan level ' + this.currentCost + ' has been spawned by ' + getTeamName(-this.teamHighBolts) + '!');
                    this.spawnHelper(this.teamHighBolts, this.currentCost);
                    } else {
                    sockets.broadcast('No request yet! You may grab ur chance next time.');
                    }

                    this.teamHighBolts = 0;
                }
        //if the timer has not ran out and there arent any remaining enemies left, decrease the timer
        } else if (this.gameActive) {
            this.phaseTimer -= 1 / roomSpeed;
        }
            if (this.phaseTimer == 300 && this.phaseStep == 0) {
                    if (!this.phaseBreak) { 
                       this.phaseBreak = true;
                       sockets.broadcast('10 Seconds remaining before the factory starts!');
                    }
                } else if (this.phaseTimer == 900 && this.phaseStep == 0) {
                    if (!this.phaseBreak) { 
                       this.phaseBreak = true;
                       sockets.broadcast('30 Seconds remaining before the factory starts!');
                    }
                } else { this.phaseBreak = false; }
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
            this.timer -= 1 / roomSpeed;
        }
        if (this.phaseActive) {
            this.loopPhase();
        }
        this.loopStatistic();
    }
}
module.exports = { Blockade };

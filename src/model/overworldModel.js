import Map from './misc/map.js';

export default class OverworldModel{
    constructor(props){
        this.props = props;
        this.currentPartyPosition = [0,0];//in Tiles
        this.previousPartyPosition = [0,0];//in Tiles
        this.nextPartyPosition = [0,0];
        this.generateNewMap();
    }
    generateNewMap(){//want this to execute after lobby start happens
        if(this.props.calcHighestPartyLevel() > 9 && !this.props.getMilestones().includes('dolosDefeated')){
            this.props.setMap(new Map('Altus Capital'));
        }else{
            this.props.setMap(new Map());
        }
        this.currentPartyPosition = this.props.getMap().getEntrancePosition();
        this.nextPartyPosition = this.currentPartyPosition;
    }
    movePartyUp(){//this could allow for one way direction (mab object traversable North, traversable South, ... etc)
        let map = this.props.getMap();
        if(this.currentPartyPosition[1]-1 >= 0){
            if(map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]].mapObject){
                if(map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]].mapObject.traversable){
                    this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]].position;
                }
            }else this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]-1][this.currentPartyPosition[0]].position;
        }   
    }
    movePartyDown(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[1]+1 < map.tileLayout.length){
            if(map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]].mapObject){
                if(map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]].mapObject.traversable){
                    this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]].position;
                }
            }else this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]+1][this.currentPartyPosition[0]].position;
        }
    }
    movePartyLeft(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[0]-1 >= 0){
            if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1].mapObject){
                if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1].mapObject.traversable){
                    this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1].position;
                }
            }else this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]-1].position;
        }
    }
    movePartyRight(){
        let map = this.props.getMap();
        if(this.currentPartyPosition[0]+1 < map.tileLayout[this.currentPartyPosition[1]].length){
            if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1].mapObject){
                if(map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1].mapObject.traversable){
                    this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1].position;
                }
            }else this.nextPartyPosition = map.tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]+1].position;
        }
    }
    movePartyTile(){
        this.previousPartyPosition = this.currentPartyPosition;
        this.currentPartyPosition = this.nextPartyPosition;
        this.props.getMap().tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]].status = 'visited';
    }
    determineRoomEvent(){
      
        let biome = this.props.getMap().biome;
        let tileEntered = this.props.getMap().tileLayout[this.currentPartyPosition[1]][this.currentPartyPosition[0]]
        
        if(tileEntered.battle != ''){
            this.toggleBattle(tileEntered.battle);
            return; 
        }
        if(tileEntered.encounter != ''){
            this.toggleEncounter(tileEntered.encounter);
            return;
        }
        if(tileEntered.mapObject){
            if(tileEntered.mapObject.name == 'exit'){
                this.toggleMapChange()
                return;
            }
        }
        if(tileEntered.mapObject == false){
            if(tileEntered.mapObject.name != 'blank'){
                this.decideRandomEvent(tileEntered, biome)
            }
        }
    }
    decideRandomEvent(tileEntered, biome){
        let chance = Math.floor(Math.random()*50);
        if(chance == 0){
            tileEntered.battle = biome.generateBattle(this.props.calcHighestPartyLevel(), this.props.getDifficulty());
            this.toggleBattle(tileEntered.battle);
            return;
        }
        if(chance == 1){
            tileEntered.encounter = biome.generateEncounter(this.props.recruitWanderingCompanion);
            this.toggleEncounter(tileEntered.encounter);
            return;
        }
    }
    toggleBattle(battle){
        this.props.setBattle(battle);
        this.props.setScreen('battle-screen');
        
    }
    toggleEncounter(encounter){
        this.props.setEncounter(encounter);
        this.props.setScreen('encounter-screen');
        
    }
    toggleMapChange(){
        this.props.setScreen('map-change-screen');
        this.props.setSituation('');
    }
    changeMap(){
        this.generateNewMap();
        this.currentPartyPosition = this.props.getMap().getEntrancePosition();
    }
    //TODO
    determineCurrentCharater(){
        this.currentCharacter = getRandomArrayElement(this.props.getParty());
        if(this.currentCharacter.currentHP <= 0){
            this.determineCurrentCharater();
        }
    }
    
}
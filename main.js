var GLOBAL = {};
GLOBAL["SELECTED"] = "nan";
var GLOBALR = {};
var GLOBALITER = 0;

class Character {
    constructor(name) {
        this.name = name;
        this.alignment = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]; // all attr 1, all attr 2
        this.id = structuredClone(GLOBALITER);
        this.stubborn = Math.floor(Math.random() * 101);
        GLOBAL[GLOBALITER] = this;
        GLOBALR[this.name] = GLOBALITER;
        var newEl = document.createElement("div");
        newEl.classList = "char";
        newEl.id = GLOBALITER;
        newEl.innerHTML = this.name;
        document.getElementById("charstack").appendChild(newEl);
        GLOBALITER++;
    }
    bind() {
        document.getElementById(this.id).onclick = function () {
            document.getElementById("charname").innerHTML = "NAME: " + GLOBAL[this.id].name;
            document.getElementById("pos").innerHTML = "POSITIVE ALIGNMENT: " + GLOBAL[this.id].alignment[0];
            document.getElementById("neg").innerHTML = "NEGATIVE ALIGNMENT: " + GLOBAL[this.id].alignment[1];
            document.getElementById("stubborn").innerHTML = "STUBBORN-NESS: " + GLOBAL[this.id].stubborn;
            GLOBAL["SELECTED"] = this.id;
        };
    }
    showchange() {
        document.getElementById("charname").innerHTML = "NAME: " + GLOBAL[this.id].name;
        document.getElementById("pos").innerHTML = "POSITIVE ALIGNMENT: " + GLOBAL[this.id].alignment[0];
        document.getElementById("neg").innerHTML = "NEGATIVE ALIGNMENT: " + GLOBAL[this.id].alignment[1];
        document.getElementById("stubborn").innerHTML = "STUBBORN-NESS: " + GLOBAL[this.id].stubborn;
        GLOBAL["SELECTED"] = this.id;
    }
}

class Scene {
    constructor(characters) {
        this.scenecount = 0;
        this.decay = 1;
        this.decayaverage = 1;
        this.characters = characters;
        let calcBiasPos = 0;
        let calcBiasNeg = 0;
        for (let i of this.characters) {
            calcBiasPos += i.alignment[0];
            calcBiasNeg += i.alignment[1];
        }
        this.biasNeg = calcBiasNeg;
        this.biasPos = calcBiasPos;
    }

    newchar(character) {
        this.characters.push(character);
        this.biasNeg += character.alignment[0];
        this.biasPos += character.alignment[1];
    }

    fastchar() {
        if (document.getElementById("charnamer").value != "" && GLOBALR[document.getElementById("charnamer").value] == undefined) {
            let newch = new Character(document.getElementById("charnamer").value);
            newch.bind();
            this.newchar(newch);
            document.getElementById("charnamer").value = "";
        }
    }

    calcbias() {
        let calcBiasPos = 0;
        let calcBiasNeg = 0;
        for (let i of this.characters) {
            calcBiasPos += i.alignment[0];
            calcBiasNeg += i.alignment[1];
        }
        this.decay = Math.floor((1 / (1 / calcBiasPos + 1 / calcBiasNeg)) / this.decayaverage);
    }

    calcscore() {
        let calcBiasPos = 0;
        let calcBiasNeg = 0;
        for (let i of this.characters) {
            calcBiasPos += i.alignment[0];
            calcBiasNeg += i.alignment[1];
        }
        return (calcBiasPos * this.biasPos - calcBiasNeg * this.biasNeg) / this.characters.length;
    }

    step() {
        this.calcbias();
        let selectedCharacter = this.characters[Math.floor(Math.random() * this.characters.length)];
        if (Math.floor(Math.random() * ((this.biasPos * (100 - selectedCharacter.stubborn)) + (selectedCharacter.alignment[0] * selectedCharacter.stubborn) + (this.biasNeg * (100 - selectedCharacter.stubborn)) + (selectedCharacter.alignment[1] * selectedCharacter.stubborn))) < (this.biasNeg * (100 - selectedCharacter.stubborn)) + (selectedCharacter.alignment[1] * selectedCharacter.stubborn)) {
            this.biasNeg += this.decay;
            selectedCharacter.alignment[1] += 1;
        } else {
            this.biasPos += this.decay;
            selectedCharacter.alignment[0] += 1;
        }
        this.decayaverage = this.decayaverage + (this.decay - this.decayaverage) / (this.scenecount + 1);
        this.scenecount++;
        return selectedCharacter;
    }

    play() {
        let scenet = "";
        let vlen = 5 + Math.floor(Math.random() * 11);
        for (let i = 0; i < vlen; i++) {
            let char = this.step();
            scenet += (`${char.name}: + ${(this.biasPos * (100 - char.stubborn) + (char.alignment[0] * char.stubborn)) / 100 } - ${(this.biasNeg * (100 - char.stubborn) + (char.alignment[1] * char.stubborn)) / 100} (DECAY: ${this.decay})\n`);
        }
        scenet += (`Final Score: ${this.calcscore()}\n`);
        for (let i of this.characters) {
            scenet += (`${i.name}'s alignment: ${i.alignment}\n`);
        }
        scenet += (`Final Decay Average: ${this.decayaverage}\n`);
        scenet += (`Scene Bias (+): ${this.biasPos}\n`);
        scenet += (`Scene Bias (-): ${this.biasNeg}`);
        document.getElementById("scenegame").innerHTML = scenet;
        if (GLOBAL["SELECTED"] != "nan") {
            GLOBAL[GLOBAL["SELECTED"]].showchange();
        }
    }
}

let scene = new Scene([]);
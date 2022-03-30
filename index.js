var fs = require('fs');
var md5 = require('md5');
const readline = require('readline');

async function filterWordsStep1(init_phrase) {
    // open file, read by lines &
    // filter out words which do not contain characters from initial phrase
    const rl = readline.createInterface({
        input: fs.createReadStream('wordlist'),
        output: process.stdout
    });

    var filteredArr = [];

    for await (const line of rl) {
        for (var i = 0; i < line.length; i++) {
            if (!init_phrase.includes(line[i])) {
                break;
            }
            if (i === line.length - 1) {
                filteredArr.push(line);
            }
        }
    }
    return new Promise((resolve, reject) => {
        resolve(filteredArr);
    });
}

async function countPhraseChars(phrase) {
    // build chars obj
    // eg 'poultry outwits ants' {a:1, n:1,...}
    var sorted = phrase.split("").sort().join("");
    var charObj = {};
    for (var i = 0; i < sorted.length; i++) {
        if (charObj[sorted[i]]) {
            charObj[sorted[i]]++;
        } else {
            charObj[sorted[i]] = 1;
        }
    }
    return new Promise((resolve, reject) => {
        resolve(charObj)
    })
}

function compareCharObjs(objMother, objChild) {
    // check if objChild is subset of objMother 
    // e.g. objMother {a:1, b:2, c:3}, objChild {a:1, b:2} TRUE
    // e.g. objMother {a:1, b:2, c:3}, objChild {a:1, b:2, d:1} FALSE
    // e.g. objMother {a:1, b:2, c:3}, objChild {a:2, b:2} FALSE

    var objMotherKeys = Object.keys(objMother);
    var objChildKeys = Object.keys(objChild);
    return objChildKeys.every((key => objMotherKeys.includes(key) && objChild[key] <= objMother[key]));
}

async function filterWordsStep2(wordsArr) {
    // filter out words which contain more characters than those in init phrase
    var initPhraseObj = await countPhraseChars('poultry outwits ants');

    var filteredArr = [];
    for (var i = 0; i < wordsArr.length; i++) {
        var phraseObj = await countPhraseChars(wordsArr[i]);
        if (compareCharObjs(initPhraseObj, phraseObj)) {
            filteredArr.push(wordsArr[i]);
        }
    }
    return new Promise((resolve, reject) => {
        resolve(filteredArr);
    })
}

async function search(wordsArr) {
    console.log('search started at ' + new Date().toISOString());
    // brute force
    var solution = [];
    for (i = 0; i < wordsArr.length; i++) {
        for (var j = 0; j < wordsArr.length; j++) {
            for (var k = 0; k < wordsArr.length; k++) {
                var word1 = wordsArr[i];
                var word2 = wordsArr[j];
                var word3 = wordsArr[k];
                var candidate = word1+' '+word2+' '+word3;
                if(candidate.length === SORTED_PHRASE.length){
                    var candidateMD5 = md5(candidate);
                    if(MD5ARR.includes(candidateMD5)){
                        console.log('CANDIDATE FOUND: ' + candidate +' @ '+new Date().toISOString());
                        solution.push(candidate);
                    }
                }
            }
        }
    }
    return new Promise((resolve, reject) => {
        resolve(solution);
    })
}

const PHRASE = 'poultry outwits ants';
const SORTED_PHRASE = PHRASE.split('').sort().join('');
const MD5ARR = ['e4820b45d2277f3844eac66c903e84be', '23170acc097c24edb98fc5488ab033fe', '665e5bcb0c20062fe8abaaf4628bb154']

async function main() {
    var filteredWords = await filterWordsStep1(SORTED_PHRASE);
    console.log('Count of possible words is now: ' + filteredWords.length);
    var secondFilter = await filterWordsStep2(filteredWords);
    console.log('Count of possible words is now: ' + secondFilter.length);

    var solution = await search(secondFilter);
    console.log('Solution', solution);
}

main();




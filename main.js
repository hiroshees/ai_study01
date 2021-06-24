const API_KEY = 'APIKEY_HERE';
const GOOGLE_URL_TRANSLATE = 'https://translation.googleapis.com/language/translate/v2?key=' + API_KEY;
const GOOGLE_URL_LANGUAGE = 'https://language.googleapis.com/v1beta2/documents:analyzeEntities?key=' + API_KEY;


$(function () {
    $('#btn-question').on('click', function() {
        startProcess();
    });
});

function startProcess () {
    const questionText = $('#question').val();
    getTranslationToEng(questionText)
    .then((value) => {
        return getLanguageEntities(value);
    })
    .then((data) => {
        const type = getQuestionType(data.questionText);
        const queryWords = getEntityWords(data.result);
        console.log(data.questionText);
        console.log(data.result);
        console.log(type);
        console.log(queryWords);
    });
}

function getEntityWords(data) {
    return data.entities.map((entity) => entity.name);
}

function getQuestionType(questionText) {
    if( questionText.toLowerCase().includes("who")) {
        return "PERSON";
    } else if( questionText.toLowerCase().includes("where")) {
        return "LOCATION";
    } else {
        return "OTHER";
    }
}

function getTranslationToEng(text) {
    const promise = new Promise(function(resolve) {
        const method = "POST";
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        const obj = {
            q: text,
            source : 'ja',
            target :　'en',
        };
        const body = JSON.stringify(obj);
        
        fetch(GOOGLE_URL_TRANSLATE, {method, headers, body})
        .then((response) => {
            return response.json();
        })
        .then((body) => {
            const questionTextEnglish = body['data']['translations'][0]['translatedText'];
            showData(questionTextEnglish);
            return resolve(questionTextEnglish);
        });
    });
    return promise;
}

function getLanguageEntities(text) {
    const promise = new Promise(function(resolve) {
        const method = "POST";
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        const obj = {
            "document": {
                "type": "PLAIN_TEXT",
                "language": "en",
                "content": text,
            },
            "encodingType": 'UTF8',
        };
        const body = JSON.stringify(obj);
        
        fetch(GOOGLE_URL_LANGUAGE, {method, headers, body})
        .then((response) => {
            return response.json();
        })
        .then((body) => {
            const data = JSON.stringify(body, null, 2);
            showData(data);
            return resolve({
                questionText : text,
                result : body,
            });
        });
    });
    return promise;
}

function showData (text) {
  $('#results').text(text);
}

function showError(jqXHR, textStatus, errormsg) {

}

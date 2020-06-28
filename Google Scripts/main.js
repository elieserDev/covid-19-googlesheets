function getStatesDataSetAPI() {
  let states = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PE","PI","PR","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  let cases = new Array();
//  let yesterday = getYesterday();
  
  for (let state of states) {
    let url = "https://brasil.io/api/dataset/covid19/caso/data/?state=" + state + "&is_last=true";
    let response = UrlFetchApp.fetch(url);
    let json = response.getContentText();
    let dataResponse = JSON.parse(json);
    let metric = dataResponse.results.find(function(item){return item.city == null});
    //Insert SheetDB.
    insertDB(metric, "Casos em Estados COVID-19");
  }
}

function getCapitalDataSetAPI() {
  let locals = [
    {capital: 'Porto Alegre', state: 'RS'},
    {capital: 'Rio Branco', state: 'AC'},
    {capital: 'Maceió', state: 'AL'},
    {capital: 'Manaus', state: 'AM'},
    {capital: 'Macapá', state: 'AP'},
    {capital: 'Salvador', state: 'BA'},
    {capital: 'Fortaleza', state: 'CE'},
    {capital: 'Brasília', state: 'DF'},
    {capital: 'Vitória', state: 'ES'},
    {capital: 'Goiânia', state: 'GO'},
    {capital: 'São Luís', state: 'MA'},
    {capital: 'Belo Horizonte', state: 'MG'},
    {capital: 'Campo Grande', state: 'MS'},
    {capital: 'Cuiabá', state: 'MT'},
    {capital: 'Belém', state: 'PA'},
    {capital: 'João Pessoa', state: 'PB'},
    {capital: 'Recife', state: 'PE'},
    {capital: 'Teresina', state: 'PI'},
    {capital: 'Curitiba', state: 'PR'},
    {capital: 'Rio de Janeiro', state: 'RJ'},
    {capital: 'Natal', state: 'RN'},
    {capital: 'Porto Velho', state: 'RO'},
    {capital: 'Boa Vista', state: 'RR'},
    {capital: 'Florianópolis', state: 'SC'},
    {capital: 'Aracaju', state: 'SE'},
    {capital: 'São Paulo', state: 'SP'},
    {capital: 'Palmas', state: 'TO'}
  ];
  let cases = new Array();
//  let yesterday = getYesterday();
  
  for (let local of locals) {
    let url = "https://brasil.io/api/dataset/covid19/caso/data/?state=" + local.state + "&is_last=true";
    let response = UrlFetchApp.fetch(url);
    let json = response.getContentText();
    let dataResponse = JSON.parse(json);
    let metric = dataResponse.results.find(function(item){return item.city == local.capital});
    if (metric) {
      metric.state = local.capital + "-" + local.state;
      insertDB(metric, "Casos em Capital COVID-19"); //Insert SheetDB.
    }
  }
}

function insertDB(data, sheetName) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  let targetLine = sheet.getLastRow()+1;
  let confirmedCell = 'a' + targetLine;
  let deathsCell = 'b' + targetLine;
  let deathRateCell = 'c' + targetLine;
  let localCell = 'd' + targetLine;
  let updatedCell = 'e' + targetLine;
  let createdCell = 'f' + targetLine;

  sheet.getRange(confirmedCell).setValue(data.confirmed);
  sheet.getRange(deathsCell).setValue(data.deaths);
  sheet.getRange(deathRateCell).setValue(data.death_rate);
  sheet.getRange(localCell).setValue(data.state);
  sheet.getRange(updatedCell).setValue(data.date);
  sheet.getRange(createdCell).setValue(createdAt());
}

function createdAt() {
  let today = new Date();
  
  let dd = today.getDate() > 9 ? today.getDate() : "0" + (today.getDate());
  let mm = (today.getMonth()+1) > 9 ? (today.getMonth()+1) : "0" + (today.getMonth()+1); 
  let yyyy = today.getFullYear();
  
  let hh = today.getHours() > 9 ? today.getHours() : "0" + (today.getHours());
  let MM = today.getMinutes() > 9 ? today.getMinutes() : "0" + (today.getMinutes());
  let ss = today.getSeconds() > 9 ? today.getSeconds() : "0" + (today.getSeconds());
  let mmm = today.getMilliseconds() > 9 ? today.getMilliseconds() : "0" + (today.getMilliseconds());
  
  return dd+"/"+mm+"/"+yyyy + " - " + hh+":"+mm+":"+ss+":"+mmm;
}

function webScraper() {
  //Montar um array de estados com os códigos do climatempo que constam na planilha e buscar os dados dos site baseado em um for.
  let states = [
    {capital: 'Porto Alegre-RS', id: 363},
    {capital: 'Rio Branco-AC', id: 6},
    {capital: 'Maceió-AL', id: 8},
    {capital: 'Manaus-AM', id: 25},
    {capital: 'Macapá-AP', id: 39},
    {capital: 'Salvador-BA', id: 56},
    {capital: 'Fortaleza-CE', id: 60},
    {capital: 'Brasília-DF', id: 61},
    {capital: 'Vitória-ES', id: 84},
    {capital: 'Goiânia-GO', id: 88},
    {capital: 'São Luís-MA', id: 94},
    {capital: 'Belo Horizonte-MG', id: 107},
    {capital: 'Campo Grande-MS', id: 212},
    {capital: 'Cuiabá-MT', id: 218},
    {capital: 'Belém-PA', id: 232},
    {capital: 'João Pessoa-PB', id: 256},
    {capital: 'Recife-PE', id: 259},
    {capital: 'Teresina-PI', id: 264},
    {capital: 'Curitiba-PR', id: 271},
    {capital: 'Rio de Janeiro-RJ', id: 321},
    {capital: 'Natal-RN', id: 334},
    {capital: 'Porto Velho-RO', id: 343},
    {capital: 'Boa Vista-RR', id: 347},
    {capital: 'Florianópolis-SC', id: 377},
    {capital: 'Aracaju-SE', id: 384},
    {capital: 'São Paulo-SP', id: 558},
    {capital: 'Palmas-TO', id: 593}
  ];
  
  for (let item of states) {
    let url = `https://www.climatempo.com.br/previsao-do-tempo/cidade/${item.id}`;
    let weatherStateData = getWeather(url);
    insertWeatherDB(weatherStateData, item.capital);
  }
  
}

function insertWeatherDB(data, capital) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Previsão do Tempo");
  let targetLine = sheet.getLastRow()+1;
  let capitalCell = 'a' + targetLine;
  let minTempCell = 'b' + targetLine;
  let maxTempCell = 'c' + targetLine;
  let minHumidityCell = 'd' + targetLine;
  let maxHumidityCell = 'e' + targetLine;
  let updatedCell = 'f' + targetLine;
  let timestampCell = 'g' + targetLine;
  let timestampFullValue = createdAt().split(" - ");
  
  sheet.getRange(capitalCell).setValue(capital);
  sheet.getRange(minTempCell).setValue(data.minTemperature);
  sheet.getRange(maxTempCell).setValue(data.maxTemperature);
  sheet.getRange(minHumidityCell).setValue(data.minHumidity);
  sheet.getRange(maxHumidityCell).setValue(data.maxHumidity);
  sheet.getRange(updatedCell).setValue(timestampFullValue[0]);
  sheet.getRange(timestampCell).setValue(timestampFullValue[1]);
}

function getWeather(url) {
  let data = UrlFetchApp.fetch(url);
  
//  try {
//    //Criar algoritimo baseado em um dos templates. Esse é para quando os dados de clima estão em uma espécie de card no topo do corpo do site.
//    //Testar cada código para encontrar o template que falta. Existe apenas dois casos e um já está funcionando
//    let htmlText = data.getContentText();
//    
//    let minDivid1 = htmlText.split('<span class="min-temp">');
//    let minDivid2 = minDivid1[1].split('</span>');
//    let min = minDivid2[0];
//    
//    return min;
//  } catch (e) {
    //Algoritimo para busca de dados em um dos templates - já está funcionando!
    
    let htmlText = data.getContentText();
    
    let minDivid1 = htmlText.split('<span class="_margin-r-20" id="min-temp-1">');
    let minDivid2 = minDivid1[1].split('</span>');
    let minTemperature = minDivid2[0].replace('°','');
    
    let maxDivid1 = htmlText.split('<span id="max-temp-1">');
    let maxDivid2 = maxDivid1[1].split('</span>');
    let maxTemperature = maxDivid2[0].replace('°','');
    
    let minHumidityDivid1 = htmlText.split('<span class="_margin-r-20">');
    let minHumidityDivid2 = minHumidityDivid1[1].split('</span>');
    let minHumidity = minHumidityDivid2[0];
    
    let maxHumidityDivid1 = htmlText.split('%</span>');
    let maxHumidityDivid2 = maxHumidityDivid1[1].split('<span>');
    let maxHumidity = maxHumidityDivid2[1] + "%";
    
    return {
      minTemperature: minTemperature, 
      maxTemperature: maxTemperature, 
      minHumidity: minHumidity, 
      maxHumidity: maxHumidity
    };
  
//  }
}
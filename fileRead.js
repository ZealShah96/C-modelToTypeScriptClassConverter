var file=require('fs');
var path = require('path');
var filesNames=[];

var _dirName="";
var writefilePath="";
var allowedkeyWordsString=['#region','#endregion','public','class','string','int'];

file.readFile('./config.json',(err,data)=>{
    let jsonOfFilesConfig=JSON.parse(data);
    _dirName=jsonOfFilesConfig.ModelFolders;
     writefilePath=jsonOfFilesConfig.pastingFolder;
     processStart();
});




// filesNames.forEach(element => {
   
// });

function processStart(){
    file.readdir(_dirName, (err, files) => {
        files.forEach(fileName => {
          console.log(fileName);
          filesNames.push(fileName);
          file.readFile(_dirName+fileName,{encoding: 'utf-8'},function(err,data){
            if(!err){
            findLocationsOfbrackets(data);
            }
            else{
            console.log(err);
            }
            });
        });
      });
    
}




function findLocationsOfbrackets(data){
var trimdata=replaceSpecificCharcter('\n',replaceSpecificCharcter('\r',data.trim(),''),'');
//console.log(trimdata);
let arrayOfSentence=trimdata.split('{').join('').split('}').join('').split(' ');
var classArray=[];

var firstClassOccurance=arrayOfSentence.indexOf("class");
var index=0;
arrayOfSentence=arrayOfSentence.filter((element)=>{
    index=index+1;
if(element!="" && element!="get;" && element!="set;" && index>firstClassOccurance-1){
    return element;
}
});
console.log(arrayOfSentence);
// iterateThroughArrayOfStatement();
prepareClassStringandElemenetsString(arrayOfSentence);
}


function replaceSpecificCharcter(symbol, string, changeelement) {

    var tempString = string;
    if (tempString.indexOf(symbol) > -1) {

        tempString = replaceSpecificCharcter(symbol, string.replace(symbol, changeelement), changeelement);

    }
    return tempString;
}


function iterateThroughArrayOfStatement(className,classPrepareStringfromfunction){
    var classPrepareString=className.replace(/\W/g, '');
    var elementsString=classPrepareStringfromfunction;
    var makingClassStart=`export class ${classPrepareString} {constructor(${elementsString}){}}`;
    console.log(makingClassStart);
    return makingClassStart;
}



function prepareClassStringandElemenetsString(arr){
    var jsonOfClassStructure={};
    var className="";
    var tempArry=[];
    var stringofclasselement="";
    tempArry=arr;


    for(let i=0;i<arr.length;i++){
        if(arr[i]=="public"){
            if(arr[i+1]=="class"){
                className=arr[i+2];
            }
            else{
                if(allowedkeyWordsString.indexOf(arr[i+1])>-1)
                stringofclasselement+=arr[i]+" "+arr[i+2]+":"+arr[i+1].replace('int','number')+", ";
            }
            i=i+2;
        }
    }
  var k=iterateThroughArrayOfStatement(className,stringofclasselement);
    file.appendFileSync(writefilePath, "\n"+iterateThroughArrayOfStatement(className,stringofclasselement));
}


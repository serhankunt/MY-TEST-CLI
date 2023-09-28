#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs';
import { error } from 'console';
import { stderr, stdout } from 'process';
import { exec } from 'child_process';
import readLine from 'readline';


const rl = readLine.createInterface({
    input:process.stdin,
    output:process.stdout
});

const argv = yargs
    .command({
        command :"create",
        describe:"Create a style.css file",
        aliases : ["c"],//create keyword kısaltması
        builder:{},
        handler:function(argv){//handler da komut çalıştığında yapılacak işlemler
            createStyleCss();
        }
    }
    )   // ts den sonra gelen create keyword 
    .command("build","Run npm run build")
    .command("new","Create a new project",{
        'name':{
            describe:"Project name",//Açıklama yapılan satır
            demandOption: true,//zorunlu olup olmadığını soruyor
            type:'string',
            aliases:'n'
        }
    })
    .help()
    .argv as {[key:string]:unknown ,_: string[]};


if(argv._.includes("create")){
    createStyleCss();
}

if(argv._.includes("build")){
    exec("npm run build",(error,stdout,stderr)=>{
        if(error){
            console.error(`Error:${stdout}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr:${stderr}`);
    });
}

if(argv._.includes("new")){
    let projectName = argv.name as string;

    if(!projectName){
        rl.question("Please enter a project name:",(inputName:string)=>{
            projectName = inputName;
            rl.close();
            createNewProject(projectName)
        })
    }
}
function createNewProject(projectName:string){
    fs.mkdirSync(projectName);

    exec(`git clone https://github.com/TanerSaydam/task-angular-app.git ${projectName}`,(error,stdout,stderr)=>{
        if(error){
            console.error(`Error:${stdout}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr:${stderr}`);

        exec(`cd ${projectName} && npm install`,(error,stdout,stderr)=>{
            if(error){
                console.error(`Error:${stdout}`);
                return;
            }
    
            console.log(`stdout: ${stdout}`);
            console.error(`stderr:${stderr}`);
        })
    })
}

function createStyleCss(){
    const defaultCss = `
    *{
        margin:0;
        padding:0;
    }`

    fs.writeFileSync("style.css",defaultCss);
    console.log("Style.css has been created");
}


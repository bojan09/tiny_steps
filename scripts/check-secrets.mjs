import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
for(const file of ['.env','.env.keepalive.local']){try{process.loadEnvFile(file)}catch{}}
const secrets=[];
for(const name of ['SERVICE_ROLE_KEY','GROQ_API_KEY','DATABASE_URL','DIRECT_URL','SUPABASE_KEEPALIVE_DATABASE_URL']){
 const value=process.env[name];if(value&&value.length>20)secrets.push({name,value});
 if(value&&name.endsWith('URL')){try{const password=decodeURIComponent(new URL(value).password);if(password.length>12)secrets.push({name:name+'_PASSWORD',value:password});}catch{}}
}
if(!secrets.length)throw new Error('Local credentials unavailable for leak check');
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean);
async function addStatic(dir){for(const item of await readdir(dir,{withFileTypes:true}).catch(()=>[])){const file=join(dir,item.name);if(item.isDirectory())await addStatic(file);else files.push(file);}}
await addStatic('.next/static');
let failed=false;
for(const file of files){if(!/\.(?:[cm]?[jt]sx?|json|md|html|css|ya?ml|sql|txt|map)$/.test(file))continue;const content=await readFile(file,'utf8');for(const secret of secrets){if(content.includes(secret.value)){console.error('Credential leak:',secret.name,'in',file);failed=true;}}}
if(failed)process.exitCode=1;else console.log('PASS: no configured private credentials in tracked/unignored source or browser bundles.');

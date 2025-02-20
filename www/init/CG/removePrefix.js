const prefix = /\\([^\\]+)$/.exec(__dirname)[1]+'_';
const fs = require('fs');
for(const file of fs.readdirSync(__dirname+'\\')) if(file.startsWith(prefix)) fs.rename(__dirname+'\\'+file,__dirname+'\\'+file.replace(prefix,''),()=>{});
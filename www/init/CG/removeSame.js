const fs = require('fs');
function myFn(path = __dirname+'\\',reg = /[^(js)]$/){
    const mulu = fs.readdirSync(path).filter(str=>reg.test(str));
    var subPath,i,temp;
    while(subPath = mulu.pop()){try{
        if(fs.statSync(path+subPath,{throwIfNoEntry: true}).isDirectory()) myFn(path+subPath+'\\',reg);else{
            i = mulu.length,subPath = fs.readFileSync(path+subPath);
            while(i --> 0) fs.statSync(temp = path+mulu[i]).isDirectory() || subPath.compare(fs.readFileSync(temp)) || fs.unlinkSync(temp);
        }
    }catch(e){}}
}
myFn();
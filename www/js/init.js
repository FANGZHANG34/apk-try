"use strict";
RealWorld.onload = Promise.all([RealWorld.onload,new Promise(r=>document.addEventListener(
	'deviceready',function temp(){r();nodePath.root = window.cordova.file.dataDirectory;document.removeEventListener('deviceready',temp)}
))]);
RealLoader.fs.stat = path=>RealWorld.cb2promise({useFn: nodeFs.exists},nodePath.resolve(path));
RealLoader.fs.readdir = path=>RealWorld.cb2promise({useFn: nodeFs.readdir},nodePath.resolve(path));

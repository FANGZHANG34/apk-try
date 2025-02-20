"use strict";
var exports = exports ?? {};
const nodeFs = {
	/**
	 * 检查文件是否存在
	 * @param {String} path 
	 * @param {(Boolean)=>void} callback 
	 */
	exists: (path,callback)=>window.resolveLocalFileSystemURL(path,()=>callback(true),()=>callback(false)),

	/**
	 * 创建目录
	 * @param {String} path 
	 * @param {(error?: Error)=>void} callback 
	 */
	mkdir: (path,callback)=>window.resolveLocalFileSystemURL(path,{create: true},()=>callback(),error=>callback(error)),

	/**
	 * 删除文件
	 * @param {String} path 
	 * @param {(error?: Error)=>void} callback 
	 */
	unlink: (path,callback)=>window.resolveLocalFileSystemURL(path,fileEntry=>fileEntry.remove(()=>callback(),error=>callback(error)),error=>callback(error)),

	/**
	 * 删除目录
	 * @param {String} path 
	 * @param {(error?: Error)=>void} callback 
	 */
	rmdir: (path,callback)=>window.resolveLocalFileSystemURL(path,dirEntry=>dirEntry.removeRecursively(()=>callback(null),error=>callback(error)),error=>callback(error)),

	/**
	 * 读取目录内容
	 * @param {String} path 
	 * @param {(error?: Error,entries?: String[])=>void} callback 
	 */
	readdir: (path,callback)=>window.resolveLocalFileSystemURL(path,dirEntry=>{
		const reader = dirEntry.createReader();
		reader.readEntries((entries)=>{
			var i = entries.length;
			while(i --> 0) entries[i] = entries[i].name;
			callback(null,entries);
		},error=>callback(error));
	},error=>callback(error)),

	/**
	 * 读取文件内容
	 * @param {String} path 
	 * @param {"utf-8"?} encoding 
	 * @param {(error?: Error,result?: String | ArrayBuffer)=>void} callback 
	 */
	readFile: (path,encoding,callback)=>window.resolveLocalFileSystemURL(path,fileEntry=>fileEntry.file(
		file=>{
			const reader = new FileReader();
			reader.onloadend = ()=>callback(null,reader.result);
			reader.onerror = error=>callback(error);
			encoding === "utf-8" ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
		},(error)=>callback(error)
	),error=>callback(error)),

	/**
	 * 写入文件内容
	 * @param {String} path 
	 * @param {BlobPart[]} data 
	 * @param {(error?: Error)=>void} callback 
	 */
	writeFile: (path,data,callback)=>window.resolveLocalFileSystemURL(path,{create: true},fileEntry=>fileEntry.createWriter(
		fileWriter=>{
			fileWriter.onwriteend = ()=>callback();
			fileWriter.onerror = error=>callback(error);
			fileWriter.write(new Blob([data],{type: "text/plain"}));
		},error=>callback(error)
	),error=>callback(error)),
};
const nodePath = {
	/**
	 * 根目录（私有存储目录）
	 * @type {String}
	 */
	root: '',

	/**
	 * 规范化路径（去除多余的斜杠）
	 * @param {String} path 
	 */
	normalize: path=>{
		const temp = path.split(/\/+/);
		switch(temp[0].toLocaleLowerCase()){
			case 'file:':temp[0] += '//';
			case 'http:':case 'https:':temp[0] += '/';
		}
		return temp.join('/');
	},

	/**
	 * 判断路径是否为绝对路径
	 * @param {String} path 
	 */
	isAbsolute: path=>path.startsWith(nodePath.root),

	/**
	 * 解析路径（返回绝对路径）
	 * @param {...String} paths 
	 */
	resolve: (...paths)=>nodePath.join(nodePath.root,...paths),

	/**
	 * 拼接路径
	 * @param {...String} paths 
	 */
	join: (...paths)=>nodePath.normalize(paths.join("/")),

	/**
	 * 获取路径的目录名
	 * @param {String} path 
	 */
	dirname: path=>path.substring(0,path.lastIndexOf("/")),

	/**
	 * 获取路径的文件名
	 * @param {String} path 
	 */
	basename: path=>path.substring(path.lastIndexOf("/") + 1),

	/**
	 * 获取路径的扩展名
	 * @param {String} path 
	 */
	extname: path=>{
		const basename = nodePath.basename(path);
		const lastDotIndex = basename.lastIndexOf(".");
		return ~lastDotIndex ? basename.substring(lastDotIndex) : '';
	},

	/**
	 * 将路径转换为相对路径
	 * @param {String} from 
	 * @param {String} to 
	 */
	relative: (from,to)=>{
		const fromParts = from.split("/").filter(Boolean);
		const toParts = to.split("/").filter(Boolean);

		var i = 0;
		while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) i++;

		const relativePath = [
			...Array(fromParts.length - i).fill(".."),
			...toParts.slice(i),
		].join("/");

		return relativePath || ".";
	}
};

Object.assign(exports,{nodeFs,nodePath});
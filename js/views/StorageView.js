var StorageView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-storage-details').html()),
	initialize: function(){
		alert("initialize StorageView");
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFSSuccess, app.onError);
	},
    	onFSSuccess: function(fs){
        	alert("onFSSuccess");
		alert(fs);
		fileSystem = fs; 
		//return fileSystem;
		fileSystem.root.getFile("test.txt", {create:true}, this.fileAppend, this.onFail);
	},
    	onFail: function(e){
			alert("onFail");
			alert(e);
	},
  	fileAppend: function(f){
		alert("fileAppend");
  		alert(f.fullPath);
    		f.createWriter(function(writerOb) {
			alert("f.createWriter");
			alert(writerOb);
			// blows up here
			writerOb.onwrite=function() {
				alert("writerOb.onwrite");
            			app.showContent("Done writing to file.<p/>");
        	  	}
        		//go to the end of the file...
        		writerOb.seek(writerOb.length);
			var localSave = getLocalData("local","save");
        		writerOb.write(localSave)
    		})
        },
  	getLocalData: function(a,t){
     		alert("a: "+a);
     		alert("t: "+t);
     		var localSave;
     		var prevStorage = window.localStorage.getItem("fcs-keys");
      		alert("prevStorage: "+prevStorage); 
     		if (prevStorage != null){
	     		alert("The following session keys are saved " + prevStorage);
	     		var keysArray = prevStorage.split(',');
	     		//var connectionStatus = navigator.onLine ? 'online' : 'offline';
	     		//if(connectionStatus != "offline") {
	     		var currentKey; // currentKey = sessionid
	     		var loopNum=keysArray.length;
	     		alert("Should loop " + loopNum + " times");
	     		for(var i=0; i<loopNum; i++){
		     		//alert("Loop number " +  i + "");
		     		currentKey = keysArray.pop();
		     		//alert("currentKey: "+currentKey);
		     		currentTime = currentKey.split('-');
		     		//alert("currentTimestamp: "+currentTime[2]);
		     		var read =  window.localStorage.getItem(currentKey);
		     		if(a=="local"){
     					//alert("a: "+a);
					localSave += read;	
		     		}
		     		//alert("Read Session: "+ read);
		     		if(a=="remote"){
					alert("read: "+read);
		     			app.submitRemote(read,currentTime[2]);
		     		}
			     	//to_submit = read.split(',');
			     	//n = oldKey.split('_')[1];
	     		} // close for
	     		if(a=="local"){
   				alert("a Save: ");
				return localSave;
	     		}
		}
	},
	render: function(){
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Camera");
		$(this.el).html("");
		//$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
	}
});

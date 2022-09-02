export class WebRtc{
    SPLIT_SIZE = 16 * 1024;
    file;
    fileList = {};
    processingData = {};
    peer;
    processingId;
    

    constructor(socket, type){
        this.type = type;

        //WebRTCAPI
        this.pc_config = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
        this.peer = new RTCPeerConnection(this.pc_config);

        //WebSocket
        this.socket = socket;

        //FileReader
        this.reader = new FileReader();

        this.processSize = 0;
        this.dataChannelList = [];
        this.dataList = [];
        this.fileData = null;

        this.FileStatus = false;

        if(this.type === "receive"){
            this.setUpReveive();
        }
    }

    reset(){
        this.processingData = {};
        this.processSize = 0;
        this.dataChannelList = [];
        this.processingId = null;
    }

    //Set up receive
    setUpReveive(){
        this.peer.ondatachannel = (event) => {
            const datachannel = event.channel;
    
            datachannel.onmessage = (event) => {
                var receiveData = event.data;
    
                if(typeof(receiveData) === "string"){
                    var data = JSON.parse(receiveData);

                    if(data.message === "done"){                    
                        var id = data.id;

                        this.fileData = this.dataJoin(this.processingData);

                        this.fileList[id] = {data: this.fileData};

                        this.socket.emit("file-success", {message: "done"});
                    }
    
                }else{
                    this.processSize += receiveData.byteLength;
                    //setParcent(Math.round((this.processSize / fileSize) * 100));
    
                    var id = event.currentTarget.label;

                    console.log(receiveData);
    
                    if(this.processingData[id] != null){
                        this.processingData[id].push(receiveData);
                    }else{
                        this.processingData[id] = [];
                        this.processingData[id].push(receiveData);
                    }
    
                }
            };
        };

        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit("owner-candidate", { candidate: event.candidate });
            }
        };
    }

    //Send key to signaling server
    async sendKey(key){
        if(this.type === "send"){
            var actionName = "owner-login";
        }else{
            var actionName = "client-login";
        }

        var result = await this.socket.emit(actionName, {key: key});
        return result.connected;
    }

    //Select file
    handleFile(event, fileId){
        var file = event.currentTarget.files[0];
        var fileInfo = {name: file["name"], type: file["type"], size: file["size"]};
            
        this.reader.onload = () => {
            this.fileData = this.reader.result;

            var dataList = this.splitData();

            this.fileList[fileId] = {info: fileInfo, data: dataList};
            console.log(this.fileList);
        };

        this.reader.readAsArrayBuffer(file);

        return fileInfo;
    }

    getFileData(){
        return this.fileData;
    }

    //Split data
    splitData(){
        var index = 0;
        var fileLength = this.fileData.byteLength;

        var list = [];

        while (index * this.SPLIT_SIZE < fileLength) {
            list.push(this.fileData.slice(index * this.SPLIT_SIZE, (index + 1) * this.SPLIT_SIZE));

            index++;
        }


        list = this.dataChannelSplit(list);

        return list;
    }

    //DataChannel split
    dataChannelSplit(list){
        var newList = [];
        var index = 0;
        var splitNum = 1024;

        while (index * splitNum <= list.length) {
            newList.push(list.slice(index * splitNum, (index + 1) * splitNum));

            index++;
        }


        return newList;
    };

    //Join data
    dataJoin(dataList){
        var sumLength = 0;

        var allDataList = [];
        Object.keys(dataList).forEach((id) => {
            dataList[id].forEach(data => {allDataList.push(data)})
        });


        allDataList.forEach((data) => {
            sumLength += data.byteLength;
        });

        var whole = new Uint8Array(sumLength);
        var pos = 0;

        allDataList.forEach((data) => {
            whole.set(new Uint8Array(data), pos);
            pos += data.byteLength;
        });

        return whole.buffer;
    };

    //Create DataChannel
    createChannel(fileId){
        this.processingFile = this.fileList[fileId];
        this.processingId = fileId;

        for (var i = 0; i < this.processingFile["data"].length; i++) {
            var datachannel = this.peer.createDataChannel(String(i));
            datachannel.binaryType = "arraybuffer";

            this.dataChannelList.push(datachannel);

            datachannel.onopen = async (event) => {
                datachannel = event.currentTarget;

                var id = Number(datachannel.label);

                var splitData = this.processingFile["data"][id];

                splitData.forEach(async (data) => {
                    await datachannel.send(data);

                    this.processSize += data.byteLength;

                    console.log(this.processSize);
                    console.log(this.processingFile["info"].size);

                    if ((id + 1 === this.dataChannelList.length) && (this.processSize === this.processingFile["info"].size)) {
                        await datachannel.send(JSON.stringify({ message: "done" , id: this.processingId}));
                        console.log("DONE!!");
                    }
                });
            };
        }
    };

    //Create offer
    async createOffer(fileId){
        this.createChannel(fileId);

        if(this.peer.connectionState !== "connected"){
            this.peer.onicecandidate = ((event) => {
                this.socket.emit("client-candidate", { candidate: event.candidate });
            });
    
            this.peer.onconnectionstatechange = (event) => {
                console.log(this.peer.connectionState);
            };
    
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(offer);
    
            this.socket.emit("new-offer", { sdp: offer });
    
            console.log("Offer");
        }

    };

    //Create Answer
    async createAnswer(){
        const answer = await this.peer.createAnswer();

        if(this.peer.localDescription === null){
            await this.peer.setLocalDescription(answer);
    
            this.socket.emit("answer", { sdp: answer });
        }
    }

    //Add IceCanadidate
    async addCanadidate(candidate){
        await this.peer.addIceCandidate(candidate);
    }

    //Set remote desciption
    async setRemote(sdp){
        console.log(this.peer.remoteDescription);
        if (this.peer.remoteDescription === null) {
            await this.peer.setRemoteDescription(new RTCSessionDescription(sdp));

            if(this.type === "receive"){
                this.createAnswer();
            }
        }
    }

    downloadFile(id, fileType){
        const blob = new Blob([this.fileList[id].data], {type: fileType});
        return blob;              
    };
}
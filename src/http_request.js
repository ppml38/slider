export class HTTPRequest{
    constructor(app) {
        this.app = app;
        this.method = "GET";
        this.api = "/";
        this.data = null;
        this.statusCallMap = {
            200:(data)=>{}
        };
        this.failureCallBack = (data)=>{};
        this.errorCallBack = (data)=>{};
    }
    setMethod(method){
        this.method=method;
        return this;
    }
    setApi(api){
        this.api = api;
        return this;
    }
    setData(data){
        this.data=data;
        return this;
    }
    onSuccess(callBackFunction){
        this.statusCallMap[200] = callBackFunction;
        return this;
    }
    onFailure(callBackFunction){
        this.failureCallBack = callBackFunction;
        return this;
    }
    onError(callBackFunction){
        this.errorCallBack = callBackFunction;
        return this;
    }
    onStatus(status, callBackFunction){
        this.statusCallMap[status] = callBackFunction;
        return this;
    }
    parseJson(text){
        let data = {};
        try{
            data = JSON.parse(text);
        }
        catch (error){
            data = {};
        }
        return data;
    }
    call(){
        let init= {
            method: this.method,
            credentials: 'include'
        };
        if(this.data!==null){
            init["body"] = this.data;
        }
        fetch(this.api, init)
            .then(response => {
                if (response["status"] in this.statusCallMap) {
                    response.text().then(text_data => {
                        this.statusCallMap[response["status"]](this.parseJson(text_data));
                    });
                } else {
                    response.text().then(text_data => {
                        this.failureCallBack(this.parseJson(text_data));
                    });
                }
            })
            .catch(error => {
                // By default, we set below message. it can be overriden by call back function.
                this.app.state.getState("message_box_content").set({"text":"Network error occurred. please check your internet connection.","severity":"error"});
                this.errorCallBack();
                throw error;
        });
    }
}
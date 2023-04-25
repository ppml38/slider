export class JsHelper{
    constructor(dom_element = null) {
        this.temp_dom_element=dom_element;
    }
    create(tagName){
        this.temp_dom_element=document.createElement(tagName);
        return this;
    }
    set(attributeName, attributeValue){
        this.temp_dom_element.setAttribute(attributeName, attributeValue);
        return this;
    }
	html(innerhtml){
		this.temp_dom_element.innerHTML = innerhtml;
		return this;
	}
	style(property,value){
		this.temp_dom_element.style[property] = value;
		return this;
	}
	styleClass(styleobject){
		Object.keys(styleobject).map((k)=>{
			this.style(k,styleobject[k]);
		});
		return this;
	}
    get(){
        return this.temp_dom_element;
    }
    add(element){
        this.temp_dom_element.appendChild(element);
        return this;
    }
    prepend(element){
        this.temp_dom_element.prepend(element);
        return this;
    }
    text(innertext){
        this.temp_dom_element.innerText = innertext;
        return this;
    }
    class(classname){
        this.temp_dom_element.classList.add(classname);
        return this;
    }
    style(property,value){
        this.temp_dom_element.style[property]=value;
        return this;
    }
    delete_class(classname){
        this.temp_dom_element.classList.remove(classname);
        return this;
    }
	onload(onLoadFunction){
        this.temp_dom_element.onload = onLoadFunction;
        return this;
    }
    onclick(onClickFunction){
        this.temp_dom_element.onclick = onClickFunction;
        this.temp_dom_element.ontouch = onClickFunction;
        return this;
    }
    onmousedown(onMouseDownFunction){
        this.temp_dom_element.onmousedown = onMouseDownFunction;
        this.temp_dom_element.ontouchstart = onMouseDownFunction;
        return this;
    }
    onmouseup(onMouseUpFunction){
        this.temp_dom_element.onmouseup = onMouseUpFunction;
        this.temp_dom_element.ontouchend = onMouseUpFunction;
        return this;
    }
    onenter(enterKeyPressFunction){
        this.temp_dom_element.onkeyup = (event)=>{
            if(event.code==="Enter"){
                enterKeyPressFunction();
            }
        }
        return this;
    }
    onchange(onChangeFunction){
        this.temp_dom_element.onchange = onChangeFunction;
        return this;
    }
    oninput(onInputFunction){
        this.temp_dom_element.oninput = onInputFunction;
        return this;
    }
    onsubmit(onSubmitFunction){
        this.temp_dom_element.onsubmit = onSubmitFunction;
        return this;
    }
	onbeforeunload(onbeforeunloadFunction){
		this.temp_dom_element.onbeforeunload = onbeforeunloadFunction;
		return this;
	}
	onanimationend(onanimationendFunction){
		this.temp_dom_element.onanimationend = onanimationendFunction;
		return this;
	}
	onunload(onunloadFunction){
		this.temp_dom_element.onunload = onunloadFunction;
		return this;
	}
    onstoptyping(interval, onStopTypingFunction){
        this.typingTimer = null;
        let targetFunction = (event) => {
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(()=>onStopTypingFunction(event), interval);
        }
        this.temp_dom_element.onkeyup = targetFunction;
        this.temp_dom_element.onchange = targetFunction;
        this.temp_dom_element.onkeydown = () => {
            clearTimeout(this.typingTimer);
        }
        return this;
    }
    swap(new_element){
        this.temp_dom_element.replaceChildren(new_element);
        return this;
    }
    empty(){
        while(this.temp_dom_element.firstChild) {
            this.temp_dom_element.removeChild(this.temp_dom_element.firstChild);
        }
        return this;
    }
    disable(){
        this.temp_dom_element.disabled = true;
        this.class("disabled");
        return this;
    }
    enable(){
        this.temp_dom_element.disabled = false;
        this.delete_class("disabled");
        return this;
    }
    scrollBottom(){
        this.temp_dom_element.scrollTop = this.temp_dom_element.scrollHeight;
        return this;
    }
    createRow(label, name, type){
        let row = new JsHelper().create("tr").get();

        let label_cell = new JsHelper().create("td").get();
        let labelElement = new JsHelper().create("label").set("for",name).get();
        labelElement.innerText=label;
        label_cell.appendChild(labelElement);

        let inputCell = new JsHelper().create("td").get();
        let inputElement = new JsHelper().create("input").set("type",type).set("name",name).set("id",name).get();
        inputCell.appendChild(inputElement);

        row.appendChild(label_cell);
        row.appendChild(inputCell);
        return row;
    }
}
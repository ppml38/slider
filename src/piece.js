import {JsHelper} from './jshelper.js';
export class Piece{
	constructor(pieceJson){
		this.type = pieceJson.type||'div';
		this.parentDiv = new JsHelper()
							.create(this.type);
		
		this.inAnimation = pieceJson.inAnimation||null;
		this.outAnimation = pieceJson.outAnimation||null;
		this.showDuration = pieceJson.showDuration||null;
		
		this.backgroundColor = pieceJson.backgroundColor||'transparent';
		this.backgroundImage = pieceJson.backgroundImage ? `url(${pieceJson.backgroundImage})` : 'none';
		this.backgroundEffect = pieceJson.backgroundEffect||'none';
		
		this.userClass=pieceJson.class ? pieceJson.class.split(' ') : [];
		this.userStyle = pieceJson.style||{};
		
		this.property = pieceJson.property||{};
	}
	
	setStyle(calculatedClass){
		
		// setting default style
		this.parentDiv.class(this.defaultClass);
		
		// setting calculated class we did from user inputs etc.. 
		this.parentDiv.styleClass(calculatedClass);
		
		// setting user defined class next
		this.userClass.map((c)=>{
			this.parentDiv.class(c);
		});
		
		// setting the style found in slide file. this overrides default styles set above.
		this.parentDiv.styleClass(this.userStyle);
	}
	
	setProperty(){
		Object.keys(this.property).map((k)=>{
			this.parentDiv.set(k,this.property[k]);
			this.parentDiv.get()[k] = this.property[k];
		});
	}
	
	assignAnimations(){
		this.parentDiv.delete_class("fadeOut");
		if(this.inAnimation==='fadein'){
			this.parentDiv.class("fadeIn");
		}
	}
}
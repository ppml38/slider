import {JsHelper} from './jshelper.js';
export class Segment{
	constructor(segmentJson){
		this.type = segmentJson.type||'div';
		this.url = segmentJson.url||'';
		this.html = segmentJson.html||'';
		
		this.inAnimation = segmentJson.inAnimation||null;
		this.outAnimation = segmentJson.outAnimation||null;
		this.showDuration = segmentJson.showDuration||null;
		this.showAfter = segmentJson.showAfter||null;
		
		this.revealOnClick = segmentJson.revealOnClick||null;
		
		this.backgroundColor = segmentJson.backgroundColor||'transparent';
		this.backgroundImage = segmentJson.backgroundImage ? `url(${segmentJson.backgroundImage})` : 'none';
		this.backgroundEffect = segmentJson.backgroundEffect||'none';
		
		this.width = segmentJson.width||'auto';
		this.height = segmentJson.height||'auto';
		this.top = segmentJson.top||'0px';
		this.left = segmentJson.left||'0px';
		
		this.style = segmentJson.style||{};
		
		this.unrenderedAlready=false;
		
		this.parentDiv = new JsHelper()
							.create(this.type||"div")
							.set("src",this.url)
							.html(this.html);
		
	}
	setStyle(){
		this.parentDiv.styleClass(
				{
					'display': 'block',
					'position': 'relative',
					'background-color': this.backgroundColor,
					'background-image': this.backgroundImage,
					'width': this.width,
					'height': this.height,
					'max-width': this.width==='auto' ? 'none' : this.width,
					'max-height': this.height==='auto' ? 'none' : this.height,
					'min-width': this.width,
					'min-height': this.height,
					'top': this.top,
					'left':this.left
				}
		);
		this.parentDiv.styleClass(this.style);
		
	}
	assignAnimations(){
		this.parentDiv.delete_class("fadeOut");
		if(this.inAnimation==='fadein'){
			this.parentDiv.class("fadeIn");
		}
	}
	unrender(){
		// as unrender() is being called from here as well as from slide, this causes duplicate onanimationend() and unrenders
		// when inAnimation loaded instead of outAnimation. so adding below if condition to eliminate redundent unrender() calls.
		if(this.unrenderedAlready===true){
			return;
		}
		this.unrenderedAlready=true;
		// clear timers if any
		if(this.timer){
			clearTimeout(this.timer);
		}
		
		// showing animation before unloading element
		if(this.outAnimation==='fadeout'){
			this.parentDiv.onanimationend(()=>{
					this.parentDiv.onanimationend(null); // to prevent animation loop, as this callback will be invoked, when this slide loads again.
					this.parentDiv.style("display","none");
				});
			this.parentDiv.delete_class("fadeIn");
			this.parentDiv.class("fadeOut");
		}
		else{
			this.parentDiv.style("display","none");
		}
	}
	showSegment(){
		if(this.showDuration!==null){
			if(this.timer){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(()=>{this.unrender()},Number(this.showDuration));
		}
		
		this.setStyle();
		this.assignAnimations();
	}
	reveal(){
		// reveal after click
		this.showSegment();
	}
	render(){
		this.unrenderedAlready=false;
		this.parentDiv.onanimationend(null); // clearing up incomplete callback from previous render.
		
		if(this.revealOnClick!==null){
			// return empty div to be revealed on click.
			this.parentDiv.style("display","none");
			return this.parentDiv.get();
		}
		
		if(this.showAfter!==null){
			this.parentDiv.style("display","none");
			if(this.timer){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(()=>{this.showSegment()},Number(this.showAfter));
		}
		else{
			this.showSegment();
		}
		return this.parentDiv.get();
	}
}
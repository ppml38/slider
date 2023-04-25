import {Segment} from './segment.js';
import {JsHelper} from './jshelper.js';
export class Slide{
	constructor(slideJson){
		this.parentDiv = new JsHelper()
							.create("div");
		
		this.inAnimation = slideJson.inAnimation||null;
		this.outAnimation = slideJson.outAnimation||null;
		this.showDuration = slideJson.showDuration||null;
		this.backgroundColor = slideJson.backgroundColor||'transparent';
		this.backgroundImage = slideJson.backgroundImage ? `url(${slideJson.backgroundImage})` : 'none';
		this.backgroundEffect = slideJson.backgroundEffect||'none';
		this.showOutline = slideJson.showOutline===false ? false : true;
		this.width = slideJson.width||'800px';
		this.height = slideJson.height||'600px';
		this.style = slideJson.style||{};
		
		this.segments = [];
		slideJson.segments.map((segmentJson)=>{
			this.segments.push(new Segment(segmentJson));
		});
		
		this.clickSequence = Array(this.segments.length);
		this.currentClick = 0; // because clicksequence starts with 1
		this.parentDiv.onclick(()=>{
			this.currentClick+=1;
			let revealFunction = this.clickSequence[this.currentClick];
			if(revealFunction){
				revealFunction();
				this.clickSequence[this.currentClick] = null;
			}
		});
	}
	setStyle(){
		this.parentDiv.styleClass(
				{
					'position': 'relative',
					'display': 'inline-block',
					'left': '50%',
					'top': '50%',
					'transform': 'translate(-50%,-50%)',
					'box-shadow': this.showOutline ? 'rgba(0, 0, 0, 0.16) 0px 1px 4px' : 'none',
					'background-color': this.backgroundColor,
					'background-image': this.backgroundImage,
					//'border': this.showOutline ? 'solid 1px lightgray' : 'none',
					'width': this.width,
					'height': this.height,
					'max-width': this.width,
					'max-height': this.height,
					'min-width': this.width,
					'min-height': this.height
				}
		);
		this.parentDiv.styleClass(this.style);
	}
	assignAnimations(){
		this.parentDiv.delete_class("fadeOut"); // we need to delete out animation, as a slide can have only one in/out.
		if(this.inAnimation==='fadein'){
			this.parentDiv.class("fadeIn");
		}
	}
	unrender(callback){
		// showing exit animation of segments first
		this.segments.map((segment)=>{
				segment.unrender();
			});
		// showing slide exit animation
		if(this.outAnimation==='fadeout'){
			this.parentDiv.onanimationend(()=>{
					this.parentDiv.onanimationend(null); // to prevent animation loop, as this callback will be invoked, when this slide loads again.
					callback();
				});
			this.parentDiv.delete_class("fadeIn");
			this.parentDiv.class("fadeOut");
		}
		else{
			// if no out animation, nothing to wait for, just run callback.
			callback();
		}
	}
	render(){
		// reset click count
		this.currentClick = 0;
		// set slide style
		this.setStyle();
		// render all the segments in the slide
		this.segments.map((segment)=>{
			// appendChild() will remove the node from wherever it is, before appending it to its new location
			// So no need to check for duplicate segments added or replaceChildren(), as above property implicitly removes duplicate in our case.
			this.parentDiv.add(segment.render());
			if(segment.revealOnClick!==null){
				this.clickSequence[Number(segment.revealOnClick)]=()=>{
					segment.reveal();
				};
			}
		});
		this.assignAnimations(); // showing animation every time slide rendered.
		return this.parentDiv.get();
	}
}
import {Segment} from './segment.js';
import {JsHelper} from './jshelper.js';
import {Piece} from './piece.js';
export class Slide extends Piece{
	constructor(slideJson){
		super(slideJson);
		
		this.showOutline = slideJson.showOutline===false ? false : true;
		this.width = slideJson.width||'800px';
		this.height = slideJson.height||'600px';
		
		
		// below requires the root element to be set with constant height and width and the element to be passed
		// here to get its height and width (after added to dom, if relative height and with mentioned.)
		// we cant expect users to set constant height and width. so commenting this out for now.
		// Users can always set style if they need full size.
		//slideJson.dimension&&this.adjustSize(slideJson.dimension[0],slideJson.dimension[1]);
		
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
		
		this.defaultClass="__slide";
		this.calculatedClass = {
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
			};
	}
	adjustSize(wr, hr){ // width ratio, height ration ex. 4:3, 16:9 etc
		let parentwidth = this.parentDiv.get().parentNode.innerWidth;
		let parentheight = this.parentDiv.get().parentNode.innerHeight;
		
		let sizeSet = false;
		if(parentheight>parentwidth){ // vertical screens
			let unit = Math.floor(parentwidth/wr);
			let expected_height = unit*hr;
			if(expected_height<=parentheight){
				this.width = `${unit*wr}px`;
				this.height = `${unit*hr}px`;
				sizeSet = true;
			}
		}
		// normal horizontal screens
		if(sizeSet===false){
			let unit = Math.floor(parentwidth/hr);
			let expected_width = unit*wr;
			this.width = `${unit*wr}px`;
			this.height = `${unit*hr}px`;
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
		this.setStyle(this.calculatedClass);
		// set properties
		this.setProperty();
		
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
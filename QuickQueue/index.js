var l=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as c,store as p}from"@neptune";import{ReactiveRoot as q}from"@neptune/components";import{html as v}from"@neptune/voby";var f=t=>{let e=t.attributes,o={};for(let n=0;n<e.length;n++){let s=e[n];o[s.name]=s.value}return o},$=(t,e)=>{let{elements:o}=p.getState().playQueue,n=o.some(r=>r.mediaItemId===e),s=n?"detail-view__trashcan":"player__queue-add",u=n?"Remove from queue":"Add to queue",a=t.querySelector('button[data-test="add-to-playlist-button"]');if(!a)return null;let y=f(a),g=f(a.querySelector("svg"));return v`
        <button
            ${Object.entries(y).map(([r,i])=>`${r}="${i}"`).join(" ")}
            data-test="quick-queue"
            aria-label=${u}
            title=${u}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:r,currentIndex:i}=p.getState().playQueue;for(let d=i+1;d<r.length&&r[d].priority==="priority_keep";d++)if(r[d].mediaItemId===e){c.playQueue.removeAtIndex({index:d}),c.message.messageInfo({message:"Removed from play queue"});return}c.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),c.message.messageInfo({message:"Added to play queue"})}}
        >
            <svg ${Object.entries(g).map(([r,i])=>`${r}="${i}"`).join(" ")}>
                <use href=${`#${s}`}></use>
            </svg>
        </button>
    `},E=(t,e,o,n,s)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(o);if(a!==null&&(u=n,l(u)))return a.parentElement.insertBefore(u,s instanceof Element?s:s?t.querySelector(s):a)},b=(t,e)=>{let o=$(t,e);E(t,"quick-queue",'button[data-test="add-to-playlist-button"]',q({children:o}),'button[data-test="add-to-playlist-button"]')};var m=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let o of e.addedNodes)if(l(o)){let n=o.querySelectorAll('div[data-test="tracklist-row"]');n.length!==0&&I(n)}}}),I=async t=>{for(let e of t){let o=e.getAttribute("data-track-id");if(o==null)return;b(e,o)}},h=()=>{m.disconnect(),m.observe(document.body,{childList:!0,subtree:!0})};h();var j=()=>{m.disconnect()};export{j as onUnload,h as updateObserver};

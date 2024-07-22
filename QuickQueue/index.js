var l=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as c,store as f}from"@neptune";import{ReactiveRoot as v}from"@neptune/componoents";import{html as m}from"@neptune/voby";var b=t=>{let e=t.attributes,o={};for(let n=0;n<e.length;n++){let s=e[n];o[s.name]=s.value}return o},$=(t,e)=>{let{elements:o}=f.getState().playQueue,n=o.some(r=>r.mediaItemId===e),s=n?"detail-view__trashcan":"player__queue-add",u=n?"Remove from queue":"Add to queue",a=t.querySelector('button[data-test="add-to-playlist-button"]');if(!a)return null;let g=b(a),q=b(a.querySelector("svg"));return m`
        <button
            ${Object.entries(g).map(([r,i])=>m`${r}=${i}`)}
            data-test="quick-queue"
            aria-label=${u}
            title=${u}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:r,currentIndex:i}=f.getState().playQueue;for(let d=i+1;d<r.length&&r[d].priority==="priority_keep";d++)if(r[d].mediaItemId===e){c.playQueue.removeAtIndex({index:d}),c.message.messageInfo({message:"Removed from play queue"});return}c.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),c.message.messageInfo({message:"Added to play queue"})}}
        >
            <svg ${Object.entries(q).map(([r,i])=>m`${r}=${i}`)}>
                <use href=${`#${s}`}></use>
            </svg>
        </button>
    `},E=(t,e,o,n,s)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(o);if(a!==null&&(u=n,l(u)))return a.parentElement.insertBefore(u,s instanceof Element?s:s?t.querySelector(s):a)},y=(t,e)=>{let o=$(t,e);E(t,"quick-queue",'button[data-test="add-to-playlist-button"]',v({children:o}),'button[data-test="add-to-playlist-button"]')};var p=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let o of e.addedNodes)if(l(o)){let n=o.querySelectorAll('div[data-test="tracklist-row"]');n.length!==0&&I(n)}}}),I=async t=>{for(let e of t){let o=e.getAttribute("data-track-id");if(o==null)return;y(e,o)}},h=()=>{p.disconnect(),p.observe(document.body,{childList:!0,subtree:!0})};h();var w=()=>{p.disconnect()};export{w as onUnload,h as updateObserver};

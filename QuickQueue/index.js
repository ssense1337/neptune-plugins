var c=n=>n?.nodeType===Node.ELEMENT_NODE;import{actions as d,store as p,intercept as y}from"@neptune";import{ReactiveRoot as Q}from"@neptune/components";import{$ as _,html as A,useMemo as b}from"@neptune/voby";var l=new Map,E=()=>[y("playQueue/ADD_MEDIA_ITEMS_TO_QUEUE",n=>{let[{mediaItemIds:e}]=n;e.forEach(t=>{l.has(t)&&l.get(t)(!0)})}),y("playQueue/REMOVE_ELEMENT",([{uid:n}])=>{let e=p.getState().playQueue,t=e.currentIndex;for(let o=t+1;o<e.elements.length&&e.elements[o].priority==="priority_keep";o++)if(e.elements[o].uid===n){let r=e.elements[o].mediaItemId;l.has(r)&&l.get(r)(!1);return}})],g=n=>{let e=n.attributes,t={};for(let o=0;o<e.length;o++){let r=e[o];t[r.name]=r.value}return t},k=(n,e)=>{let t=_(!1),{elements:o,currentIndex:r}=p.getState().playQueue;for(let s=r+1;s<o.length&&o[s].priority==="priority_keep";s++)o[s].mediaItemId===e&&t(!0);l.set(e,t);let u=b(()=>"#"+(t()?"detail-view__trashcan":"player__queue-add")),a=b(()=>t()?"Remove from queue":"Add to queue"),m=n.querySelector('button[data-test="add-to-playlist-button"]');if(!m)return null;let q=g(m),v=g(m.querySelector("svg"));return A`
        <button
            ...${q}
            data-test="quick-queue"
            aria-label=${a}
            title=${a}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:s,currentIndex:x}=p.getState().playQueue;for(let i=x+1;i<s.length&&s[i].priority==="priority_keep";i++)if(s[i].mediaItemId===e){d.playQueue.removeAtIndex({index:i}),d.message.messageInfo({message:"Removed from play queue"}),t(!1);return}d.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),d.message.messageInfo({message:"Added to play queue"}),t(!0)}}
        >
            <svg ...${v}>
                <use href=${u}></use>
            </svg>
        </button>
    `},M=(n,e,t,o,r)=>{let u=n.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=n.querySelector(t);if(a!==null&&(u=o,c(u)))return a.parentElement.insertBefore(u,r instanceof Element?r:r?n.querySelector(r):a)},I=(n,e)=>{M(n,"quick-queue",'button[data-test="add-to-playlist-button"]',Q({children:()=>k(n,Number(e))}),'button[data-test="add-to-playlist-button"]')};var h=[],f=new MutationObserver(n=>{for(let e of n)if(e.type==="childList"){for(let t of e.addedNodes)if(c(t)){let o=t.querySelectorAll('div[data-test="tracklist-row"]');o.length!==0&&$(o)}}}),$=async n=>{for(let e of n){let t=e.getAttribute("data-track-id");if(t==null)return;I(e,t)}},B=()=>{f.disconnect(),f.observe(document.body,{childList:!0,subtree:!0})};B();h.push(...E());var U=()=>{h.forEach(n=>n()),f.disconnect()};export{U as onUnload,B as updateObserver};

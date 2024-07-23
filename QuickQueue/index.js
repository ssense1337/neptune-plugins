var c=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as d,store as m,intercept as y}from"@neptune";import{ReactiveRoot as x}from"@neptune/components";import{$ as Q,html as _}from"@neptune/voby";var l=new Map,g=()=>[y("playQueue/ADD_MEDIA_ITEMS_TO_QUEUE",([{mediaItemIds:t}])=>{t.forEach(e=>{l.has(e)&&l.get(e)(!0)})}),y("playQueue/REMOVE_ELEMENT",([{uid:t}])=>{let e=m.getState().playQueue,n=e.currentIndex;for(let o=n+1;o<e.elements.length&&e.elements[o].priority==="priority_keep";o++)if(e.elements[o].uid===t){let r=e.elements[o].mediaItemId;l.has(r)&&l.get(r)(!1);return}})],b=t=>{let e=t.attributes,n={};for(let o=0;o<e.length;o++){let r=e[o];n[r.name]=r.value}return n},A=(t,e)=>{let n=Q(!1),{elements:o,currentIndex:r}=m.getState().playQueue;for(let s=r+1;s<o.length&&o[s].priority==="priority_keep";s++)o[s].mediaItemId===e&&n(!0);l.set(e,n);let u=n?"detail-view__trashcan":"player__queue-add",a=n?"Remove from queue":"Add to queue",p=t.querySelector('button[data-test="add-to-playlist-button"]');if(!p)return null;let h=b(p),q=b(p.querySelector("svg"));return _`
        <button
            ...${h}
            data-test="quick-queue"
            aria-label=${a}
            title=${a}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:s,currentIndex:v}=m.getState().playQueue;for(let i=v+1;i<s.length&&s[i].priority==="priority_keep";i++)if(s[i].mediaItemId===e){d.playQueue.removeAtIndex({index:i}),d.message.messageInfo({message:"Removed from play queue"});return}d.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),d.message.messageInfo({message:"Added to play queue"})}}
        >
            <svg ...${q}>
                <use href=${`#${u}`}></use>
            </svg>
        </button>
    `},k=(t,e,n,o,r)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(n);if(a!==null&&(u=o,c(u)))return a.parentElement.insertBefore(u,r instanceof Element?r:r?t.querySelector(r):a)},E=(t,e)=>{let n=A(t,e);k(t,"quick-queue",'button[data-test="add-to-playlist-button"]',x({children:n}),'button[data-test="add-to-playlist-button"]')};var I=[],f=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let n of e.addedNodes)if(c(n)){let o=n.querySelectorAll('div[data-test="tracklist-row"]');o.length!==0&&$(o)}}}),$=async t=>{for(let e of t){let n=e.getAttribute("data-track-id");if(n==null)return;E(e,n)}},M=()=>{f.disconnect(),f.observe(document.body,{childList:!0,subtree:!0})};M();I.push(...g);var D=()=>{I.forEach(t=>t()),f.disconnect()};export{D as onUnload,M as updateObserver};

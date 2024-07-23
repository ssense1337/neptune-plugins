var c=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as d,store as m}from"@neptune";import{ReactiveRoot as v}from"@neptune/components";import{$ as x,html as Q}from"@neptune/voby";var l=new Map,b=()=>[intercept("playQueue/ADD_MEDIA_ITEMS_TO_QUEUE",([{mediaItemIds:t}])=>{t.forEach(e=>{l.has(e)&&l.get(e)(!0)})}),intercept("playQueue/REMOVE_ELEMENT",([{uid:t}])=>{let e=m.getState().playQueue,n=e.currentIndex;for(let o=n+1;o<e.elements.length&&e.elements[o].priority==="priority_keep";o++)if(e.elements[o].uid===t){let r=e.elements[o].mediaItemId;l.has(r)&&l.get(r)(!1);return}})],y=t=>{let e=t.attributes,n={};for(let o=0;o<e.length;o++){let r=e[o];n[r.name]=r.value}return n},_=(t,e)=>{let n=x(!1),{elements:o,currentIndex:r}=m.getState().playQueue;for(let s=r+1;s<o.length&&o[s].priority==="priority_keep";s++)o[s].mediaItemId===e&&n(!0);l.set(e,n);let u=n?"detail-view__trashcan":"player__queue-add",a=n?"Remove from queue":"Add to queue",p=t.querySelector('button[data-test="add-to-playlist-button"]');if(!p)return null;let I=y(p),h=y(p.querySelector("svg"));return Q`
        <button
            ...${I}
            data-test="quick-queue"
            aria-label=${a}
            title=${a}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:s,currentIndex:q}=m.getState().playQueue;for(let i=q+1;i<s.length&&s[i].priority==="priority_keep";i++)if(s[i].mediaItemId===e){d.playQueue.removeAtIndex({index:i}),d.message.messageInfo({message:"Removed from play queue"});return}d.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),d.message.messageInfo({message:"Added to play queue"})}}
        >
            <svg ...${h}>
                <use href=${`#${u}`}></use>
            </svg>
        </button>
    `},A=(t,e,n,o,r)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(n);if(a!==null&&(u=o,c(u)))return a.parentElement.insertBefore(u,r instanceof Element?r:r?t.querySelector(r):a)},g=(t,e)=>{let n=_(t,e);A(t,"quick-queue",'button[data-test="add-to-playlist-button"]',v({children:n}),'button[data-test="add-to-playlist-button"]')};var E=[],f=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let n of e.addedNodes)if(c(n)){let o=n.querySelectorAll('div[data-test="tracklist-row"]');o.length!==0&&k(o)}}}),k=async t=>{for(let e of t){let n=e.getAttribute("data-track-id");if(n==null)return;g(e,n)}},$=()=>{f.disconnect(),f.observe(document.body,{childList:!0,subtree:!0})};$();E.push(...b);var R=()=>{E.forEach(t=>t()),f.disconnect()};export{R as onUnload,$ as updateObserver};

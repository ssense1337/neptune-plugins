var c=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as d,store as m,intercept as y}from"@neptune";import{ReactiveRoot as Q}from"@neptune/components";import{$ as A,html as _,useMemo as b}from"@neptune/voby";var l=new Map,E=()=>[y(["playQueue/ADD_LAST","playQueue/ADD_NEXT"],([{mediaItemIds:t}])=>{t.forEach(e=>{l.has(e)&&l.get(e)(!0)})}),y("playQueue/REMOVE_ELEMENT",([{uid:t}])=>{let e=m.getState().playQueue,n=e.currentIndex;for(let o=n+1;o<e.elements.length&&e.elements[o].priority==="priority_keep";o++)if(e.elements[o].uid===t){let r=e.elements[o].mediaItemId;l.has(r)&&l.get(r)(!1);return}})],g=t=>{let e=t.attributes,n={};for(let o=0;o<e.length;o++){let r=e[o];n[r.name]=r.value}return n},k=(t,e)=>{let n=A(!1),{elements:o,currentIndex:r}=m.getState().playQueue;for(let s=r+1;s<o.length&&o[s].priority==="priority_keep";s++)o[s].mediaItemId===e&&n(!0);l.set(e,n);let u=b(()=>"#"+(n()?"detail-view__trashcan":"player__queue-add")),a=b(()=>n()?"Remove from queue":"Add to queue"),p=t.querySelector('button[data-test="add-to-playlist-button"]');if(!p)return null;let q=g(p),v=g(p.querySelector("svg"));return _`
        <button
            ...${q}
            data-test="quick-queue"
            aria-label=${a}
            title=${a}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:s,currentIndex:x}=m.getState().playQueue;for(let i=x+1;i<s.length&&s[i].priority==="priority_keep";i++)if(s[i].mediaItemId===e){d.playQueue.removeAtIndex({index:i}),d.message.messageInfo({message:"Removed from play queue"}),n(!1);return}d.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),d.message.messageInfo({message:"Added to play queue"}),n(!0)}}
        >
            <svg ...${v}>
                <use href=${u}></use>
            </svg>
        </button>
    `},$=(t,e,n,o,r)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(n);if(a!==null&&(u=o,c(u)))return a.parentElement.insertBefore(u,r instanceof Element?r:r?t.querySelector(r):a)},I=(t,e)=>{$(t,"quick-queue",'button[data-test="add-to-playlist-button"]',Q({children:()=>k(t,Number(e))}),'button[data-test="add-to-playlist-button"]')};var h=[],f=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let n of e.addedNodes)if(c(n)){let o=n.querySelectorAll('div[data-test="tracklist-row"]');o.length!==0&&B(o)}}}),B=async t=>{for(let e of t){let n=e.getAttribute("data-track-id");if(n==null)return;I(e,n)}},M=()=>{f.disconnect(),f.observe(document.body,{childList:!0,subtree:!0})};M();h.push(...E());var C=()=>{h.forEach(t=>t()),f.disconnect()};export{C as onUnload,M as updateObserver};

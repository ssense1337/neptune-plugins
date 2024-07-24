var c=t=>t?.nodeType===Node.ELEMENT_NODE;import{actions as d,store as m,intercept as y}from"@neptune";import{ReactiveRoot as Q}from"@neptune/components";import{$ as A,html as _,useMemo as b,useCleanup as k}from"@neptune/voby";var i=new Map,E=()=>[y(["playQueue/ADD_LAST","playQueue/ADD_NEXT"],([{mediaItemIds:t}])=>{t.forEach(e=>{i.has(e)&&i.get(e)(!0)})}),y("playQueue/REMOVE_ELEMENT",([{uid:t}])=>{let e=m.getState().playQueue,n=e.currentIndex;for(let o=n+1;o<e.elements.length&&e.elements[o].priority==="priority_keep";o++)if(e.elements[o].uid===t){let r=e.elements[o].mediaItemId;i.has(r)&&i.get(r)(!1);return}})],g=t=>{let e=t.attributes,n={};for(let o=0;o<e.length;o++){let r=e[o];n[r.name]=r.value}return n},$=(t,e)=>{let n=A(!1),{elements:o,currentIndex:r}=m.getState().playQueue;for(let s=r+1;s<o.length&&o[s].priority==="priority_keep";s++)o[s].mediaItemId===e&&n(!0);i.set(e,n),k(()=>i.delete(e));let u=b(()=>"#"+(n()?"detail-view__trashcan":"player__queue-add")),a=b(()=>n()?"Remove from queue":"Add to queue"),p=t.querySelector('button[data-test="add-to-playlist-button"]');if(!p)return null;let q=g(p),v=g(p.querySelector("svg"));return _`
        <button
            ...${q}
            data-test="quick-queue"
            aria-label=${a}
            title=${a}
            style="padding: 4px;"
            onClick=${async()=>{let{elements:s,currentIndex:x}=m.getState().playQueue;for(let l=x+1;l<s.length&&s[l].priority==="priority_keep";l++)if(s[l].mediaItemId===e){d.playQueue.removeAtIndex({index:l}),d.message.messageInfo({message:"Removed from play queue"}),n(!1);return}d.playQueue.addLast({mediaItemIds:[e],context:{type:"user"}}),d.message.messageInfo({message:"Added to play queue"}),n(!0)}}
        >
            <svg ...${v}>
                <use href=${u}></use>
            </svg>
        </button>
    `},B=(t,e,n,o,r)=>{let u=t.querySelector(`button[data-test="${e}"]`);if(u!==null)return;let a=t.querySelector(n);if(a!==null&&(u=o,c(u)))return a.parentElement.insertBefore(u,r instanceof Element?r:r?t.querySelector(r):a)},h=(t,e)=>{B(t,"quick-queue",'button[data-test="add-to-playlist-button"]',Q({children:()=>$(t,Number(e))}),'button[data-test="add-to-playlist-button"]')};var I=[],f=new MutationObserver(t=>{for(let e of t)if(e.type==="childList"){for(let n of e.addedNodes)if(c(n)){let o=n.querySelectorAll('div[data-test="tracklist-row"]');o.length!==0&&M(o)}}}),M=async t=>{for(let e of t){let n=e.getAttribute("data-track-id");if(n==null)return;h(e,n)}},N=()=>{f.disconnect(),f.observe(document.body,{childList:!0,subtree:!0})};N();I.push(...E());var U=()=>{I.forEach(t=>t()),f.disconnect()};export{U as onUnload,N as updateObserver};
